const Producto = require('../models/Producto.js')
const Variedad = require('../models/Variedad.js');
const Ingreso = require('../models/Ingreso.js');
//const DetalleIngreso = require('../models/Ingreso_detalle.js');
const { Op } = require('sequelize');


const registroIngresoAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    

    let data = req.body;
    //let detalles = JSON.parse(data.detalles);

    // Procesar la imagen de portada
    //const img_path = req.files.documento.path;
   // const str_img = img_path.split('\\');
    //const str_documento = str_img[2];

    let img_path = req.file.path;
    let str_img = img_path.split('\\');
    let str_documento = str_img[str_img.length - 1];

    data.documento = str_documento;
    data.usuarioId = req.usuario.id;

    const reg_ingreso = await Ingreso.findAll({
        order: [['createdAt', 'DESC']], // Ordenar por createdAt en orden descendente
        limit: 1, // Limitar a 1 resultado
    });

    if (reg_ingreso.length === 0) {
        data.serie = 1;
    } else {
        data.serie = reg_ingreso[0].serie + 1;
    }

    await Ingreso.sync();
    //await DetalleIngreso.sync();

    try {

        const ingreso = await Ingreso.create(data);
        /*
        for (var item of detalles) {
            item.id_ingreso = ingreso.id;

            let variedad = await Variedad.findOne({ where: { id: item.id_variedad } });
            await Variedad.update({ stock: variedad.stock + item.cantidad }, {
                where: {
                    id: item.id_variedad
                }
            });

            const sumaStock = await Variedad.sum('stock', {  where: {  id_producto: item.id_producto  }  });
            await Producto.update({ stock: sumaStock }, {
                where: {
                    id: item.id_producto
                }
            });

            await DetalleIngreso.create(item);
        }

        const detallesIngreso = await DetalleIngreso.findAll({
            where: { id_ingreso: ingreso.id }
        });

        /*/
        return res.status(200).json({
            ingreso: ingreso,
            //detalles: detallesIngreso
        });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
}
/*
const obtenerIngresosAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }


    let ingreso;
    ingreso = await Ingreso.findAll({
        order: [['updatedAt', 'DESC']],
        include: DetalleIngreso
    });

    res.send(ingreso);

}

const obtenerIngresoAdmin = async (req,res) =>{
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
        let ingreso = await Ingreso.findOne({
            where: {
                id: id
            },
            include: [{
                model: DetalleIngreso,
                include: [Producto]
            }]
        });

        if (!ingreso) {
            return res.status(404).json({
                ok: false,
                msg: 'No tiene detalle',
            });
        }

        res.status(200).send(ingreso);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
      
}

const obtenerDocumentoIngreso = async (req, res) => {

    let name = req.params['name'];

    fs.stat('./uploads/documento/' + name, function (error) {
        if (error) {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/documento/' + name;
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

*/


module.exports = {
    registroIngresoAdmin,
    //obtenerIngresosAdmin,
    //obtenerIngresoAdmin,
    //obtenerDocumentoIngreso
}