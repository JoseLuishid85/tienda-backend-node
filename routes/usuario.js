const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');
const {  postUsuarioAdmin, getUsuarioAdmin, getUsuariosAdmin, updateUsuarioAdmin, cambiarEstadoAdmin } = require('../controllers/usuarioController.js');

const routes = express.Router();

//validarJWT
routes.post('/',  postUsuarioAdmin);
routes.get('/', validarJWT,  getUsuariosAdmin);
routes.get('/:id', validarJWT , getUsuarioAdmin);
routes.put('/:id', validarJWT , updateUsuarioAdmin);
routes.put('/cambiar_estado/:id', validarJWT , cambiarEstadoAdmin);


module.exports = routes;