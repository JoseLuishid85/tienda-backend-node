const Producto = require('../models/Producto.js')
const Variedad = require('../models/Variedad.js');
const Ingreso = require('../models/Ingreso.js');
const DetalleIngreso = require('../models/DetalleIngreso.js');
const Proveedor = require('../models/Proveedor.js');

const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const moment = require('moment');

const registroIngresoAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let data = req.body;
    let detalles = JSON.parse(data.detalles);

    let str_documento = null;

    if (req.file) {
        let img_path = req.file.path;
        let str_img = img_path.split(/[\\/]/);
        str_documento = str_img[str_img.length - 1];
    }
    //prueba

    data.documento = str_documento;
    data.usuarioId = req.usuario.id;

    const reg_ingreso = await Ingreso.findAll({
        order: [['createdAt', 'DESC']], // Ordenar por createdAt en orden descendente
        limit: 1, // Limitar a 1 resultado
    });

    if (reg_ingreso.length === 0) {
        data.serie = 1;
    } else {
        data.serie = reg_ingreso[0].serie + 1;
    }

    await Ingreso.sync();
    await DetalleIngreso.sync();

    try {

        const ingreso = await Ingreso.create(data);

        for (var item of detalles) {
            item.ingresoId = ingreso.id;

            if (item.variedadId) {
                let variedad = await Variedad.findOne({ where: { id: item.variedadId } });
                await Variedad.update({ stock: variedad.stock + item.cantidad }, {
                    where: {
                        id: item.variedadId
                    }
                });

                const sumaStock = await Variedad.sum('stock', { where: { productoId: item.productoId } });
                await Producto.update({ stock: sumaStock }, {
                    where: {
                        id: item.productoId
                    }
                });
            } else {
                let producto = await Producto.findOne({ where: { id: item.productoId } });
                await Producto.update({ stock: producto.stock + item.cantidad }, {
                    where: {
                        id: item.productoId
                    }
                });
            }

            await DetalleIngreso.create(item);

        }

        const newIngreso = await Ingreso.findOne({
            where: { id: ingreso.id },
            include: [
                {
                    model: DetalleIngreso,
                    as: 'detalles'
                }
            ]
        });

        return res.status(200).json({
            ingreso: newIngreso,
        });

    } catch (error) {
        return res.status(500).send({ ok: false, msg: 'Error al procesar datos' });
    }
}

const obtenerIngresosAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }


    let ingreso;
    ingreso = await Ingreso.findAll({
        order: [['updatedAt', 'DESC']],
        include: [
            {
                model: DetalleIngreso,
                as: 'detalles'
            }
        ]
    });

    res.send(ingreso);

}

const obtenerIngresoAdmin = async (req, res) => {
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
        let ingreso = await Ingreso.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: Proveedor,
                    as: 'proveedorInfo',
                },
                {
                    model: DetalleIngreso,
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

        if (!ingreso) {
            return res.status(404).json({
                ok: false,
                msg: 'No tiene detalle',
            });
        }

        res.status(200).send(ingreso);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }

}

const obtenerDocumentoIngreso = async (req, res) => {

    const name = req.params['name'];

    if (/\.\./g.test(name)) {
        return res.status(400).send({ message: 'Nombre de archivo no válido' });
    }

    const documento = path.join(__dirname, '../uploads/documentos', name);

    try {
        await fs.promises.access(documento, fs.constants.F_OK);

        res.status(200).sendFile(documento);
    } catch (error) {
        // Si no existe, enviar la imagen por defecto
        const defaultPath = path.join(__dirname, '../uploads/default.jpg');
        res.status(404).sendFile(defaultPath);
    }


}

const reportIngresosAdmin = async (req, res) => {
    try {
        if (!req.usuario) {
            return res.status(500).json({ ok: false, msg: 'Error Token' });
        }


        const {
            tipoPeriodo, fechaEspecifica, semana, mes,
            anioMes, anio, fechaInicio, fechaFin,
            proveedorId
        } = req.query;

        let whereClause = {};

        // --- LÓGICA DE FILTRADO POR PERÍODO (Igual que en ventas) ---
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
                    const [year, weekNum] = semana.split('-W');
                    whereClause.createdAt = {
                        [Op.between]: [
                            moment().year(year).isoWeek(weekNum).startOf('isoWeek').toDate(),
                            moment().year(year).isoWeek(weekNum).endOf('isoWeek').toDate()
                        ]
                    };
                }
                break;
            case 'mes':
                if (mes && anioMes) {
                    whereClause.createdAt = {
                        [Op.between]: [
                            moment(`${anioMes}-${mes}`, "YYYY-MM").startOf('month').toDate(),
                            moment(`${anioMes}-${mes}`, "YYYY-MM").endOf('month').toDate()
                        ]
                    };
                }
                break;
            case 'anio':
                if (anio) {
                    whereClause.createdAt = {
                        [Op.between]: [
                            moment(anio, "YYYY").startOf('year').toDate(),
                            moment(anio, "YYYY").endOf('year').toDate()
                        ]
                    };
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

        // Filtro por proveedor opcional
        //if (proveedorId) whereClause.proveedorId = proveedorId;

        // --- CONSULTA ---
        const ingresos = await Ingreso.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            include: [
                { model: DetalleIngreso, as: 'detalles' },
                { model: Proveedor, as: 'proveedorInfo', attributes: ['id', 'nombre', 'rif'] },
                // { model: Usuario, as: 'usuario', attributes: ['nombres'] } 
            ]
        });

        // --- CÁLCULO DE ESTADÍSTICAS ---

        const estadisticas = {
            totalIngresos: ingresos.length,
            montoInvertido: ingresos.reduce((acc, i) => acc + parseFloat(i.monto_total), 0),
            cantidadProductos: ingresos.reduce((acc, i) => {
                return acc + i.detalles.reduce((sum, d) => sum + d.cantidad, 0);
            }, 0)
        };

        res.json({
            ok: true,
            estadisticas,
            ingresos
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener ingresos' });
    }
}

module.exports = {
    registroIngresoAdmin,
    obtenerIngresosAdmin,
    obtenerIngresoAdmin,
    obtenerDocumentoIngreso,
    reportIngresosAdmin
}