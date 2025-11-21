const { Op } = require('sequelize');
const Venta = require('../models/Venta');
//const DetalleVenta = require('../models/DetalleVenta');
const Cliente = require('../models/Cliente');
const Direccion = require('../models/Direccion');
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

    const lastVenta = await Venta.findOne({
        order: [['id', 'DESC']], 
        limit: 1 
    });

    const nextId = lastVenta ? lastVenta.id + 1 : 1;

    const codigoSecuencial = String(nextId).padStart(6, '0');
    data.nventa = `V${codigoSecuencial}`;
    data.estado = "Pendiente"

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

const getVentas = async (req, res) => {
    if (!req.cliente) {
        return res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
    }

    try {
        let ventas = await Venta.findAll({
            where: {
                clienteId: req.cliente.id
            },
            include: [
                {
                    model: Cliente,
                    as: 'cliente',
                },
                {
                    model: Direccion,
                    as: 'direccion'
                },
                {
                    model: DetalleVenta,
                    as: 'detalles',
                }
            ]
        });

        const totales = ventas.reduce((acc, venta) => {
            acc.totalPedidos += 1; // Contamos todas las ventas

            switch (venta.estado) {
                case 'En Proceso':
                    acc.enProceso += 1;
                    break;
                case 'Entregado': // Asegúrate de que el string coincida con el valor en la DB
                    acc.entregados += 1;
                    break;
                case 'Pendiente': // Asegúrate de que el string coincida con el valor en la DB
                    acc.pendientes += 1;
                    break;
                // Puedes agregar más estados si los tienes (e.g., 'Cancelado')
            }
            return acc;
        }, {
            totalPedidos: 0,
            enProceso: 0,
            entregados: 0,
            pendientes: 0
        });

        res.status(200).json({
            totales: totales,
            ventas: ventas
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Error al obtener las ventas y totales.',
        });
    }
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

            include: [
                {
                    model: Cliente,
                    as: 'cliente',
                },
                {
                    model: Direccion,
                    as: 'direccion'
                },
                {
                    model: DetalleVenta,
                    as: 'detalles',
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

const obtenerVentaTransaccion = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let id_payment = req.params['id_payment'];

    try {
        let venta = await Venta.findOne({
            where: {
                transaccion: id_payment
            },
            include: [
                {
                    model: Cliente,
                    as: 'cliente',
                },
                {
                    model: Direccion,
                    as: 'direccion'
                },
                {
                    model: DetalleVenta,
                    as: 'detalles',
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

const getVentasCliente = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let id_cliente = req.params['id_cliente'];

    let ventas = await Venta.findAll({
        where: { clienteId: id_cliente },
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: Cliente,
                as: 'cliente',
            },
            {
                model: Direccion,
                as: 'direccion'
            },
            {
                model: DetalleVenta,
                as: 'detalles',
            }
        ]
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
        include: [
            {
                model: Cliente,
                as: 'cliente',
            },
            {
                model: Direccion,
                as: 'direccion'
            },
            {
                model: DetalleVenta,
                as: 'detalles',
            }
        ]
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
                {
                    model: Cliente,
                    as: 'cliente',
                },
                {
                    model: Direccion,
                    as: 'direccion'
                },
                {
                    model: DetalleVenta,
                    as: 'detalles',
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

module.exports = {
    crearVenta,
    getVentas,
    obtenerVenta,
    obtenerVentaTransaccion,
    getVentasCliente,
    getVentasAdmin,
    obtenerVentaAdmin
}