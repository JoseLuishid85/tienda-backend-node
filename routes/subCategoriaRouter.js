const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');
const {
    crearSubCategoria,
    getSubCategorias,
    obtenerSubCategoria,
    actualizarSubCategoria,
    eliminarSubCategoria,
    obtenerSubCategorias_Categoria
} = require('../controllers/subCategoriaControllers.js');


const routes = express.Router();

routes.post('/', validarJWT,  crearSubCategoria);
routes.get('/', validarJWT, getSubCategorias);     
routes.get('/:id', validarJWT, obtenerSubCategoria);
routes.put('/:id', validarJWT, actualizarSubCategoria);
routes.delete('/:id', validarJWT, eliminarSubCategoria);

routes.get('/categoria/:id', validarJWT, obtenerSubCategorias_Categoria);


module.exports = routes;