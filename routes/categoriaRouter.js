const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');

const {
    crearCategoria
} = require('../controllers/categoriaControllers.js');


const routes = express.Router();



routes.post('/', validarJWT,  crearCategoria);
/*
routes.get('/buscar/:filtro?', validarJWT, getCategorias);     
routes.get('/:id', validarJWT, obtenerCategoria);
routes.put('/:id', validarJWT, actualizarCategoria);
routes.delete('/:id', validarJWT, eliminarCategoria);

routes.put('/estado/:id', validarJWT, actualizarEstadoCategoria);*/

module.exports = routes;