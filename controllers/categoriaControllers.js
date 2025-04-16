
const { Op } = require('sequelize');
const Categoria = require('../models/Categoria');
///const Sub_Categoria = require('../models/Sub_Categoria');
const slugify = require('slugify');

const crearCategoria = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    if (!req.file) {
        return res.status(400).json({ msg: 'No se subió ningún archivo' });
    }

    let data = req.body;

    let img_path = req.file.path;
    let str_img = img_path.split('\\');
    let str_imagen = str_img[str_img.length - 1];

    data.imagen = str_imagen;

    await Categoria.sync();

    const existingCategoria = await Categoria.findOne({ where: { nombre: data.nombre } });

    if (existingCategoria) {
        return res.status(500).send({ data: undefined, msg: 'El nombre de la categoria ya existe en la base de datos' });
    }

    try {
        data.slug = slugify(data.nombre).toLowerCase();
        const newCategoria = await Categoria.create(data);
        return res.status(200).json({ data: newCategoria });
    } catch (error) {
        return res.status(500).json({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const getCategorias = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let categoria = await Categoria.findAll({
        order: [['nombre', 'ASC']],
        //include: Sub_Categoria
    });

    res.status(200).json(
        categoria
    );
}

const obtenerCategoria = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let id = req.params.id;

    try {
        let categoria = await Categoria.findOne({
            where: {
                id: id
            },
            //include: Sub_Categoria
        });

        if (!categoria) {
            return res.status(404).json({
                ok: false,
                msg: 'La categoria no existe en la base de dato',
            });
        }

        res.status(200).send(categoria);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const actualizarCategoria = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let data = req.body;
    let id = parseInt(req.params['id']);

    const categoria = await Categoria.findOne({ where: { id: id } });

    // Verificar si se encontró un producto existente
    if (!categoria) {
        res.status(500).send({ data: undefined, msg: 'La categoria no existe en la base de datos' });
        return;
    }

    try {

        let slug = slugify(data.nombre).toLowerCase();
        const categoria = await Categoria.update({
            nombre: data.nombre,
            slug: slug
        }, {
            where: {
                id: id
            }
        });

        const categoriaActualizada = await Categoria.findOne({ where: { id: id } });

        res.status(200).json({
            data: categoriaActualizada
        })
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const eliminarCategoria = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let id = req.params['id'];

    try {
        let categoria = await Categoria.findOne({
            where: {
                id: id
            },
        });

        await categoria.destroy();

        res.status(200).json({
            msg: 'La categoria fue eliminada con exito',
        });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const actualizarEstadoCategoria = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let data = req.body;
    let id = parseInt(req.params['id']);

    const categoria = await Categoria.findOne({ where: { id: id } });

    // Verificar si se encontró un producto existente
    if (!categoria) {
        res.status(500).send({ data: undefined, msg: 'La categoria no existe en la base de datos' });
        return;
    }

    try {
        await Categoria.update({
            estado: data.estado,
        }, {
            where: {
                id: id
            }
        });

        const categoriaActualizada = await Categoria.findOne({ where: { id: id } });

        res.status(200).json({
            data: categoriaActualizada
        })
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

module.exports = {
    crearCategoria,
    getCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
    actualizarEstadoCategoria
}