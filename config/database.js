const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('joseluish_tienda', 'joseluish_user', '51t)4!d?[%u&', {
    host: '',
    dialect: 'mysql',
    logging: false, // Evita que muestre logs en consola
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos exitosa.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
}

testConnection();

module.exports = sequelize;
