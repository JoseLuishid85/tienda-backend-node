const express = require('express');
const  validarJWTCliente  = require('../middlewares/validar-token-cliente.js');
const {  registrarClienteEcommerce, obtenerClienteToken } = require('../controllers/clienteControllers.js')

const routes = express.Router();

routes.post('/', registrarClienteEcommerce);
routes.get('/:id', validarJWTCliente,  obtenerClienteToken);


module.exports = routes;