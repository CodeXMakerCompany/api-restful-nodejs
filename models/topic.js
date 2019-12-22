//Modelo topics

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Modelos de Comment
var CommentSchema = Schema({
  content: String,
  user_id:{type: Schema.ObjectId, ref:'User'},
  date: { type: Date, default: Date.now }
});

var Comment = mongoose.model('Comment', CommentSchema);

//Modelo de Topic
var TopicSchema = Schema({
  user_id:{type: Schema.ObjectId, ref:'User'},
  title: String,
  content: String,
  code: String,
  lang: String,
  date: { type: Date, default: Date.now },
  coments: [CommentSchema]
});

module.exports = mongoose.model('Topic', TopicSchema);
                                //lowercase y pluralizar el nombre
                                //users -> documentos(schema)
