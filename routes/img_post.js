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

router.post('/save_post', [md_auth.authenticated, md_upload],  PostImgController.save);

module.exports = router;
