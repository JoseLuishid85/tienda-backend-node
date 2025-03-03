const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

const Producto = require('./Producto');
const Variedad = require('./Variedad');
const Ingreso = require('./Ingreso');

class detalleIngreso extends Model { }

detalleIngreso.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unidad: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ingresoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Ingreso,
            key: 'id'
        },
        onDelete: 'CASCADE'
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
    }
}, {
    sequelize,
    modelName: 'detalleIngreso',
    tableName: 'detalle_ingreso',
    timestamps: true
});

Ingreso.hasMany(detalleIngreso, { foreignKey: 'ingresoId', as: 'ingreso' });
detalleIngreso.belongsTo(Ingreso, { foreignKey: 'ingresoId', as: 'detalle_ingreso' });

module.exports = detalleIngreso;