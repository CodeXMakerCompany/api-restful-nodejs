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
      if (!req.files.file0) {
        return res.status(404).send({
          status: 'error',
          message: 'No detecto ninguna imagen'
        });
      }
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
        post.categoryId = params.categoryId;
        post.title = params.title;
        post.content = params.content;
        post.image = file_name;

        //Añadir fecha

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

  delete:function(req, res){

    // Sacar el id del post de la url
    var postId = req.params.id;

    // Find and delete por postId y por userId
    Post.findOneAndDelete({_id: postId, user: req.user.sub}, (err, postRemoved) => {

      if (err || !postRemoved) {
        return res.status(500).send({
          status: 'error',
          message: "Error en la petición"
        });
      }

      // Devolver respuesta
      return res.status(200).send({
        status: "success",
        post: postRemoved
      });
    })

  },

  listPosts: function(req, res){

    // Cargar libreria de paginacion en la clase

    // Recoger la pagina actual
    if (!req.params.page || req.params.page == 0 || req.params.page == null || req.params.page == undefined) {
        var page = 1
    }else {
      var page = parseInt(req.params.page);
    }

    // Indicar las opciones de paginacion
    const options = {
      sort:{ date: -1},
      populate: 'userId',
      page: page,
      limit: 12,
      collation: {
        locale: 'es'
      }
    };

    // Find paginado
    Post.paginate({}, options, (err, posts) =>{

      //Devolver resultado (posts, total de posts, total de paginas)
      if (err || !posts) {
        return res.status(404).send({
          status: 'error',
          message: "No hay posts que mostrar."
        });
      }

      return res.status(200).send({
        status: 'success',
        posts: posts.docs,
        totalDocs: posts.totalDocs,
        totalPages: posts.totalPages,
        options
      });

    });

  },

  getMyPostByUser: function(req, res){

    //Conseguir id de usuario
    var userId = req.params.user;

    // Find con una condicion de usuario
    Post.find({
      userId: userId
    })
    .sort([['date', 'descending']])
    .exec((err, posts) => {

      if (err || !posts) {
        return res.status(500).send({
          status: 'error',
          message: "Error en la petición"
        });
      }

      //resultado
      return res.status(200).send({
        status: 'success',
        posts
      });
    });
  },

  getPost: function(req, res){
    // Sacar el id del post de la url
    var postId = req.params.id;

    // Find por id el post
    Post.findById(postId)
        .populate('userId')
        .exec((err, post) => {

          if (err || !post) {
            return res.status(500).send({
              status: 'error',
              message: "Error en la petición"
            });
          }

          return res.status(200).send({
            status: "success",
            post
          });

        });

  },

  search: function(req, res){
    // Sacar el string a buscar
    var searchString = req.params.search;

    // Find con un operador or
    Post.find({ "$or":[
      { "title": { "$regex": searchString, "$options": "i"} },
      { "content": { "$regex": searchString, "$options": "i"} },
      { "tags": { "$regex": searchString, "$options": "i"} },
      ]})
      .exec((err, posts) => {

        if (err || !posts) {
          return res.status(500).send({
            status: 'error',
            message: "Error en la petición"
          });
        }
        //Devolver resultado

        return res.status(200).send({
          status: "success",
          posts
        });

      });

  }

}

module.exports = controller;
