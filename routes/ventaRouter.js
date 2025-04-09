const express = require('express');
const validarJWTCliente  = require('../middlewares/validar-token-cliente.js');
const validarJWT = require('../middlewares/validar-token.js');

const { crearVenta } = require('../controllers/ventaControllers.js')

const routes = express.Router();

//routes.get('/admin', validarJWT,  getVentasAdmin);
//routes.get('/admin/:id', validarJWT,  obtenerVentaAdmin);

routes.post('/', validarJWTCliente,  crearVenta);

//routes.get('/', validarJWTCliente,  getVentas);
//routes.get('/:id', validarJWTCliente,  obtenerVenta);

//routes.get('/transaccion/:id_payment', validarJWTCliente,  obtenerVentaTransaccion);
//routes.get('/cliente/:id_cliente', validarJWTCliente,  getVentasCliente);



module.exports = routes;