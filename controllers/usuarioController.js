const Usuario = require("../models/Usuario");
const bcrypt = require('bcrypt');


const postUsuarioAdmin = async (req, res) => {
    /*
    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }
*/
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

const getUsuariosAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }


    let usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] }  });

    res.status(200).json(usuarios);

}

const getUsuarioAdmin = async (req, res) => {

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
        let usuario = await Usuario.findOne({
            where: {
                id: id
            },
            attributes: { exclude: ['password'] }
        });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no existe en la base de dato',
            });
        }

        res.json({
            ok: true,
            usuario,
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const updateUsuarioAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let id = req.params['id'];
    let data = req.body;
    try {
        let usuario = await Usuario.update({
            nombres: data.nombres,
            apellidos: data.apellidos,
            rol: data.rol,
            email: data.email
        }, {
            where: { id: id }
        });

        const usuarioAct = await Usuario.findOne({ where: { id: id }, attributes: { exclude: ['password'] } } )

        res.json({
            ok: true,
            usuarioAct
        });
    } catch (error) {
        res.status(500).send({
            ok: false,
            msg: 'Error al procesar datos'
        })
        console.log(error);
    }
}

const cambiarEstadoAdmin = async (req, res) => {
    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let id = req.params['id'];
    let data = req.body;

    let nuevo_estado = false;

    if (data.estado) {
        nuevo_estado = false;
    } else {
        nuevo_estado = true;
    }


    try {

        let usuario = await Usuario.update({
            estado: nuevo_estado
        }, {
            where: { id: id }
        });

        const usuarioAct = await Usuario.findOne({ where: { id: id } , attributes: { exclude: ['password'] }})

        res.status(200).json({
            ok: true,
            usuarioAct,
            nuevo_estado
        });
    } catch (error) {
        res.status(500).send({
            ok: false,
            msg: 'Error al procesar datos'
        })
        console.log(error);
    }
}


module.exports = {
    postUsuarioAdmin,
    getUsuariosAdmin,
    getUsuarioAdmin,
    updateUsuarioAdmin,
    cambiarEstadoAdmin,
}