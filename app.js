const express = require('express');
const app = express();
const sequelize = require('./config/database');

require('dotenv').config();
app.use(express.json());

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Base de datos sincronizada dd.');
    })
    .catch(err => console.error('Error al sincronizar la BD:', err));

app.use('/store/api/usuario', require('./routes/usuario'));

const PORT = 4000;
 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
