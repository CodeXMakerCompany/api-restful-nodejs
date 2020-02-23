//Rutas category

var express = require('express');
var CategoryController = require('../controllers/category');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

//Subir multimedia
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/category' });

//Rutas de prueba
router.get('/probandoCat',  CategoryController.probando);

//guardar
router.post('/save_category', [md_auth.authenticated, md_upload],  CategoryController.save);
//borrar
router.get('/delete_category',  CategoryController.delete);
//listar
router.get('/get_categories',  CategoryController.getCategories);

//
router.get('/category_img/:fileName', CategoryController.getImgCategory);

module.exports = router;
