'use strict'

let validator = require('validator');
let fs = require('fs');
let path = require('path');

let Article = require('../models/article');

let controller = {

    datosCurso: (req, res) => {
        let hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en frameworks JS',
            autor: 'Victor Robles WEB',
            url: 'victorroblesweb.es',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de artículos'
        });
    },

    save: (req, res) => {
        // Recoger parámetros por post
        let params = req.body;


        // Validar datos (validator)
        let validate_title;
        let validate_content;
        try {
            validate_title = !validator.isEmpty(params.title); // !validator.isEmpty(params.title) --> será true cuando validate_title tenga parametros
            validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_title && validate_content) {

            // Crear objeto a guardar
            var article = new Article();

            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            if(params.image) {
                article.image = params.image;
            } else {
                article.image = null;
            }

            // Guardar artículo
            article.save().then((articleStored) => {

                if (!articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado !!!'
                    });
                }

                // Devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            }).catch((error) => {
                return res.status(404).json({
                    status: "error",
                    mensaje: "Ha ocurrido un error",
                    error
                });
            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }

    },

    getArticles: (req, res) => {

        // Variable de la consulta
        var query = Article.find({});

        // Limitamos la consulta a 5 registros
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        // Find
        query.sort('-_id').exec().then((articles) => {

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        }).catch((error) => {
            return res.status(404).json({
                status: "error",
                mensaje: 'Error al devolver los artículos !!!',
                error
            });
        });
    },

    getArticle: (requ, res) => {

        // Recoger el id de la url
        var articleId = requ.params.id;

        // Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el artículo !!!'
            });
        }

        // Buscar el artículo
        Article.findById(articleId).then((article) => {

            if (!article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });

        }).catch((error) => {
            return res.status(404).json({
                status: "error",
                mensaje: 'No existe el artículo !!!',
                error
            });
        });
    },

    update: (req, res) => {
        // Recoger el id del artículo por la url
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_title && validate_content) {
            // Find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true },).then((articleUpdated) => {

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: "error",
                        mensaje: 'No existe el artículo !!!',
                        error
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });

            }).catch((error) => {
                return res.status(500).json({
                    status: "error",
                    mensaje: 'No al actualizar !!!',
                    error
                });
            });

        } else {
            // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'No existe el artículo !!!'
            });

        }
    },

    delete: (req, res) => {
        // Recoger el id de la url
        var articleId = req.params.id;

        // Find and delete
        Article.findOneAndDelete({ _id: articleId }).then((articleRemoved) => {

            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el artículo, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });

        }).catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: 'Error al borrar !!!',
                error
            });
        });
    },

    upload: (req, res) => {
        // Configurar el módulo del connect multiparty router/article.js (hecho)

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir el nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        //var file_ext = path.extname(req.file.originalname);

        // Comprobar la extensión, solo imágenes, si no es válida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });

        } else {
            // Si todo es válido, sacando id de la url
            var articleId = req.params.id;

            if (articleId) {
                // Buscar artículo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }).then((articleUpdated) => {

                    if (!articleUpdated) {
                        return res.status(200).send({
                            status: "error",
                            message: 'Error al guardar la imagen del artículo'
                        });
                    }

                    return res.status(200).send({
                        status: "success",
                        article: articleUpdated
                    });

                }).catch((error) => {
                    return res.status(500).json({
                        status: "error",
                        mensaje: 'Error al subir !!!',
                        error
                    });
                });

            } else {
                return res.status(200).send({
                    status: "success",
                    image: file_name
                });
            }
        }
    }, // end upload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {

            if (exists) {

                return res.sendFile(path.resolve(path_file));

            } else {

                return res.status(404).send({
                    status: "error",
                    message: 'La imagen no existe'
                });
            }
        });
    },

    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec()
            .then(articles => {
                if (articles && articles.length > 0) {
                    return res.status(200).send({
                        status: 'success',
                        articles
                    });
                } else {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu búsqueda.',
                        articles
                    });
                }
            })
            .catch(err => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición.',
                        err
                    });
                }
            });
    }

} // end controller

module.exports = controller;