const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Banco extends Model {}

Banco.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cod_banco:{
        type: DataTypes.STRING(10),
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN(),
        defaultValue: true
    },
}, {
    sequelize,
    modelName: 'Banco',
    tableName: 'bancos', // Nombre real de la tabla en MySQL
    timestamps: true, // Si quieres createdAt y updatedAt
});

module.exports = Banco;