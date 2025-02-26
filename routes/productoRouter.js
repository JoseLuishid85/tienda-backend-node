const express = require('express');
const multer = require('multer');
const path = require('path');
const validarJWT = require('../middlewares/validar-token.js');
const { registro_producto } = require('../controllers/productoControllers.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/productos'); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Obtener la extensión del archivo
        cb(null, Date.now() + ext); // Guardar con la extensión original
    }
});

const upload = multer({ storage });

const routes = express.Router();  

routes.post('/', [validarJWT, upload.single('portada')], registro_producto);

module.exports = routes;
