'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'clave-secreta-para-generar-token-6969';

exports.authenticated = function(req, res, next){
  //Comprobar si llega la authorizacion


  if(!req.headers.authorization) {
    return res.status(403).send({
      message: 'La peticion no tiene la cabecera de authorization'
    });
  }

  // Limpiar token y quitar comillas
  var token = req.headers.authorization.replace(/['"]+/g, '');


  try {
  // Decodificar el token
  var payload = jwt.decode(token, secret);

  // Comprobar si el token ha expirado
  if (payload.exp <= moment().unix()) {
    return res.status(404).send({
      message: 'El token ha expirado'
    });
  }

  } catch (ex) {
    return res.status(404).send({
      message: 'El token no es valido'
    });
  }

  // Adjuntar usuario identificado a request
  req.user = payload;

  //Pasa a seguir con las instrucciones del controlador
  next();
};
