const { Op } = require('sequelize');
const Venta = require('../models/Venta');
const DetalleVenta = require('../models/DetalleVenta');

const crearVenta = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let data = req.body;

    data.nventa = "1234";
    data.estado = "Activo"

    var currentDate = new Date();

    data.year = currentDate.getFullYear();
    data.month = currentDate.getMonth() + 1; 
    data.day = currentDate.getDate();

    await Venta.sync();
    await DetalleVenta.sync();

    try {
        const newVenta = await Venta.create(data);

        for (let item of data.detalles) {

            item.ventaId = newVenta.id;

            await DetalleVenta.create(item);
        }

        return res.status(200).json({ venta: newVenta });
    } catch (error) {
        return res.status(500).json({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}
/*
const getVentas = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let ventas = await Venta.findAll({
        order: [['id', 'ASC']],
        include: [Cliente, Direccion],
    });

    res.status(200).json(
        ventas
    );
}

const obtenerVenta = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let id = req.params['id'];

    try {
        let venta = await Venta.findOne({
            where: {
                id: id
            },
            include: [Cliente, Direccion, DetalleVenta]
        });

        if (!venta) {
            return res.status(404).json({
                ok: false,
                msg: 'La Venta no existe en la base de dato',
            });
        }

        res.status(200).send(venta);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const obtenerVentaTransaccion = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let id_payment = req.params['id_payment'];

    try {
        let venta = await Venta.findOne({
            where: {
                transaccion: id_payment
            },
            include: [Cliente, Direccion]
        });

        if (!venta) {
            return res.status(404).json({
                ok: false,
                msg: 'La Venta no existe en la base de dato',
            });
        }

        res.status(200).send(venta);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const getVentasCliente = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let id_cliente = req.params['id_cliente'];

    let ventas = await Venta.findAll({
        where: { id_cliente: id_cliente },
        order: [['createdAt', 'DESC']],
        include: [Cliente, Direccion],
    });

    res.status(200).json(
        ventas
    );
}

const getVentasAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    
    let ventas = await Venta.findAll({
        order: [['id', 'ASC']],
        include: [Cliente, Direccion],
    });

    res.status(200).json(
        ventas
    );
}

const obtenerVentaAdmin = async (req, res) => {

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
        let venta = await Venta.findOne({
            where: {
                id: id
            },
            include: [
                { model: Cliente },
                { model: Direccion },
                {
                    model: DetalleVenta,
                    include: [Producto]
                }
            ]
        });

        if (!venta) {
            return res.status(404).json({
                ok: false,
                msg: 'La Venta no existe en la base de dato',
            });
        }

        res.status(200).send(venta);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}
*/

module.exports = {
    crearVenta,
    //getVentas,
    //obtenerVenta,
    //obtenerVentaTransaccion,
    //getVentasCliente,
    //getVentasAdmin,
    //obtenerVentaAdmin
}