const express = require('express');
const app = express();
const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');

require('dotenv').config();

const usuarioRoutes = require('./routes/usuario');

app.use(express.json());

sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ Base de datos sincronizada.');
    })
    .catch(err => console.error('❌ Error al sincronizar la BD:', err));

app.use('/store/api/usuario', usuarioRoutes);

const PORT = 4000;
 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
