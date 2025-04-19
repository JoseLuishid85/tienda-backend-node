const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');
const multer = require('multer');
const path = require('path');
const {
    crearCategoria,
    getCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
    actualizarEstadoCategoria,
    obtenerImageCategoria
} = require('../controllers/categoriaControllers.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/categorias'); 
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname); 
        cb(null, Date.now() + ext); 
    }
});


const routes = express.Router();

const upload = multer({ storage });


routes.get('/', validarJWT, getCategorias);     
routes.post('/', [validarJWT, upload.single('imagen')],  crearCategoria);
routes.get('/:id', validarJWT, obtenerCategoria);
routes.put('/:id', [validarJWT, upload.single('imagen')], actualizarCategoria);
routes.delete('/:id', validarJWT, eliminarCategoria);

routes.get('/image/:img', obtenerImageCategoria); 

routes.put('/estado/:id', validarJWT, actualizarEstadoCategoria);

module.exports = routes;