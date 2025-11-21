const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Venta = require('./Venta');
const Producto = require('./Producto');
const Variedad = require('./Variedad');

class DetalleVenta extends Model {}

DetalleVenta.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ventaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Venta,
            key: 'id'
        }
    },
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id'
        }
    },
    variedadId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Variedad,
            key: 'id'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unidad:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    
}, {
    sequelize,
    modelName: 'DetalleVenta',
    tableName: 'detalle_venta', 
    timestamps: true,
});

DetalleVenta.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
DetalleVenta.belongsTo(Variedad, { foreignKey: 'variedadId', as: 'variedad' });

Venta.hasMany(DetalleVenta, { foreignKey: 'ventaId', as: 'detalles' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'ventaId', as: 'venta' });


module.exports = DetalleVenta;