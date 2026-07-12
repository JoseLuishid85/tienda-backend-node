const Usuario = require('../models/Usuario.js');
const Categoria = require('../models/Categoria.js');
const SubCategoria = require('../models/SubCategoria.js');
const Producto = require('../models/Producto.js');
const Variedad = require('../models/Variedad.js');
const Galeria = require('../models/Galeria.js');
const Proveedor = require('../models/Proveedor.js');
const Ingreso = require('../models/Ingreso.js');
const DetalleIngreso = require('../models/DetalleIngreso.js');
const Cliente = require('../models/Cliente.js');
const Direccion = require('../models/Direccion.js');
const Carrito = require('../models/Carrito.js');
const Venta = require('../models/Venta.js');
const DetalleVenta = require('../models/DetalleVenta.js');
const Etiqueta = require('../models/Etiqueta.js');
const { Op } = require('sequelize');
const sequelize = require('../config/database.js');

const crearDB = async (req, res) => {

    //await Usuario.sync();
    //await Categoria.sync();
    //await SubCategoria.sync();
    //await Producto.sync();
    //await Variedad.sync();
    //await Galeria.sync();
    //await Proveedor.sync();
    //await Ingreso.sync();
    //await DetalleIngreso.sync();
    //await Cliente.sync();
    //await Direccion.sync();
    //await Carrito.sync();
    await Venta.sync();
    await DetalleVenta.sync();
    await Etiqueta.sync();

    return res.status(200).send({ msg: "Todo bien" });

}
/*
const obtenerResumenAnual = async (req, res) => {
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
}*/

module.exports = {
    crearDB,
    //obtenerResumenAnual
}

