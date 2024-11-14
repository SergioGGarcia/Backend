'use strict'

let express = require('express');
let ArticleController = require('../controllers/article');

let router = express.Router();

//var path = require('path');

// Configurar el módulo del connect multiparty router/article.js para el método de upload
let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir: './upload/articles'});

// Carga de ficheros con modulo multer
/* cargando módulo multier */
//const multer = require("multer");

/* configurar donde se van a subir los ficheros en el servidor y cual va a ser su nombre de esos archivos */
/*const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, './upload/articles') // Ruta donde se guardarán los archivos subidos
    },

    filename: function (req, file, cb) {
      //const articleId = req.params.id; // Obtener el ID del artículo de la petición
      //const fileExt = path.extname(file.originalname); // Obtener la extensión del archivo
      //cb(null, articleId + fileExt); // Nombre del archivo será el ID del artículo + extensión
      cb(null, "articles" + Date.now() + file.originalname);
    }

});*/

/* crear objeto de multer y pasarle la configuración */
//const upload = multer({ dest: './upload/articles' });

// Rutas de prueba
router.get('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);

// Rutas útiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
//router.post('/upload-image/:id?', [upload.single('file0')], ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;