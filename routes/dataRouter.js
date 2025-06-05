const express = require('express');

import Usuario from '../models/Usuario.js'
import Categoria from '../models/Categoria.js'
import SubCategoria from '../models/SubCategoria.js'
import Producto from '../models/Producto.js'
import Variedad from '../models/Variedad.js'
import Galeria from '../models/Galeria.js'
import Proveedor from '../models/Proveedor.js'
import Ingreso from '../models/Ingreso.js'
import DetalleIngreso from '../models/DetalleIngreso.js'
import Cliente from '../models/Cliente.js'
import Direccion from '../models/Direccion.js'
import Carrito from '../models/Carrito.js'
import Venta from '../models/Venta.js'
import DetalleVenta from '../models/DetalleVenta.js'

const router = express.Router();

router.get('/',
    async (req, res) => {

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
    }
);

module.exports = router;