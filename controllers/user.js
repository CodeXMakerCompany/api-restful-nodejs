//Controlador de usuarios

'use strict';

//Instanciar libreria para Validar
var validator = require('validator');

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

      //Asignar valores al usuario

      //Comprobar si el usuario ya exite

      //Si no existe cifrar password

      //Guardar los datos

      //Devolver respuesta

      console.log("detecto toda la data en orden");
    }else {
      return res.status(400).send({
        message: "Validacion de los datos del usuario incorrectp. Intentelo de nuevo."
      });
    }


    return res.status(200).send({
      message: "Registro de usuarios",
      params
    });
  }

};

module.exports = controller;
