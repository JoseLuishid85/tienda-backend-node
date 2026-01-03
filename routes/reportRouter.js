const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');
const {  obtenerResumenAnual, obtenerProductosVendidosMes } = require('../controllers/reportControllers.js')

const routes = express.Router();


routes.get('/resumen-anual', validarJWT , obtenerResumenAnual);
routes.get('/productos-mes', validarJWT , obtenerProductosVendidosMes); 


module.exports = routes;