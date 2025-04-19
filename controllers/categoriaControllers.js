
const { Op } = require('sequelize');
const Categoria = require('../models/Categoria');
const path = require('path');
const fs = require('fs');
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
        return res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
    }

    let data = req.body;
    let id = parseInt(req.params['id']);

    try {
        // Buscar la categoría existente
        const categoria = await Categoria.findOne({ where: { id: id } });
        
        if (!categoria) {
            return res.status(404).send({ data: undefined, msg: 'La categoría no existe en la base de datos' });
        }

        // Procesar la imagen si se subió una nueva
        if (req.file) {
            let img_path = req.file.path;
            let str_img = img_path.split('\\');
            let str_imagen = str_img[str_img.length - 1];
            data.imagen = str_imagen;
        }

        // Generar el slug
        data.slug = slugify(data.nombre).toLowerCase();

        // Actualizar la categoría
        await Categoria.update(data, {
            where: { id: id }
        });

        // Obtener la categoría actualizada para devolverla en la respuesta
        const categoriaActualizada = await Categoria.findOne({ where: { id: id } });

        return res.status(200).json({
            data: categoriaActualizada
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ 
            ok: false, 
            data: undefined, 
            msg: 'Error al procesar datos',
            error: error.message 
        });
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

const obtenerImageCategoria = async (req, res) => {
    const img = req.params['img'];

    // Validar que el nombre de la imagen no contenga caracteres peligrosos
    if (/\.\./g.test(img)) {
        return res.status(400).send({ message: 'Nombre de archivo no válido' });
    }

    // Construir la ruta de la imagen
    const imagePath = path.join(__dirname, '../uploads/categorias', img);

    try {
        // Verificar si la imagen existe
        await fs.promises.access(imagePath, fs.constants.F_OK);

        // Si existe, enviar la imagen
        res.status(200).sendFile(imagePath);
    } catch (error) {
        // Si no existe, enviar la imagen por defecto
        const defaultImagePath = path.join(__dirname, '../uploads/default.jpg');
        res.status(404).sendFile(defaultImagePath);
    }
};

module.exports = {
    crearCategoria,
    getCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
    actualizarEstadoCategoria,
    obtenerImageCategoria
}