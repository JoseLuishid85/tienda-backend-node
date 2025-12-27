const express = require('express');
const validarJWT = require('../middlewares/validar-token.js');
const {  obtenerResumenAnual } = require('../controllers/reportControllers.js')

const routes = express.Router();


routes.get('/resumen-anual', validarJWT , obtenerResumenAnual); 


module.exports = routes;