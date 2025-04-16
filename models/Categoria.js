const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Categoria extends Model {}

Categoria.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'categorias', // Nombre real de la tabla en MySQL
    timestamps: true, // Si quieres createdAt y updatedAt
});

module.exports = Categoria;

