const express = require('express');
const  validarJWTCliente  = require('../middlewares/validar-token-cliente.js');
const { getDirecciones, crearDireccionCliente, obtenerDireccion, obtenerDireccionCliente, actualizarDireccion, eliminarDireccion } = require('../controllers/direccionControllers.js')

const routes = express.Router();

routes.get('/', validarJWTCliente,  getDirecciones);
routes.post('/', validarJWTCliente,  crearDireccionCliente);
routes.get('/:id', validarJWTCliente,  obtenerDireccion);
routes.get('/cliente/:id', validarJWTCliente,  obtenerDireccionCliente);
routes.put('/:id', validarJWTCliente,  actualizarDireccion);
routes.delete('/:id', validarJWTCliente,  eliminarDireccion);


module.exports = routes;