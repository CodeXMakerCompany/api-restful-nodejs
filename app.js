'use strict';

//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();

//Cargar archivos de rutas
var user_routes = require('./routes/user');
var post_routes = require('./routes/img_post');
var category_routes = require('./routes/category');

//Añadir midlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORSE

//Reescribir rutas
app.use('/api', user_routes);
app.use('/api', post_routes);
app.use('/api', category_routes);

// Ruta/metodo de prueba
app.get('/prueba', (req, res) => {
  return res.status(200).send({
    nombre: "codexmaker",
    message: 'Hola mundo desde el back-end con Node',
  });
});

//Exportar modulo
module.exports = app;
