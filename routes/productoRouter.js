const express = require('express');
const multer = require('multer');
const path = require('path');
const validarJWT = require('../middlewares/validar-token.js');
const {
    registro_producto,
    getProductoAdmin,
    obtenerImageProducto,
    listaProductoActivoAdmin,
    actualizar_producto,
    obtenerProductoAdmin,
    subirImageProductoAdmin,
    obtenerGaleriaProducto,
    obtenerGaleriaProductoAdmin,
    actualizarEstadoGaleriaProductoAdmin,
    eliminarGaleriaProductoAdmin,
    actualizar_variedadProducto,
    actualizar_inventario_producto
} = require('../controllers/productoControllers.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/productos'); 
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname); 
        cb(null, Date.now() + ext); 
    }
});

const storageGaleria = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/galeria'); 
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname); 
        cb(null, Date.now() + ext); 
    }
});

const upload = multer({ storage });
const uploadGaleria = multer({ storageGaleria });

const routes = express.Router();  


routes.post('/registrar', [validarJWT, upload.single('portada')], registro_producto);
routes.get('/buscar/:filtro?', validarJWT, getProductoAdmin);
routes.get('/obtener/:id', validarJWT, obtenerProductoAdmin);
routes.put('/uptade/:id', [validarJWT, upload.single('portada')], actualizar_producto);
routes.put('/variedad/:id', validarJWT, actualizar_variedadProducto);
routes.put('/actualizar_inventario/:id', validarJWT, actualizar_inventario_producto);
routes.get('/lista_producto_activo/', validarJWT, listaProductoActivoAdmin);
routes.get('/obtener_image_producto/:img', obtenerImageProducto); 

//GALERIA
//routes.post('/subir_imagen_producto_admin', [validarJWT, uploadGaleria.single('image')], subirImageProductoAdmin);
routes.post('/subir_imagen_producto_admin', [validarJWT, uploadGaleria.any()], subirImageProductoAdmin);
routes.get('/obtener_galeria_producto/:img', obtenerGaleriaProducto);
routes.get('/obtener_galeria_producto_admin/:id', validarJWT, obtenerGaleriaProductoAdmin);
routes.put('/actualizar_estado_galeria_producto_admin/:id', validarJWT, actualizarEstadoGaleriaProductoAdmin);
routes.delete('/eliminar_galeria_producto_admin/:id', validarJWT, eliminarGaleriaProductoAdmin);


module.exports = routes;
