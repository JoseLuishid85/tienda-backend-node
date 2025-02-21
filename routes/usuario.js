const express = require('express');
const router = express.Router();
const {  getUsuarios , postUsuario, putUsuario, deleteUsuario } = require('../controllers/usuarioController.js');

router.get('/', getUsuarios);
router.post('/', postUsuario);
router.put('/', putUsuario);
router.delete('/', deleteUsuario);

module.exports = router;