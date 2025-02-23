const express = require('express');
const { loginUsuario, } = require('../controllers/authControllers.js')

const routes = express.Router();

routes.post('/', loginUsuario );
//routes.post('/tienda', loginCliente);

module.exports = routes;