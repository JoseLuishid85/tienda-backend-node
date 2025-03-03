
//const Direccion = require('../models/Direccion.js');
//const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const Cliente = require('../models/Cliente.js');

const registrarClienteEcommerce = async (req, res) => {

    const cliente = req.body;

    try {
        await Cliente.sync();
        
        const emailExists = await Cliente.findOne({ where: { email: cliente.email } });
        if (emailExists) {
            return res.status(404).json({
                msg: 'El correo electrónico ya está en uso',
            });
        }

        // Hash de la contraseña antes de almacenarla en la base de datos
        const hashedPassword = await bcrypt.hash(cliente.password, 10);
        cliente.password = hashedPassword;

        const newCliente = await Cliente.create(cliente);

        res.json({
            msg: "Cliente agregado con exito",
            cliente: newCliente
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error al procesar datos"
        });
        console.log(error);
    }
}

const obtenerClienteToken = async(req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let id = req.params.id;

    try {
        let cliente = await Cliente.findOne({
            where: {
                id: id
            },
            attributes: { exclude: ['password'] }
        });

        if (!cliente) {
            return res.status(404).json({
                ok: false,
                msg: 'El cliente no existe en la base de dato',
            });
        }

        res.status(200).send(cliente);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

module.exports = {
    registrarClienteEcommerce,
    obtenerClienteToken
}