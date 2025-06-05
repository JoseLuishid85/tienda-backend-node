const express = require('express');
const {  crearDB } = require('../controllers/dataControllers.js');


const routes = express.Router();

routes.get('/', crearDB );

module.exports = routes;

