const Producto = require('../models/Producto.js')
const Variedad = require('../models/Variedad.js');
const Ingreso = require('../models/Ingreso.js');
const DetalleIngreso = require('../models/DetalleIngreso.js');
const fs = require('fs');
const path = require('path');

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
    let detalles = JSON.parse(data.detalles);

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
    await DetalleIngreso.sync();

    try {

        const ingreso = await Ingreso.create(data);

        for (var item of detalles) {
            item.ingresoId = ingreso.id;

            let variedad = await Variedad.findOne({ where: { id: item.variedadId } });
            await Variedad.update({ stock: variedad.stock + item.cantidad }, {
                where: {
                    id: item.variedadId
                }
            });

            const sumaStock = await Variedad.sum('stock', { where: { productoId: item.productoId } });
            await Producto.update({ stock: sumaStock }, {
                where: {
                    id: item.productoId
                }
            });

            await DetalleIngreso.create(item);

        }

        const newIngreso = await Ingreso.findOne({
            where: { id: ingreso.id },
            include: [
                {
                    model: DetalleIngreso,
                    as: 'detalles'
                }
            ]
        });

        return res.status(200).json({
            ingreso: newIngreso,
        });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
}

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
        include: [
            {
                model: DetalleIngreso,
                as: 'detalles'
            }
        ]
    });

    res.send(ingreso);

}

const obtenerIngresoAdmin = async (req, res) => {
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
            include: [
                {
                    model: DetalleIngreso,
                    as: 'detalles',
                    /*
                    include: [
                        {
                            model: Producto,
                            as: 'producto' // Usa el alias correcto
                        },
                        {
                            model: Variedad,
                            as: 'variedad' // Usa el alias correcto
                        }
                    ]*/
                }
            ]
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

    const name = req.params['name'];

    if (/\.\./g.test(name)) {
        return res.status(400).send({ message: 'Nombre de archivo no válido' });
    }

    const documento = path.join(__dirname, '../uploads/documentos', name);

    try {
        await fs.promises.access(documento, fs.constants.F_OK);

        res.status(200).sendFile(documento);
    } catch (error) {
        // Si no existe, enviar la imagen por defecto
        const defaultPath = path.join(__dirname, '../uploads/default.jpg');
        res.status(404).sendFile(defaultPath);
    }


}


module.exports = {
    registroIngresoAdmin,
    obtenerIngresosAdmin,
    obtenerIngresoAdmin,
    obtenerDocumentoIngreso
}