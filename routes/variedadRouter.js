const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');
const { registroVariedad, obtenerVariedadProducto, eliminarVariedad } = require('../controllers/variedadControllers.js');


const routes = express.Router();

routes.post('/', validarJWT,  registroVariedad);
routes.get('/:id', validarJWT,  obtenerVariedadProducto);
routes.delete('/:id', validarJWT,  eliminarVariedad);



module.exports = routes;