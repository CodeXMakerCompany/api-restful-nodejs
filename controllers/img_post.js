//Controlador de posts imagenes

'use strict';
//Cargar Modelo
var Post = require('../models/img_post');
//Cargar liberia de encriptacion
var bcrypt = require('bcryptjs');
//Cargar libreria para Validar
var validator = require('validator');
//Cargar libreria de encriptado
var bcrypt = require('bcryptjs');
//Libreria para ficheros
var fs = require('fs');
var path = require('path');

var controller = {

  probando: function(req, res){
    return res.status(200).send({
      message: "Soy el metodo probando"
    });
  },

  save: function(req, res){
    var params = req.body;
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
        var post = new Post();

        //Asignar valores al usuario
        post.userId = userId;
        post.categoryId = 0;
        post.title = params.title;
        post.content = params.content;
        post.image = file_name;

        // Guardar el registro con los demas parametros
        post.save((err, postStored) => {
          if (err) {
            return res.status(500).send({
              message: "Error al guardar el post."
            });
          }

            if (!postStored) {
              return res.status(500).send({
                message: "Error al guardar el post."
              });
            }

            return res.status(200).send({post: postStored});
          });// Close save
      }

  },

  listPosts: function(req, res){
    return res.status(200).send({
      message: "Mi funcion es devolver data"
    });
  }

};

module.exports = controller;
