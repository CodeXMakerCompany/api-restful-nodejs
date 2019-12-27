'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function(user){

//Objeto que se codificara para el token
  var payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix
  }

  //Respuesta
  return jwt.encode(payload, 'clave-secreta-para-generar-token-6969');

}
