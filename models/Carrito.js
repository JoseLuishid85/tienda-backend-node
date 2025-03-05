const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Producto = require('./Producto');
const Variedad = require('./Variedad');
const Cliente = require('./Cliente');

class Carrito extends Model {}

Carrito.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio: {
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id'
        }
    },
    variedadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Variedad,
            key: 'id'
        }
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cliente,
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Carrito',
    tableName: 'carrito', 
    timestamps: true,
});


Carrito.belongsTo(Variedad, { foreignKey: 'variedadId', as: 'variedad' });
Carrito.belongsTo(Producto, { foreignKey: 'productoId', as: 'productos' });
Carrito.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });


module.exports = Carrito;