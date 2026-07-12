const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Galeria = require('./Galeria');
const Variedad = require('./Variedad');

class Etiqueta extends Model { }

Etiqueta.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    galeriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Galeria,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    variedadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Variedad,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'Etiqueta',
    tableName: 'etiquetas', // Nombre real de la tabla en MySQL
    timestamps: true,
});

Galeria.hasMany(Etiqueta, { foreignKey: 'galeriaId', as: 'etiquetas' });
Etiqueta.belongsTo(Galeria, { foreignKey: 'galeriaId', as: 'galeria' });

Variedad.hasMany(Etiqueta, { foreignKey: 'variedadId', as: 'etiquetas' });
Etiqueta.belongsTo(Variedad, { foreignKey: 'variedadId', as: 'variedad' });

module.exports = Etiqueta;
