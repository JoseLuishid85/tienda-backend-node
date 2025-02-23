const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Categoria = require('./Categoria'); // Importamos el modelo Categoria

class SubCategoria extends Model {}

SubCategoria.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    categoriaId: { // Clave foránea
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categoria,
            key: 'id'
        },
        onDelete: 'CASCADE' // Si se borra una categoría, también sus subcategorías
    }
}, {
    sequelize,
    modelName: 'SubCategoria',
    tableName: 'sub_categorias', // Nombre real de la tabla en MySQL
    timestamps: true
});

Categoria.hasMany(SubCategoria, { foreignKey: 'categoriaId', as: 'subcategorias' });
SubCategoria.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = SubCategoria;
