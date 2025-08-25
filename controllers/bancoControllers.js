const Banco = require('../models/Banco');

const crearBanco = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    const banco = req.body;

    await Banco.sync();
    try {

        banco.estado = true;

        const newBanco = await Banco.create(banco);
        return res.status(200).json({ data: banco });

    } catch (error) {
        res.status(500).json({
            msg: "Error al procesar datos"
        });
        console.log(error);
    }
}

const getBancos = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let bancos = await Banco.findAll({
        order: [['nombre', 'ASC']]
    });

    res.status(200).json(
        bancos
    );
}

const getBanco = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let id = req.params.id;

    let banco = await Banco.findOne({
        where: {
            id: id
        },
    });

    res.status(200).json(
        banco
    );
}

const actualizarBanco = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let data = req.body;
    let id = req.params.id;

    let banco = await Banco.findOne({
        where: {
            id: id
        },
    });

    try {
        if (!banco) {
            return res.status(404).send({ data: undefined, msg: 'El Banco no existe en la base de datos' });
        }

        await Banco.update(data, {
            where: { id: id }
        });

        const bancoAct = await Banco.findOne({ where: { id: id } });

        return res.status(200).json({
            data: bancoAct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            ok: false,
            data: undefined,
            msg: 'Error al procesar datos',
            error: error.message
        });
    }

}

const eliminarBanco = async (req, res) => {

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
        let banco = await Banco.findOne({
            where: {
                id: id
            },
        });

        await banco.destroy();

        res.status(200).json({
            msg: 'El Banco fue eliminada con exito',
        });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}



module.exports = {
    crearBanco,
    getBancos,
    getBanco,
    actualizarBanco,
    eliminarBanco
}