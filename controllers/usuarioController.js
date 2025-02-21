const Usuario = require("../models/Usuario");

const getUsuarios = async (req, res) => {
    res.json({
        msg: "getUsuarios",
    });
}

const postUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await Usuario.create(req.body);
        res.status(200).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const putUsuario = async (req, res) => {
    res.json({
        msg: "putUsuario",
    });
}

const deleteUsuario = async (req, res) => {
    res.json({
        msg: "deleteUsuario",
    });
}

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}