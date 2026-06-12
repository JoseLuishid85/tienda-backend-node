const express = require('express');
const validarJWTCliente = require('../middlewares/validar-token-cliente.js');
const validarJWT = require('../middlewares/validar-token.js');

const {
    crearVenta,
    getVentas,
    obtenerVenta,
    obtenerVentaTransaccion,
    getVentasCliente,
    getVentasAdmin,
    obtenerVentaAdmin,
    cambiarEstadoVentaAdmin,
    getVentasDiaAdmin,
    getReporteVentas
} = require('../controllers/ventaControllers.js')


const routes = express.Router();

routes.get('/admin', validarJWT, getVentasAdmin);
routes.get('/report', validarJWT, getReporteVentas);
routes.get('/day', validarJWT, getVentasDiaAdmin);
routes.get('/admin/cambiar-estado/:id/:estado', validarJWT, cambiarEstadoVentaAdmin);
routes.get('/admin/:id', validarJWT, obtenerVentaAdmin);

routes.get('/cliente/:id_cliente', validarJWT, getVentasCliente);
routes.get('/transaccion/:id_payment', validarJWT, obtenerVentaTransaccion);

routes.post('/', validarJWTCliente, crearVenta);
routes.get('/', validarJWTCliente, getVentas);
routes.get('/:id', validarJWTCliente, obtenerVenta);






module.exports = routes;