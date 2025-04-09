const { Op } = require('sequelize');
const DetalleVenta = require('../models/DetalleVenta');
const Producto = require('../models/Producto');
const Variedad = require('../models/Variedad');

const crearDetalle = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let data = req.body;
    
    await DetalleVenta.sync();
    
    try {
        const newDetalleVenta = await DetalleVenta.create(data);
        return res.status(200).json({ data: newDetalleVenta });
    } catch (error) {
        return res.status(500).json({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const obtenerDetallesVentaCliente = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let id_venta = req.params['id_venta'];

    try {
        let detalleventa;
        detalleventa = await DetalleVenta.findAll({
            where: {
                id_venta: id_venta
            },
            include: [Producto, Variedad]
        });

        id_cliente = detalleventa[0].id_cliente

        let reviews = await Review.findAll({
            where: {
                id_cliente: id_cliente
            }
        })

        if (!detalleventa) {
            return res.status(404).json({
                ok: false,
                msg: 'El detalle Venta no existe en la base de dato',
            });
        }
        /*
        let newArray = detalleventa.map(ventaDet => {
            let review = reviews.find(review => review.id_producto === ventaDet.id_producto);
        
            if (review) { // Verifica si se encontró una revisión
                return {
                    ...ventaDet,
                    review: review
                };
            } else {
                return ventaDet;
            }
        });


        res.status(200).json({
            newArray: newArray
        });*/
        res.send(detalleventa);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const obtenerDetallesVentaCliente2 = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let id_venta = req.params['id_venta'];

    try {
        let detalleventa;
        detalleventa = await DetalleVenta.findAll({
            where: {
                id_venta: id_venta
            },
            include: [
                {
                    model: Producto,
                    include: [
                        {
                            model: Review,
                            where: { id_cliente: req.cliente.id } 
                        }
                    ]
                },
                { model: Variedad }
            ]
        });

        id_cliente = detalleventa[0].id_cliente

        if (!detalleventa) {
            return res.status(404).json({
                ok: false,
                msg: 'El detalle Venta no existe en la base de dato',
            });
        }

        res.send(detalleventa);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}



module.exports = {
    crearDetalle
}