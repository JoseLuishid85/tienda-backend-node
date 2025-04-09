const express = require('express');
const  validarJWTCliente  = require('../middlewares/validar-token-cliente.js');

const { crearDetalle } = require('../controllers/detalleVentaControllers.js')

const routes = express.Router();

routes.post('/', validarJWTCliente,  crearDetalle);
//routes.get('/cliente/:id_venta', validarJWTCliente,  obtenerDetallesVentaCliente);
//routes.get('/cliente2/:id_venta', validarJWTCliente,  obtenerDetallesVentaCliente2);



module.exports = routes;