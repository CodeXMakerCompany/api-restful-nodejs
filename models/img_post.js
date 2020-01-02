//Modelo img_post

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImgPostSchema = Schema({
  userId: String,
  categoryId: String,
  title: String,
  content: String,
  image: String
});

module.exports = mongoose.model('ImgPost', ImgPostSchema);
                                //lowercase y pluralizar el nombre
                                //users -> documentos(schema)
