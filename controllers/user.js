//Controlador de usuarios

'use strict';

//Cargar libreria para Validar
var validator = require('validator');
// Cargar modelo Usuario
var User = require('../models/user');
//Cargar libreria de encriptado
var bcrypt = require('bcryptjs');

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
    var validate_name     = !validator.isEmpty(params.name);
    var validate_surname  = !validator.isEmpty(params.surname);
    var validate_email    = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);

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
            message: "Error al comprobar duplicidad del usuario",
            params
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
                  message: "Error al registrar el usuario",
                  params
                });
              }

              if (!userStored) {
                return res.status(500).send({
                  message: "El usuario no se ha guardado",
                  params
                });
              }

              //Devolver respuesta
              return res.status(200).send({
                status: 'success',
                user: userStored
              });
            });//Close save
          });//Close bcrypt

        }else {
          return res.status(500).send({
            message: "Elusuario ya esta registrado.",
            params
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
    var validate_email    = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);

    if (!validate_email || !validate_password) {
      return res.status(200).send({
        message: "Datos incorrectos, envielos bien."
      });
    }
      //Buscar usuarios que coincidan con el email
      User.findOne({email: params.email.toLowerCase()}, (err, user) =>{

        if (err) {
          return res.status(500).send({
            message: "Error al intentar identificrse"
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



  }

};

module.exports = controller;
