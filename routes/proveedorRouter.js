const express = require('express');
const multer = require('multer');
const path = require('path');
const validarJWT = require('../middlewares/validar-token.js');
const { registro_proveedor, getProveedores, getProveedor, updateProveedor, deleteProveedor } = require('../controllers/proveedorControllers.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/proveedor'); 
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname); 
        cb(null, Date.now() + ext); 
    }
});

const upload = multer({ storage });

const routes = express.Router();  

routes.get('/', validarJWT, getProveedores);
routes.get('/:id', validarJWT, getProveedor); 
routes.post('/', [validarJWT, upload.single('logo')] , registro_proveedor);
routes.put('/:id', [validarJWT, upload.single('logo')], updateProveedor);
routes.delete('/:id', validarJWT, deleteProveedor);



module.exports = routes;