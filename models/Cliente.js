const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cliente extends Model {}

Cliente.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombres: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING(50),
        allowNull: true 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
        validate: {
            isEmail: true, 
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN(),
        defaultValue: true
    },
    pais: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    recovery: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    genero: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes', // Nombre real de la tabla en MySQL
    timestamps: true, // Si quieres createdAt y updatedAt
});

module.exports = Cliente;