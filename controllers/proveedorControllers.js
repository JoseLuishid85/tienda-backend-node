const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

const Proveedor = require('../models/Proveedor.js')

const registro_proveedor = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let data = req.body;
    await Proveedor.sync();

    if (req.file) {
        let img_path = req.file.path;
        let str_img = img_path.split('\\');
        let str_logo = str_img[str_img.length - 1];
        data.logo = str_logo;
    }

    data.estado = true;

    try {
        const proveedor = await Proveedor.create(data);
        return res.status(200).send({ data: proveedor });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
}

const getProveedores = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }


    let proveedor = await Proveedor.findAll({
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json(proveedor);

}

const getProveedor = async (req, res) => {

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
        let proveedor = await Proveedor.findAll({
            where: {
                id: id
            }
        });

        res.status(200).send(proveedor);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }

}

const updateProveedor = async (req, res) => {
    if (!req.usuario) {
        return res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
    }

    const { id } = req.params;
    let data = req.body;

    if (req.file) {
        let img_path = req.file.path;
        let str_img = img_path.split('\\');
        let str_logo = str_img[str_img.length - 1];
        data.logo = str_logo;
    }

    try {

        const updateData = {
            tipo_rif: data.tipo_rif,
            rif: data.rif,
            nombre: data.nombre,
            telefono: data.telefono,
            email: data.email,
            direccion: data.direccion,
        };

        if (req.file) {
            updateData.logo = data.logo;
        }

        const proveed = await Proveedor.update(updateData, {
            where: {
                id: id
            }
        });

        if (proveed) {
            const ProveedorActualizado = await Proveedor.findByPk(id);
            return res.status(200).send({ 
                data1: data, 
                data: ProveedorActualizado, 
                msg: 'Proveedor actualizado correctamente' 
            });
        } else {
            return res.status(404).send({ ok: false, data: undefined, msg: 'Proveedor no encontrado' });
        }
    } catch (error) {
        console.error(error); // Para depuración
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
};

const deleteProveedor = async (req, res) => {

    if (!req.usuario) {
        return res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
    }

    let id = req.params['id'];

    try {
        let proveedor = await Proveedor.findOne({
            where: {
                id: id
            },
        });

        await proveedor.destroy();

        res.status(200).json({ 
            msg:'El Proveedor fue eliminada con exito',
        });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}


module.exports = {
    registro_proveedor,
    getProveedores,
    getProveedor,
    updateProveedor,
    deleteProveedor
}