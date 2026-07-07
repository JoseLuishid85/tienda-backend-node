const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Categoria = require('./Categoria');
const SubCategoria = require('./SubCategoria');

class Producto extends Model { }

Producto.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    costo: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    porcentaje_ganancia: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    precio: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    precio_oferta: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    extracto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    talla: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    color: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    medida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    portada: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    descuento: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categoria,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    subCategoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SubCategoria,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos', // Nombre real de la tabla en MySQL
    timestamps: true, // Si quieres createdAt y updatedAt
});

Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' });

Producto.belongsTo(SubCategoria, { foreignKey: 'subCategoriaId', as: 'subCategoria' });
SubCategoria.hasMany(Producto, { foreignKey: 'subCategoriaId', as: 'productos' });


module.exports = Producto;

