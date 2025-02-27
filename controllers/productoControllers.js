const slugify = require('slugify');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

const Categoria = require('../models/Categoria.js');
const Producto = require('../models/Producto.js')
const SubCategoria = require('../models/SubCategoria.js');

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

    if (!req.file) {
        return res.status(400).json({ msg: 'No se subió ningún archivo' });
    }

    const img_path = req.file.path;
    const str_img = img_path.split('\\');
    const str_portada = str_img[str_img.length - 1];
    
    //data.portada = `uploads/productos/${str_portada}`;
    data.portada = str_portada;
    data.slug = slugify(data.titulo).toLowerCase(); 

    // Crear el producto en la base de datos
    try {
        const producto = await Producto.create(data);
        return res.status(200).send({ data: data });
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }

}

const getProductoAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }

    let filtro = req.params['filtro'];
    let whereCondition = {};

    if (filtro) {
        whereCondition = {
            [Op.or]: [
                { titulo: { [Op.like]: `%${filtro}%` } },
            ]
        };
    }

    let producto = await Producto.findAll({
        where: whereCondition,
        include:[
            {
                model: Categoria,
                as: 'categoria', 
            },
            {
                model: SubCategoria,
                as: 'subCategoria', 
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json(producto);

}

const obtenerProductoAdmin = async (req, res) => {

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
        let producto = await Producto.findOne({
            where: {
                id: id
            },
            include:[
                {
                    model: Categoria,
                    as: 'categoria', 
                },
                {
                    model: SubCategoria,
                    as: 'subCategoria', 
                }
            ],
        });

        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: 'El Producto no existe en la base de dato',
            });
        }

        res.status(200).send(producto);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al procesar datos',
        })
    }
}

const actualizar_producto = async (req, res) => {
    if (!req.usuario) {
        return res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
    }

    const { id } = req.params; // Obtener el ID del producto a actualizar
    let data = req.body;

    if (!req.file) {
        return res.status(400).json({ msg: 'No se subió ningún archivo' });
    }

    const img_path = req.file.path;
    const str_img = img_path.split('\\');
    const str_portada = str_img[str_img.length - 1];
    data.portada = str_portada;

    try {

        if (data.titulo) {
            data.slug = slugify(data.titulo).toLowerCase();
        }
    
        const product = await Producto.update({
            titulo: data.titulo,
            slug: data.slug,
            costo: data.costo,
            porcentaje_ganancia: data.porcentaje_ganancia,
            precio: data.precio,   
            extracto: data.extracto,
            talla: data.talla,
            color: data.color,
            medida: data.medida ,
            portada: data.portada,
            estado: data.estado,
            descuento: data.descuento,
            stock: data.stock,
            categoriaId:  data.categoriaId,
            subCategoriaId: data.subCategoriaId
        }, {
            where: {
                id: id
            }
        });

        if (product) {
            const productoActualizado = await Producto.findByPk(id);
            return res.status(200).send({ data: productoActualizado, msg: 'Producto actualizado correctamente' });
        } else {
            return res.status(404).send({ ok: false, data: undefined, msg: 'Producto no encontrado' });
        }
    } catch (error) {
        return res.status(500).send({ ok: false, data: undefined, msg: 'Error al procesar datos' });
    }
};

const listaProductoActivoAdmin = async (req, res) => {

    if (!req.usuario) {
        res.status(500).json({
            data: undefined,
            msg: 'Error Token',
            dd: req.usuario
        });
        return
    }


    let producto = await Producto.findAll({
        where: {
            estado: true
        },
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json(producto);

}

const obtenerImageProducto = async (req, res) => {
    const img = req.params['img'];

    // Validar que el nombre de la imagen no contenga caracteres peligrosos
    if (/\.\./g.test(img)) {
        return res.status(400).send({ message: 'Nombre de archivo no válido' });
    }

    // Construir la ruta de la imagen
    const imagePath = path.join(__dirname, '../uploads/productos', img);

    try {
        // Verificar si la imagen existe
        await fs.promises.access(imagePath, fs.constants.F_OK);

        // Si existe, enviar la imagen
        res.status(200).sendFile(imagePath);
    } catch (error) {
        // Si no existe, enviar la imagen por defecto
        const defaultImagePath = path.join(__dirname, '../uploads/default.jpg');
        res.status(404).sendFile(defaultImagePath);
    }
};

module.exports = {
    registro_producto,
    getProductoAdmin,
    obtenerProductoAdmin,
    actualizar_producto,
    obtenerImageProducto,
    listaProductoActivoAdmin
}