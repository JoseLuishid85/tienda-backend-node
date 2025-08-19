const express = require('express');
const  validarJWTCliente  = require('../middlewares/validar-token-cliente.js');
const {  crearProductoCarrito, listaProductoCarritoID, listaCarritoCliente, eliminarCarrito ,eliminarCarritoCliente} = require('../controllers/customerControllers.js')

const routes = express.Router();

routes.post('/', validarJWTCliente,  crearProductoCarrito);

routes.delete('/:id', validarJWTCliente,  eliminarCarrito);

routes.get('/cliente',validarJWTCliente , listaCarritoCliente); 
routes.get('/:id',validarJWTCliente , listaProductoCarritoID);

routes.delete('/cliente/:clienteId', validarJWTCliente, eliminarCarritoCliente );


module.exports = routes;