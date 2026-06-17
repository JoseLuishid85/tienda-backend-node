const express = require('express');
const multer = require('multer');
const path = require('path');
const validarJWT = require('../middlewares/validar-token.js');
const {
    registroIngresoAdmin,
    obtenerIngresosAdmin,
    obtenerIngresoAdmin,
    obtenerDocumentoIngreso,
    reportIngresosAdmin
} = require('../controllers/ingresoControllers.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/documentos');
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage });

const routes = express.Router();

routes.post('/', [validarJWT, upload.single('documento')], registroIngresoAdmin); ///
routes.get('/', validarJWT, obtenerIngresosAdmin);
routes.get('/report', validarJWT, reportIngresosAdmin);
routes.get('/:id', validarJWT, obtenerIngresoAdmin);
routes.get('/documento/:name', obtenerDocumentoIngreso);


module.exports = routes; 