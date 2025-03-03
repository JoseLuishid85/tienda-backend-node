const express = require('express');
const { loginUsuario, loginCliente } = require('../controllers/authControllers.js')

const router = express.Router();

router.post('/', loginUsuario );
router.post('/tienda', loginCliente );

module.exports = router;