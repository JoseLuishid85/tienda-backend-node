const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Proveedor extends Model {}

Proveedor.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_rif: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rif: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true
    },
    direccion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Proveedor',
    tableName: 'proveedor', // Nombre real de la tabla en MySQL
    timestamps: true, // Si quieres createdAt y updatedAt
});
 

module.exports = Proveedor;