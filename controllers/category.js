//Controlador de category

'use strict';
//Cargar Modelo
var Category = require('../models/category');
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
      message: "Soy el metodo probando categorias"
    });
  },

  save: function(req, res){
    //Recoger parametros
    var params = req.body;

    //Validar datos
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
      //Instanciar nuevo objeto
      var category = new Category();

      //Asignar valores a la categoria
      category.name = params.name;
      category.description = params.description;
      category.image = file_name;
      category.created_at = new Date();

      //Guardar
      category.save((err, categoryStored) => {
        if (err) {
          return res.status(500).send({
            message: "Error al guardar la categoria."
          });
        }

          if (!categoryStored) {
            return res.status(500).send({
              message: "Error al guardar la categoria."
            });
          }

          return res.status(200).send({category: categoryStored});
        });// Close save
    }
  },

  delete:function(req, res){
    return res.status(200).send({
      message: "Soy el metodo de borrar"
    });
  },

  getCategories: function(req, res){
    Category.find().exec((err, categories) =>{
      if (err || !categories) {
        return res.status(404).send({
          status: 'error',
          message: "No hay categorias que mostrar."
        });
      }
      return res.status(200).send({
        status: 'success',
        categories
      });
    });
  },

  getImgCategory: function(req, res){

    var fileName = req.params.fileName;
    var pathFile = './uploads/category/'+fileName;

    //Comprobar que exista el fichero
    fs.exists(pathFile, (exists) => {

      if (exists) {
        res.sendFile(path.resolve(pathFile));
      }else{
        return res.status(404).send({
          message: "La imagen no existe"
        });
      }

    });

  }

};

module.exports = controller;
