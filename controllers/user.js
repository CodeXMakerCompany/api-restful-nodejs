//Controlador de usuarios

'use strict';
//Cargar Modelo
var User = require('../models/user');
//Cargar liberia de encriptacion
var bcrypt = require('bcryptjs');
//Cargar libreria para Validar
var validator = require('validator');
// Cargar modelo Usuario
var User = require('../models/user');
//Cargar libreria de encriptado
var bcrypt = require('bcryptjs');
//Libreria para ficheros
var fs = require('fs');
var path = require('path');


//Servicios
//token jwt
var jwt = require('../services/jwt');

var controller = {

  probando: function(req, res){
    return res.status(200).send({
      message: "Soy el metodo probando"
    });
  },

  testeando: function(req, res){
    return res.status(200).send({
      message: "Soy el metodo testeando"
    });
  },

  save: function(req, res){
    //Recoger los parametros de la petición
    var params = req.body;

    //Validar los datos
    try {
      var validate_name     = !validator.isEmpty(params.name);
      var validate_surname  = !validator.isEmpty(params.surname);
      var validate_email    = !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    } catch (err) {
      return res.status(200).send({
        message: "No se han enviado los datos correctos"
      });
    }


    //console.log(validate_name, validate_surname, validate_email, validate_password);

    if (validate_name && validate_surname && validate_email && validate_password) {
      //Crear objeto
      var user = new User();

      //Asignar valores al usuario
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email.toLowerCase();
      user.role = 'ROLE_USER';
      user.image = null;

      //Comprobar si el usuario ya exite
      User.findOne({email: user.email}, (err, issetUser) => {
        if (err) {
          return res.status(500).send({
            message: "Error al comprobar duplicidad del usuario."
          });
        }

        if (!issetUser) {
          //Si no existe cifrar password
          bcrypt.hash(params.password, 8, function(err, hash) {
            user.password = hash;

           //Guardar los datos
           user.save((err, userStored) => {
             if (err) {
               return res.status(500).send({
                 message: "Error al guardar usuario."
               });
             }

               if (!userStored) {
                 return res.status(500).send({
                   message: "Error al guardar usuario."
                 });
               }

               return res.status(200).send({user: userStored});
             });// Close save

          });// Close bcrypt

        }else{
          return res.status(200).send({
            message: "El usuario ya esta registrado."
          });
        }

      });

    }else {
      return res.status(400).send({
        message: "Validacion de los datos del usuario incorrecta. Intentelo de nuevo."
      });
    }

  },

  login: function(req, res){
    //Recoger los parametros de la petición
    var params = req.body;

    //Validar los datos
    try {
      var validate_email    = !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    } catch (err) {
      return res.status(500).send({
        message: "No se han enviado los datos necesarios"
      });
    }



    //Buscar usuarios que coincidan con el email
     User.findOne({email: params.email.toLowerCase()}, (err, user) =>{
    // Comprobar la contraseña (Conincidencia de email y usuario / bcrypt)

        if (err) {
          return res.status(500).send({
            message: "Error al intentar identificarse"
          });
        }

        if (!user) {
          return res.status(404).send({
            message: "El usuario no existe"
          });
        }

        //Si lo encuentra
        //Comprobar que la contraseña (conicidencia de email y password / bcryptjs)
        bcrypt.compare(params.password, user.password, (err, check) => {

          //Si es correcto
          if (check) {
            //Generar token de jwt y devlverlo(mas tarde)
            if (params.gettoken) {
              //Devolver datos
              return res.status(200).send({
                token: jwt.createToken(user)
              });
            }else{
              //Limpiar objeto eliminar propiedades
              user.password = undefined;
              //Devolver datos
              return res.status(200).send({
                status: "success",
                user
              });
            }

          }else{

            return res.status(200).send({
              message: "Las credenciales no son correctas"
            });
          }

        });

    });
  },

  update: function(req, res){
    // Crear midleware para comprobar el jwt-token, ponerselo a la ruta

    // Recoger los datos del usuario
    var params = req.body;

    //Validar los datos
    try {
      var validate_name     = !validator.isEmpty(params.name);
      var validate_surname  = !validator.isEmpty(params.surname);
      var validate_email    = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    }catch(err){
      return res.status(200).send({
        status: "Faltan datos por enviar",
        params
      });
    }

    // Eliminar propiedades inecesarias
    delete params.password;
    var userId = req.user.sub;

    if (req.user.email == params.email) {
      // Buscar y actualizar
      User.findOneAndUpdate({_id: userId}, params, {new:true}, (err, userUpdated) => {

          if (err) {
            return res.status(500).send({
              status: "error",
              message: 'Error al actualizar el usuario'
            });
          }
          if (!userUpdated) {
            return res.status(500).send({
              status: "error",
              message: 'Error al actualizar el usuario'
            });
          }

          // Dar respuesta
          return res.status(200).send({
            status: "success",
            user: userUpdated
          });

        });
    }
    //Comprobar si el email es unico
    if (req.user.email != params.email) {

      //Buscar usuarios que coincidan con el email
       User.findOne({email: params.email.toLowerCase()}, (err, user) => {

           if (err) {
             return res.status(500).send({
               status: "error",
               message: 'Error al actualizar el usuario'
             });
           }

            if (user) {
              return res.status(200).send({
                message: 'El email no puede ser modificado'
              });
            }

            if (!user) {

              // Buscar y actualizar
              User.findOneAndUpdate({_id: userId}, params, {new:true}, (err, userUpdated) => {

                  if (err) {
                    return res.status(500).send({
                      status: "error",
                      message: 'Error al actualizar el usuario'
                    });
                  }
                  if (!userUpdated) {
                    return res.status(500).send({
                      status: "error",
                      message: 'Error al actualizar el usuario'
                    });
                  }

                  // Dar respuesta
                  return res.status(200).send({
                    status: "success",
                    user: userUpdated
                  });

                });
            }

        });
    }






},

  uploadAvatar: function(req, res){

    // Configurar modulo multiparty (md) routes/users.js

    // Recoger el fichero de la peticion
    var file_name = 'Avatar no subido...';

    if (!req.files) {
      return res.status(404).send({
        status: 'error',
        message: file_name
      });
    }
      // Nombre y extension del archivo subido
      var file_path = req.files.file0.path;
      var file_split = file_path.split('\\');
      // Advertencia **** En linux o mac
      // var file_split = file_path.split('/');
      var file_name = file_split[2];

      //Extension del archivo
      var ext_split = file_name.split('\.');
      var file_ext = ext_split[1];

      // Comprobar extension (solo imagenes), si no es valida borrar fichero subido
      if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
        fs.unlink(file_path, (err) =>{

          return res.status(200).send({
            status: 'error',
            message: "La extensión del archivo no es válida"
          });
        });
      }else{
        // Sacar el id del usuario identificado
        var userId = req.user.sub;

        //Buscar y actualizar documento bd
        User.findOneAndUpdate({_id: userId}, {image: file_name}, {new:true}, (err, userUpdated) =>{

          if (err || !userUpdated) {
            return res.status(500).send({
              status: 'error',
              message: "Error al actualizar el usuario."
            });
          }
          // Devolver respuesta

          return res.status(200).send({
            status: 'success',
            user: userUpdated
          });
        });

      }


    },

  getAvatar: function(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/users/'+fileName;

    //Comprobar que exista el fichero
    fs.exists(pathFile, (exists) => {

      if (exists) {
        res.sendFile(path.resolve(pathFile));
      }else{
        return res.status(404).send({
          message: "La imagen no existe3"
        });
      }

    });

  },

  getUsers: function(req, res){
    User.find().exec((err, users) =>{
      if (err || !users) {
        return res.status(404).send({
          status: 'error',
          message: "No hay usuarios que mostrar."
        });
      }
      return res.status(200).send({
        status: 'success',
        users
      });
    });
  },

  getUser: function(req, res){
    var userId = req.params.userId;

    User.findById(userId).exec((err, user) => {
      if (err || !user) {
        return res.status(404).send({
          status: 'error',
          message: "No existe el usuario."
        });
      }
      return res.status(200).send({
        status: 'success',
        user
      });
    });


  }


};

module.exports = controller;
