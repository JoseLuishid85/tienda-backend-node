const { Op } = require('sequelize');
const Categoria = require('../models/Categoria');
const SubCategoria = require('../models/SubCategoria')

const crearSubCategoria = async (req, res) => { 

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }
    
    let data = req.body;
    await SubCategoria.sync();

    try {
        const newSubCategoria = await SubCategoria.create(data);
        return res.status(200).json({ data: newSubCategoria });
    } catch (error) {
        return res.status(500).json({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const getSubCategorias = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let sub_categorias = await SubCategoria.findAll({
        order: [['nombre', 'ASC']],
        include: {
            model: Categoria,
            as: 'categoria', // Debe coincidir con el alias en la relación
        }
    });

    res.status(200).json(sub_categorias);
}

const obtenerSubCategoria = async (req, res) => {

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
        let sub_categoria = await SubCategoria.findOne({
            where: {
                id: id
            },
            include: {
                model: Categoria,
                as: 'categoria', // Debe coincidir con el alias en la relación
            }
        });

        if (!sub_categoria) {
            return res.status(404).json({
                ok: false,
                msg: 'La sub-categoria no existe en la base de dato',
            });
        }

        res.status(200).send(sub_categoria);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const actualizarSubCategoria = async (req, res) => {

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
    
    const sub_categoria = await SubCategoria.findOne({ where: { id: id } });

    // Verificar si se encontró un producto existente
    if (!sub_categoria) {
        res.status(500).send({ data: undefined, msg: 'La categoria no existe en la base de datos' });
        return;
    }

    try {

        const sub_cat = await SubCategoria.update({
            nombre: data.nombre,
            estado: data.estado,
            categoriaId: data.categoriaId,
        }, {
            where: {
                id: id
            }
        });

        const subCategoriaActualizada = await SubCategoria.findOne({ where: { id: id } });
        
        res.status(200).json({
            data: subCategoriaActualizada
        })
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}


const eliminarSubCategoria = async (req, res) => {

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
        let sub_categoria = await SubCategoria.findOne({
            where: {
                id: id
            },
        });

        await sub_categoria.destroy();

        res.status(200).json({ 
            msg:'La sub-categoria fue eliminada con exito',
        });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const obtenerSubCategorias_Categoria = async (req, res) => {

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
        let subCategorias = await SubCategoria.findAll({
            where: {
                categoriaId: id
            },
        });

        if (!subCategorias) {
            return res.status(404).json({
                ok: false,
                msg: 'La sub-categoria no existe en la base de dato',
            });
        }

        res.status(200).json(subCategorias);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

module.exports = {
    crearSubCategoria,
    getSubCategorias,
    obtenerSubCategoria,
    actualizarSubCategoria,
    eliminarSubCategoria,
    obtenerSubCategorias_Categoria
}