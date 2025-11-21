const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Direccion = require('./Direccion');

class Venta extends Model {}

Venta.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nventa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    forma_pago: {
        type: DataTypes.STRING,
        allowNull: false
    },
    banco: {
        type: DataTypes.STRING,
        allowNull: true
    },
    transaccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    envio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: 'Pendiente',
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    day: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cliente,
            key: 'id'
        }
    },
    direccionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Direccion,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Venta',
    tableName: 'venta', 
    timestamps: true,
});

Venta.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Venta.belongsTo(Direccion, { foreignKey: 'direccionId', as: 'direccion' });

module.exports = Venta;