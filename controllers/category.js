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

    //Instanciar nuevo objeto
    var category = new Category();

    //Asignar valores a la categoria
    category.name = params.name;

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
  }

};

module.exports = controller;
