const express = require('express');
const router = express.Router();
const {  getUsuarios, getUsuario, postUsuarioAdmin, putUsuario, deleteUsuario } = require('../controllers/usuarioController.js');

router.get('/', getUsuarios);
router.post('/',  postUsuarioAdmin);
router.get('/:id', getUsuario);
router.put('/:id', putUsuario);
router.delete('/:id', deleteUsuario);


module.exports = router;