const Producto = require('../models/Producto.js')
const Variedad = require('../models/Variedad.js');
const { Op } = require('sequelize');


const registroVariedad = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let data = req.body;
    await Variedad.sync();

    // Crear el Variedad en la base de datos
    try {
        const variedad = await Variedad.create(data);
        return res.status(200).send({ data: variedad });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const obtenerVariedadProducto = async (req,res) => {
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
        let variedades = await Variedad.findAll({
            where:{
                productoId: id
            }
        });

        res.status(200).send(variedades);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const eliminarVariedad = async (req,res) =>{
    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }
    
    let id = req.params['id'];
    let variedad = await Variedad.findOne({where: { id: id }});
    
    if(!variedad){
        return res.status(404).json({
            ok: false,
            msg: 'La variedad no existe en la base de dato',
        });
    }

    if(variedad.stock > 0){
        return res.status(404).json({
            ok: false,
            msg: 'La variedad es mayor a cero en la base de dato',
        });
    }
    
    try {
        await variedad.destroy();
    
        res.status(200).json({
            msg: 'La variedad ha sido eliminada con exito'
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al procesar datos',
        })
    }
}


module.exports = {
    registroVariedad,
    obtenerVariedadProducto,
    eliminarVariedad
}