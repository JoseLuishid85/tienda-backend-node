const Producto = require('../models/Producto.js');
const Categoria = require('../models/Categoria');
const SubCategoria = require('../models/SubCategoria');
const Variedad = require('../models/Variedad.js');
const Galeria = require('../models/Galeria.js');
const Banco = require('../models/Banco.js');

const obtenerNuevosProductos = async (req, res) => {

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
        limit: 10
    });

    res.status(200).json(producto);
}

const obtenerProductosRecomendados = async (req, res) => {

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
        limit: 10
    });

    res.status(200).json(producto);
}

const obtenerProductosShop = async (req, res) => {

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
        order: [['createdAt', 'DESC']],
    });

    res.status(200).json(producto);
}

const getCategoriasPublico = async (req, res) => {

    let categorias = await Categoria.findAll({
        where: {
            estado: true
        },
        order: [['nombre', 'ASC']],
        include: {
            model: SubCategoria,
            as: 'subcategorias'
        }
    });

    const categoriasConConteo = await Promise.all(categorias.map(async (categoria) => {
        const cantidad = await Producto.count({
            where: {
                categoriaId: categoria.id,
                estado: true
            }
        });
        return {
            ...categoria.toJSON(),
            cantidad_productos: cantidad
        };
    }));

    res.status(200).json(
        categoriasConConteo
    );
}

const obtenerProductoSlug = async (req, res) => {

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

const obtenerProductoCategoria = async (req, res) => {

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

const obtenerProductosOferta = async (req, res) => {

    let producto = await Producto.findAll({
        where: {
            estado: true,
            descuento: true
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
        order: [['createdAt', 'DESC']],
    });

    res.status(200).json(producto);
}

const getBancosPublico = async (req, res) => {

    let bancos = await Banco.findAll({
        where: {
            estado: true
        },
        order: [['nombre', 'ASC']]
    });


    res.status(200).json(
        bancos
    );
}



module.exports = {
    obtenerNuevosProductos,
    obtenerProductosRecomendados,
    obtenerProductosShop,
    getCategoriasPublico,
    obtenerProductoSlug,
    obtenerProductoCategoria,
    obtenerProductosOferta,
    getBancosPublico
}