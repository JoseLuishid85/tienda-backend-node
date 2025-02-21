const express = require('express');
const router = express.Router();
const {  getUsuarios, getUsuario, postUsuario, putUsuario, deleteUsuario } = require('../controllers/usuarioController.js');

router.get('/', getUsuarios);
router.get('/:id', getUsuario);
router.post('/', postUsuario);
router.put('/:id', putUsuario);
router.delete('/:id', deleteUsuario);

module.exports = router;