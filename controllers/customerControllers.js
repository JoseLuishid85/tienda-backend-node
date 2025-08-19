const { Op } = require('sequelize');
const Variedad = require('../models/Variedad.js');
const Carrito = require('../models/Carrito.js');
const Producto = require('../models/Producto.js');
const Cliente = require('../models/Cliente.js')

const crearProductoCarrito = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let data = req.body;
    data.clienteId = req.cliente.id

    //Buscar si el producto tiene variedad
    const variedadPro = await Variedad.findAll({
        where: {
            productoId: data.productoId
        }
    });

    if (variedadPro.length > 0) {
        const variedad = await Variedad.findOne({
            where: {
                id: data.variedadId
            }
        });

        if (data.cantidad > variedad.stock) {
            return res.status(500).json({
                ok: false,
                msg: 'La cantidad es mayor al stock actual',
            });
        }
    } else {
        delete data.variedadId;
    }

    await Carrito.sync();

    try {
        const newCarrito = await Carrito.create(data);
        return res.status(200).json({ data: newCarrito });
    } catch (error) {
        return res.status(500).json({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
}

const listaProductoCarritoID = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let id = req.params['id'];

    let carrito = await Carrito.findAll({
        where: {
            id: id
        },
        include: [
            {
                model: Variedad,
                as: 'variedad',
                required: false
            },
            {
                model: Cliente,
                as: 'cliente'
            },
            {
                model: Producto,
                as: 'productos'
            }
        ]
    });

    res.status(200).send(carrito);
}

const listaCarritoCliente = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let carrito = await Carrito.findAll({
        where: {
            clienteId: req.cliente.id
        },
        include: [
            {
                model: Variedad,
                as: 'variedad',
                required: false
            },
            {
                model: Cliente,
                as: 'cliente',
                attributes: {
                    exclude: ['password']
                }
            },
            {
                model: Producto,
                as: 'productos'
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    let carrito_general = await Carrito.findAll({
        where: {
            clienteId: req.cliente.id
        },

        include: [
            {
                model: Variedad,
                as: 'variedad',
                required: false
            },
            {
                model: Cliente,
                as: 'cliente',
                attributes: {
                    exclude: ['password']
                }
            },
            {
                model: Producto,
                as: 'productos'
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).send({
        carrito: carrito,
        carrito_general: carrito_general
    });
}

const eliminarCarrito = async (req, res) => {

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
        let carrito = await Carrito.findOne({
            where: {
                id: id
            },
        });

        await carrito.destroy();

        res.status(200).json({
            msg: 'El registro fue eliminada con exito',
        });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const eliminarCarritoCliente = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let clienteId = req.params['clienteId'];

    try {
        let carritos = await Carrito.findAll({
            where: {
                clienteId: clienteId
            },
        });

        for (let carrito of carritos) {
            await carrito.destroy();
        }

        res.status(200).json({
            msg: 'El registro fue eliminada con exito',
        });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

module.exports = {
    crearProductoCarrito,
    listaProductoCarritoID,
    listaCarritoCliente,
    eliminarCarrito,
    eliminarCarritoCliente
}