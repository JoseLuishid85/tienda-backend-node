const Venta = require('../models/Venta');
const DetalleVenta = require('../models/DetalleVenta');
const Producto = require('../models/Producto');
const { Op } = require('sequelize');
const sequelize = require('../config/database.js');

const obtenerResumenAnual = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    try {
        const { year } = req.query;

        if (!year) {
            return res.status(400).send({ msg: "El año es requerido" });
        }

        // Consultar ventas agrupadas por mes
        const ventas = await Venta.findAll({
            attributes: [
                'month',
                [sequelize.fn('SUM', sequelize.col('total')), 'total_ventas']
            ],
            where: {
                year: parseInt(year)
            },
            group: ['month'],
            raw: true
        });

        // Consultar compras (ingresos) agrupadas por mes
        const compras = await sequelize.query(
            `SELECT MONTH(createdAt) as month, SUM(monto_total) as total_compras
             FROM ingreso
             WHERE YEAR(createdAt) = :year
             GROUP BY MONTH(createdAt)`,
            {
                replacements: { year: parseInt(year) },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Crear objeto para facilitar el acceso a los datos por mes
        const ventasPorMes = {};
        ventas.forEach(v => {
            ventasPorMes[v.month] = parseFloat(v.total_ventas) || 0;
        });

        const comprasPorMes = {};
        compras.forEach(c => {
            comprasPorMes[c.month] = parseFloat(c.total_compras) || 0;
        });

        // Nombres de los meses
        const nombresMeses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        // Crear array con los 12 meses del año
        const resumen = nombresMeses.map((nombre, index) => {
            const mes = index + 1;
            return {
                mes: nombre,
                numero_mes: mes,
                total_compras: comprasPorMes[mes] || 0,
                total_ventas: ventasPorMes[mes] || 0,
                diferencia: (ventasPorMes[mes] || 0) - (comprasPorMes[mes] || 0)
            };
        });

        // Calcular totales del año
        const totalAnualCompras = resumen.reduce((sum, item) => sum + item.total_compras, 0);
        const totalAnualVentas = resumen.reduce((sum, item) => sum + item.total_ventas, 0);
        const diferenciaAnual = totalAnualVentas - totalAnualCompras;

        return res.status(200).send({
            year: parseInt(year),
            resumen,
            totales: {
                total_compras: totalAnualCompras,
                total_ventas: totalAnualVentas,
                diferencia: diferenciaAnual
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Error al obtener el resumen anual", error: error.message });
    }
}

const obtenerProductosVendidosMes = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).send({ msg: "El año y el mes son requeridos" });
        }

        // Consultar los productos vendidos en el mes específico
        const productosVendidos = await DetalleVenta.findAll({
            attributes: [
                'productoId',
                [sequelize.fn('SUM', sequelize.col('DetalleVenta.cantidad')), 'cantidad_total']
            ],
            include: [
                {
                    model: Venta,
                    as: 'venta',
                    attributes: [],
                    where: {
                        year: parseInt(year),
                        month: parseInt(month)
                    }
                },
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['id', 'titulo', 'slug', 'precio', 'portada', 'stock']
                }
            ],
            group: ['productoId', 'producto.id'],
            raw: false
        });

        // Formatear la respuesta
        const productos = productosVendidos.map(item => ({
            productoId: item.productoId,
            titulo: item.producto.titulo,
            slug: item.producto.slug,
            precio: item.producto.precio,
            portada: item.producto.portada,
            stock_actual: item.producto.stock,
            cantidad_vendida: parseInt(item.dataValues.cantidad_total)
        }));

        // Calcular totales
        const totalUnidadesVendidas = productos.reduce((sum, item) => sum + item.cantidad_vendida, 0);

        return res.status(200).send({
            year: parseInt(year),
            month: parseInt(month),
            total_productos: productos.length,
            total_unidades_vendidas: totalUnidadesVendidas,
            productos
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Error al obtener productos vendidos del mes", error: error.message });
    }
}


module.exports = {
    obtenerResumenAnual,
    obtenerProductosVendidosMes
}