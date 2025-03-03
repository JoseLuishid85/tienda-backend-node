const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Producto = require('./Producto');

class Variedad extends Model {}

Variedad.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    talla: {
        type: DataTypes.STRING,
        allowNull: true
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    },
    medida: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    productoId: { // Clave foránea
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id'
        },
        onDelete: 'CASCADE' // Si se borra una categoría, también sus subcategorías
    }
}, {
    sequelize,
    modelName: 'Variedad',
    tableName: 'variedades', // Nombre real de la tabla en MySQL
    timestamps: true
});

Producto.hasMany(Variedad, { foreignKey: 'productoId', as: 'variedades' });
Variedad.belongsTo(Producto, { foreignKey: 'productoId', as: 'productos' });

module.exports = Variedad;