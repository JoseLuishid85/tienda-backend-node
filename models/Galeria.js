const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Producto = require('./Producto');

class Galeria extends Model { }

Galeria.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productoId: { // Clave foránea
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id'
        },
        onDelete: 'CASCADE' // Si se borra una categoría, también sus subcategorías
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Galeria',
    tableName: 'galerias', // Nombre real de la tabla en MySQL
    timestamps: true, // Si quieres createdAt y updatedAt
});

Producto.hasMany(Galeria, { foreignKey: 'productoId', as: 'galerias' });
Galeria.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

module.exports = Galeria;