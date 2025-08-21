
const { Op } = require('sequelize');

const Cliente = require('../models/Cliente.js');
const Direccion = require('../models/Direccion.js');

const getDirecciones = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    
    let direccion = await Direccion.findAll({
        order: [['nombres', 'ASC']],
        include: {
            model: Cliente,
            as: 'clientes', 
        }
    });

    res.status(200).json(
        direccion
    );
}

const crearDireccionCliente = async (req, res) => {

    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    let data = req.body;
    data.id_cliente = req.cliente.id

    await Direccion.sync();

    try {
        const newDireccion = await Direccion.create(data);
        return res.status(200).json({ data: newDireccion });
    } catch (error) {
        return res.status(500).json({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
}

const obtenerDireccion = async (req, res) => {

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
        let direccion = await Direccion.findOne({
            where: {
                id: id
            },
            include: {
                model: Cliente,
                as: 'clientes', 
            }
        });

        if (!direccion) {
            return res.status(404).json({
                ok: false,
                msg: 'La direccion no existe en la base de dato',
            });
        }

        res.status(200).send(direccion);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const obtenerDireccionCliente = async (req, res) => {

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
        let direccion = await Direccion.findOne({
            where: {
                clienteId: id
            }
        });

        if (!direccion) {
            return res.status(404).json({
                ok: false,
                msg: 'El cliente no tiene  dirección en la base de dato',
            });
        }

        res.status(200).send(direccion);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const actualizarDireccion = async (req, res) => {
    
    if (!req.cliente) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.cliente
        });
        return
    }

    
    
    let data = req.body;
    let id = parseInt(req.params['id']);

    const direccion = await Direccion.findOne({ where: { id: id } });

    // Verificar si se encontró un producto existente
    if (!direccion) {
        res.status(500).send({ data: undefined, msg: 'La direccion no existe en la base de datos' });
        return;
    }

    try {

        const direccionAct = await Direccion.update({
            nombres: data.nombres,
            apellidos: data.apellidos,
            documento: data.documento,
            telefono: data.telefono,
            pais: data.pais,
            ciudad: data.ciudad,
            zip: data.zip,
            direccion: data.direccion,
            clienteId: data.clienteId,
        }, {
            where: {
                id: id
            }
        });
        
        const direccionActualizada = await Direccion.findOne({ where: { id: id } });

        res.status(200).json({
            data: direccionActualizada
        })
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
    

}

const eliminarDireccion = async (req, res) => {

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
        let direccion = await Direccion.findOne({
            where: {
                id: id
            },
        });

        await direccion.destroy();

        res.status(200).json({ 
            msg:'La direccion fue eliminada con exito',
        });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

module.exports = {
    getDirecciones,
    crearDireccionCliente,
    obtenerDireccion,
    obtenerDireccionCliente,
    actualizarDireccion,
    eliminarDireccion
}