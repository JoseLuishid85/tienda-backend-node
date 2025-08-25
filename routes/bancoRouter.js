const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');
const {  crearBanco, getBancos, getBanco, actualizarBanco, eliminarBanco } = require('../controllers/bancoControllers.js')

const routes = express.Router();

routes.post('/', validarJWT,  crearBanco);
routes.get('/', validarJWT , getBancos); 
routes.get('/:id', validarJWT , getBanco); 
routes.put('/:id', validarJWT , actualizarBanco); 
routes.delete('/:id', validarJWT , eliminarBanco); 


module.exports = routes;