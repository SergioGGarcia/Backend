'use strict'

let mongoose = require('mongoose');
let app = require('./app');
let port = 3900;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("La conexión a la base de datos correcta!!!");

    // Crear servidor y ponerme a escuchar peticiones HTTP
    app.listen(port, () => {
        console.log("Servidor corriendo en http://localhost:" + port);
    });

});