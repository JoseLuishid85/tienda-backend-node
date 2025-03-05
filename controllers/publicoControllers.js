const Producto = require('../models/Producto.js');
const Categoria = require('../models/Categoria');
const SubCategoria = require('../models/SubCategoria');
const Variedad = require('../models/Variedad.js');
const Galeria = require('../models/Galeria.js');

const obtenerNuevosProductos = async (req,res) => {

    let producto = await Producto.findAll({
        where: {
            estado: true
        },
        order: [['createdAt', 'DESC']],
        limit: 4
    });

    res.status(200).json(producto);
} 

const obtenerProductosRecomendados = async (req,res) => {

    let producto = await Producto.findAll({
        where: {
            estado: true
        },
        limit: 10
    });

    res.status(200).json(producto);
}

const obtenerProductosShop = async (req,res) => {

    let producto = await Producto.findAll({
        where: {
            estado: true
        },
        include: [
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: SubCategoria,
                as: 'subCategoria'
            }
        ],
        order: [['createdAt', 'DESC']],
    });

    res.status(200).json(producto);
}

const getCategoriasPublico = async (req, res) => {

    let categoria = await Categoria.findAll({
        where: {
            estado: true
        },
        order: [['nombre', 'ASC']],
        include: {
            model: SubCategoria,
            as: 'subcategorias'
        }
    });

    res.status(200).json(
        categoria
    );
}

const obtenerProductoSlug = async (req,res) => {

    const slug = req.params['slug'];


    let producto = await Producto.findOne({
        where: {
            slug: slug
        },
        include: [
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: SubCategoria,
                as: 'subCategoria'
            },
            {
                model: Variedad,
                as: 'variedades'
            },
            {
                model: Galeria,
                as: 'galerias'
            }
        ]
    });

    res.status(200).json(producto);
}

const obtenerProductoCategoria = async (req,res) => {

    const categoriaId = req.params['categoriaId'];


    let producto = await Producto.findAll({
        where: {
            categoriaId: categoriaId
        },
        include: [
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: SubCategoria,
                as: 'subCategoria'
            },
            {
                model: Variedad,
                as: 'variedades'
            },
            {
                model: Galeria,
                as: 'galerias'
            }
        ],
        limit: 6
    });

    res.status(200).json(producto);
}


module.exports = {
    obtenerNuevosProductos,
    obtenerProductosRecomendados,
    obtenerProductosShop,
    getCategoriasPublico,
    obtenerProductoSlug,
    obtenerProductoCategoria,
}