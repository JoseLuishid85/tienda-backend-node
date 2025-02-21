const Usuario = require("../models/Usuario");

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        await usuario.update(req.body);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        await usuario.destroy();
        res.status(200).json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUsuarios,
    getUsuario,
    postUsuario,
    putUsuario,
    deleteUsuario
}