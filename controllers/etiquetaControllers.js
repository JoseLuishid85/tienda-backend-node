const sequelize = require('../config/database');
const Etiqueta = require('../models/Etiqueta.js');

const obtenerEtiquetasGaleria = async (req, res) => {
    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let galeriaId = req.params['id'];

    try {
        let etiquetas = await Etiqueta.findAll({
            where: { galeriaId }
        });
        return res.status(200).send({ data: etiquetas });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
}

const actualizarEtiquetasGaleria = async (req, res) => {
    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let galeriaId = req.params['id'];
    let variedadIds = Array.isArray(req.body.variedadIds) ? req.body.variedadIds : [];

    const t = await sequelize.transaction();

    try {
        await Etiqueta.destroy({ where: { galeriaId }, transaction: t });

        if (variedadIds.length > 0) {
            await Etiqueta.bulkCreate(
                variedadIds.map(variedadId => ({ galeriaId, variedadId })),
                { transaction: t }
            );
        }

        await t.commit();

        let etiquetas = await Etiqueta.findAll({ where: { galeriaId } });
        return res.status(200).send({ data: etiquetas, msg: 'Etiquetas actualizadas correctamente' });
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
}

module.exports = {
    obtenerEtiquetasGaleria,
    actualizarEtiquetasGaleria
}
