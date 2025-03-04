const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

class Ingreso extends Model {}

Ingreso.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    proveedor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ncomprobante:{
        type: DataTypes.STRING,
        allowNull: false
    },
    documento:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Nada'
    },
    monto_total:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    serie:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monto_resultante:{
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


module.exports = Ingreso;