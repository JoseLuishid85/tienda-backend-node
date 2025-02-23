const Usuario = require("../models/Usuario");
const bcrypt = require('bcrypt');

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

const postUsuarioAdmin = async (req, res) => {
    /*
    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }*/

        const usuario = req.body; 

        try {
            await Usuario.sync();
    
            const emailExists = await Usuario.findOne({ where: { email: usuario.email } });
            if (emailExists) {
                return res.status(404).json({
                    msg: 'El correo electrónico ya está en uso',
                });
            }
    
            // Hash de la contraseña antes de almacenarla en la base de datos
            const hashedPassword = await bcrypt.hash(usuario.password, 10);
    
            const newUsuario = await Usuario.create({
                ...usuario,
                password: hashedPassword,
            });
    
            res.json({
                msg: "Usuario agregado con exito",
                usuario: newUsuario
            })
        } catch (error) {
            res.status(500).json({
                msg: "Error al procesar datos"
            });
            console.log(error);
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
    postUsuarioAdmin,
    putUsuario,
    deleteUsuario
}