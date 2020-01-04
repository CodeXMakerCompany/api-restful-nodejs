//Rutas post imagenes

var express = require('express');
var PostImgController = require('../controllers/img_post');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

//Subir multimedia
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/posts' });

//Rutas de prueba
router.get('/probandoPost',  PostImgController.probando);

//guardar
router.post('/save_post', [md_auth.authenticated, md_upload],  PostImgController.save);
//borrar
router.delete('/delete_post/:id', md_auth.authenticated, PostImgController.delete);
//listar por paginas (opcional)
router.get('/get_posts/:page?',  PostImgController.listPosts);
//mi contenido subido
router.get('/my_posts/:user',  PostImgController.getMyPostByUser);
//mi post
router.get('/post/:id',  PostImgController.getPost);
//Buscar imagenes
router.get('/search/:search',  PostImgController.search);

module.exports = router;
