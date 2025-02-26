const Producto = require('../models/Producto.js')
const slugify = require('slugify');

const registro_producto = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let data = req.body;
    await Producto.sync();
    /*
    const existingProduct = await Producto.findOne({ where: { titulo: data.titulo } });

    if (existingProduct) {
        return res.status(500).send({ data: undefined, msg: 'El título ya existe en la base de datos' });
    }*/

    // Procesar la imagen de portada
    if (!req.file) {
        return res.status(400).json({ msg: 'No se subió ningún archivo' });
    }

    const img_path = req.file.path;
    const str_img = img_path.split('\\');
    const str_portada = str_img[str_img.length - 1];
    
    data.portada = `uploads/productos/${str_portada}`;
    data.slug = slugify(data.titulo).toLowerCase(); 

    // Crear el producto en la base de datos
    try {
        const producto = await Producto.create(data);
        return res.status(200).send({ data: data });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

module.exports = {
    registro_producto
}