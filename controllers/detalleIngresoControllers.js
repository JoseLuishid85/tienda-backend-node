const DetalleIngreso = require('../models/DetalleIngreso.js');
const { Op } = require('sequelize');
const Producto = require('../models/Producto.js');


const registroDetalleIngresoAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }
    
    let data = req.body;

    await DetalleIngreso.sync();
    
    try {
        const detalle = await DetalleIngreso.create(data);
        return res.status(200).send(detalle);

    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const obtenerDetalleIngresoAdmin = async (req, res) => {

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
        let detalleIngreso = await DetalleIngreso.findAll({
            where: {
                ingresoId: id
            }
        });

        if (!detalleIngreso) {
            return res.status(404).json({
                ok: false,
                msg: 'No tiene detalle',
            });
        }

        res.status(200).send(detalleIngreso);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}




module.exports = {
    registroDetalleIngresoAdmin,
    obtenerDetalleIngresoAdmin
}