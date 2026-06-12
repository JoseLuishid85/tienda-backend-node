const Venta = require('../models/Venta');
const Cliente = require('../models/Cliente');
const Direccion = require('../models/Direccion');
const DetalleVenta = require('../models/DetalleVenta');
const Producto = require('../models/Producto');
const Banco = require('../models/Banco');
const { Op, fn, col } = require('sequelize');
const moment = require('moment');
const Variedad = require('../models/Variedad');

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

        // Obtener la venta completa con sus relaciones para enviar por Socket.IO
        const ventaCompleta = await Venta.findOne({
            where: { id: newVenta.id },
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
                    model: Banco,
                    as: 'banco'
                },
                {
                    model: DetalleVenta,
                    as: 'detalles',
                    include: [
                        {
                            model: Producto,
                            as: 'producto'
                        }
                    ]
                }
            ]
        });

        if (global.io) {
            global.io.emit('nueva-venta', {
                venta: ventaCompleta,
                mensaje: `Nueva venta ${newVenta.nventa} realizada`
            });
            console.log(`Evento 'nueva-venta' emitido: ${newVenta.nventa}`);
        }

        return res.status(200).json({ venta: ventaCompleta });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error, msg: 'Error al procesar datos' });
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
                clienteId: req.cliente.id,

            },
            order: [['id', 'DESC']],
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
                    include: [
                        {
                            model: Producto,
                            as: 'producto'
                        }
                    ]
                }
            ]
        });

        const totales = ventas.reduce((acc, venta) => {
            acc.totalPedidos += 1;

            switch (venta.estado) {
                case 'En Proceso':
                    acc.enProceso += 1;
                    break;
                case 'Entregado':
                    acc.entregados += 1;
                    break;
                case 'Pendiente':
                    acc.pendientes += 1;
                    break;
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
                    include: [
                        {
                            model: Producto,
                            as: 'producto'
                        }
                    ]
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
                    model: Banco,
                    as: 'banco'
                },
                {
                    model: DetalleVenta,
                    as: 'detalles',
                    include: [
                        {
                            model: Producto,
                            as: 'producto' // Trae los valores del producto
                        },
                        {
                            model: Variedad,
                            as: 'variedad' // Trae la variedad (si existe)
                        }
                    ]
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

const cambiarEstadoVentaAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let id = req.params['id'];
    let estado = req.params['estado'];

    try {
        let venta = await Venta.findOne({
            where: {
                id: id
            }
        });

        if (!venta) {
            return res.status(404).json({
                ok: false,
                msg: 'La Venta no existe en la base de dato',
            });
        }

        await Venta.update({
            estado: estado,
        }, {
            where: { id: id }
        });

        let ventaProcesada = await Venta.findOne({
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
                    model: Banco,
                    as: 'banco'
                },
                {
                    model: DetalleVenta,
                    as: 'detalles',
                    include: [
                        {
                            model: Producto,
                            as: 'producto' // Trae los valores del producto
                        },
                        {
                            model: Variedad,
                            as: 'variedad' // Trae la variedad (si existe)
                        }
                    ]
                }
            ]
        });

        res.status(200).send(ventaProcesada);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const getVentasDiaAdmin = async (req, res) => {

    if (!req.usuario) {
        return res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
    }

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    try {
        let ventas = await Venta.findAll({
            where: {
                year: year,
                month: month,
                day: day
            },
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
    } catch (error) {
        console.error('Error al obtener las ventas del día:', error);
        res.status(500).json({
            data: undefined,
            msg: 'Error en la base de datos al buscar ventas.',
            error: error.message
        });
    }
}

const getReporteVentas = async (req, res) => {
    try {
        const {
            tipoPeriodo, fechaEspecifica, semana, mes,
            anioMes, anio, fechaInicio, fechaFin,
            estado, metodoPago
        } = req.query;

        let whereClause = {};

        // 1. LÓGICA DE FILTRADO POR PERÍODO
        switch (tipoPeriodo) {
            case 'dia':
                if (fechaEspecifica) {
                    whereClause.createdAt = {
                        [Op.between]: [
                            moment(fechaEspecifica).startOf('day').toDate(),
                            moment(fechaEspecifica).endOf('day').toDate()
                        ]
                    };
                }
                break;

            case 'semana':
                if (semana) {
                    // El formato de input "week" es "2024-W12"
                    const [year, weekNum] = semana.split('-W');
                    const startOfWeek = moment().year(year).isoWeek(weekNum).startOf('isoWeek');
                    const endOfWeek = moment().year(year).isoWeek(weekNum).endOf('isoWeek');
                    whereClause.createdAt = { [Op.between]: [startOfWeek.toDate(), endOfWeek.toDate()] };
                }
                break;

            case 'mes':
                if (mes && anioMes) {
                    const startOfMonth = moment(`${anioMes}-${mes}`, "YYYY-MM").startOf('month');
                    const endOfMonth = moment(`${anioMes}-${mes}`, "YYYY-MM").endOf('month');
                    whereClause.createdAt = { [Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()] };
                }
                break;

            case 'anio':
                if (anio) {
                    const startOfYear = moment(anio, "YYYY").startOf('year');
                    const endOfYear = moment(anio, "YYYY").endOf('year');
                    whereClause.createdAt = { [Op.between]: [startOfYear.toDate(), endOfYear.toDate()] };
                }
                break;

            case 'rango':
                if (fechaInicio && fechaFin) {
                    whereClause.createdAt = {
                        [Op.between]: [
                            moment(fechaInicio).startOf('day').toDate(),
                            moment(fechaFin).endOf('day').toDate()
                        ]
                    };
                }
                break;
        }

        // 2. FILTROS ADICIONALES (Estado y Método de Pago)
        if (estado) whereClause.estado = estado;
        if (metodoPago) whereClause.forma_pago = metodoPago;

        // 3. CONSULTA CON DETALLES Y ESTADÍSTICAS
        const ventas = await Venta.findAll({
            where: whereClause,
            include: [
                { model: Cliente, as: 'cliente' },
                { model: DetalleVenta, as: 'detalles' }
            ],
            order: [['createdAt', 'DESC']]
        });

        // 4. CALCULAR ESTADÍSTICAS EN EL SERVIDOR (Opcional, pero recomendado)
        const estadisticas = {
            totalVentas: ventas.length,
            montoTotal: ventas.reduce((acc, v) => acc + parseFloat(v.total), 0),
            totalProductos: ventas.reduce((acc, v) => acc + v.detalles.length, 0),
        };

        estadisticas.promedioVenta = estadisticas.totalVentas > 0
            ? estadisticas.montoTotal / estadisticas.totalVentas
            : 0;

        res.status(200).json({
            ok: true,
            estadisticas,
            ventas
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al consultar ventas' });
    }
};

module.exports = {
    crearVenta,
    getVentas,
    obtenerVenta,
    obtenerVentaTransaccion,
    getVentasCliente,
    getVentasAdmin,
    cambiarEstadoVentaAdmin,
    obtenerVentaAdmin,
    getVentasDiaAdmin,
    getReporteVentas
}