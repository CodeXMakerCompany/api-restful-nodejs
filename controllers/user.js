//Controlador de usuarios

'use strict';

//Instanciar libreria para Validar
var validator = require('validator');
var User = require('../models/user');

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

          //Guardar los datos

          //Devolver respuesta
          return res.status(200).send({
            message: "El usuario no esta registrado",
            params
          });
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

  }

};

module.exports = controller;
