const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente.js');

class Direccion extends Model {}

Direccion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    direccion: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    pais: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    ciudad: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    zip: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cliente,
            key: 'id'
        },
        onDelete: 'CASCADE' 
    }
}, {
    sequelize,
    modelName: 'Direccion',
    tableName: 'direcciones', // Nombre real de la tabla en MySQL
    timestamps: true, // Si quieres createdAt y updatedAt
});

Cliente.hasMany(Direccion, { foreignKey: 'clienteId', as: 'direcciones' });
Direccion.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'clientes' });

module.exports = Direccion;