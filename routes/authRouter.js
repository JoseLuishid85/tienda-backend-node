const express = require('express');
const { loginUsuario, } = require('../controllers/authControllers.js')

const router = express.Router();

router.post('/', loginUsuario );

module.exports = router;