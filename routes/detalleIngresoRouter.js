const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');
const { registroDetalleIngresoAdmin, obtenerDetalleIngresoAdmin } = require('../controllers/detalleIngresoControllers.js');


const routes = express.Router();

routes.post('/', validarJWT, registroDetalleIngresoAdmin);
routes.get('/ingreso/:id', validarJWT, obtenerDetalleIngresoAdmin);


module.exports = routes; 