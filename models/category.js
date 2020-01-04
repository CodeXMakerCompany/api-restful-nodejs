//Modelo category

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
  name: String
});

module.exports = mongoose.model('Category', CategorySchema);
                                //lowercase y pluralizar el nombre
                                //users -> documentos(schema)
