//Modelo img_post

'use strict';

var mongoose = require('mongoose');
// Libreria de paginacion
var mongoosePaginate = require('mongoose-paginate-v2');
//Instanciar eschema
var Schema = mongoose.Schema;


//Modelo de comentarios
var CommentSchema = Schema({
  userId: { type: Schema.ObjectId, ref: 'User' },
  content: String,
  date: { type: Date, default: Date.now }
});

//Objeto de comentarios
var Comment = mongoose.model('Comment', CommentSchema);

//Modelo de post
var ImgPostSchema = Schema({
  userId: { type: Schema.ObjectId, ref: 'User' },
  categoryId: String,
  title: String,
  content: String,
  image: String,
  date: { type: Date, default: Date.now },
  comments: [CommentSchema]
});

//Cargar paginacion
ImgPostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('ImgPost', ImgPostSchema);
                                //lowercase y pluralizar el nombre
                                //users -> documentos(schema)
