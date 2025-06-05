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

const crearDB = async (req, res) => {

    await Usuario.sync();
    await Categoria.sync();
    await SubCategoria.sync();
    await Producto.sync();
    await Variedad.sync();
    await Galeria.sync();
    await Proveedor.sync();
    await Ingreso.sync();
    await DetalleIngreso.sync();
    await Cliente.sync();
    await Direccion.sync();
    await Carrito.sync();
    await Venta.sync();
    await DetalleVenta.sync();

    return res.status(200).send({ msg: "Todo bien" });

}

module.exports = {
    crearDB
}

