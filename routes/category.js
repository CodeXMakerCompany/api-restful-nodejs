//Rutas category

var express = require('express');
var CategoryController = require('../controllers/category');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

//Rutas de prueba
router.get('/probandoCat',  CategoryController.probando);

//guardar
router.post('/save_category', md_auth.authenticated,  CategoryController.save);
//borrar
router.get('/delete_category',  CategoryController.delete);
//listar
router.get('/get_categories',  CategoryController.getCategories);

module.exports = router;
