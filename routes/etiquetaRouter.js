const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');
const { obtenerEtiquetasGaleria, actualizarEtiquetasGaleria } = require('../controllers/etiquetaControllers.js');

const routes = express.Router();

routes.get('/galeria/:id', validarJWT, obtenerEtiquetasGaleria);
routes.put('/galeria/:id', validarJWT, actualizarEtiquetasGaleria);

module.exports = routes;
