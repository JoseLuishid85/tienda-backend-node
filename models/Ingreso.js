const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Proveedor = require('./Proveedor');

class Ingreso extends Model { }

Ingreso.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    proveedorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Proveedor,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    ncomprobante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    documento: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Nada'
    },
    monto_total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    serie: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monto_resultante: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    usuarioId: { // Clave foránea
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        },
        onDelete: 'CASCADE' // Si se borra una categoría, también sus subcategorías
    }
}, {
    sequelize,
    modelName: 'Ingreso',
    tableName: 'ingreso',
    timestamps: true
});

Usuario.hasMany(Ingreso, { foreignKey: 'usuarioId', as: 'ingreso' });
Proveedor.hasMany(Ingreso, { foreignKey: 'proveedorId', as: 'ingresos' });
Ingreso.belongsTo(Proveedor, { foreignKey: 'proveedorId', as: 'proveedorInfo' });


module.exports = Ingreso;