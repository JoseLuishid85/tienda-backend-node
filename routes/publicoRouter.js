const express = require('express');
const {  
    obtenerNuevosProductos, 
    obtenerProductosRecomendados,
    obtenerProductosShop,
    obtenerProductoSlug,
    getCategoriasPublico,
    obtenerProductoCategoria,
} = require('../controllers/publicoControllers.js');

const routes = express.Router();
routes.get('/obtener_nuevo_productos', obtenerNuevosProductos);
routes.get('/obtener_productos_recomendado', obtenerProductosRecomendados);
routes.get('/obtener_productos_shop', obtenerProductosShop);
routes.get('/obtener_producto_slug/:slug', obtenerProductoSlug);
routes.get('/obtener_productos_categoria/:categoriaId', obtenerProductoCategoria);
routes.get('/lista_categorias', getCategoriasPublico);

module.exports = routes;