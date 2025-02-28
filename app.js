const express = require('express');
const app = express();
const sequelize = require('./config/database');

require('dotenv').config();
app.use(express.json());


sequelize.sync({ force: false })
    .then(() => {
        console.log('Base de datos sincronizada dd.');
    })
    .catch(err => console.error('Error al sincronizar la BD:', err));

//app.use('/store/api/data/',  require('./routes/dataRouter.js'));
app.use('/store/api/login', require('./routes/authRouter.js'));
app.use('/store/api/usuario', require('./routes/usuario'));
app.use('/store/api/categoria', require('./routes/categoriaRouter.js'));
app.use('/store/api/sub_categoria', require('./routes/subCategoriaRouter.js'));
app.use('/store/api/producto', require('./routes/productoRouter.js'));

app.use(express.urlencoded({ extended: true }));

const PORT = 4000;
 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
