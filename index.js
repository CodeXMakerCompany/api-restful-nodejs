'use strict';

//El alias esta guardado en NPM
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_restful_nodejs', { useUnifiedTopology: true, useNewUrlParser: true })
        .then(() =>{
          console.log('La conexion a la base de datos de mongo se ha realizado correctamente');

          //Crear el servidor
          app.listen(port, () => {
              console.log('El servidor localhost:27017 esta funcionando !!');
          });

        })
        .catch(error => console.log(error));
