const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');

require('dotenv').config();
app.use(express.json());
app.use(cors());

//force: false alter: true
sequelize.sync({ alter: true }) 
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
app.use('/store/api/variedad', require('./routes/variedadRouter.js'));
app.use('/store/api/cliente', require('./routes/clienteRouter.js'));
app.use('/store/api/direccion/',  require('./routes/direccionRouter.js'));
app.use('/store/api/ingreso/', require('./routes/ingresoRouter.js'));
app.use('/store/api/detalle_ingreso/', require('./routes/detalleIngresoRouter.js'));
app.use('/store/api/publico/',  require('./routes/publicoRouter.js'));
app.use('/store/api/customer/',  require('./routes/customerRouter.js'));
app.use('/store/api/venta/',  require('./routes/ventaRouter.js'));
app.use('/store/api/detalleventa/',  require('./routes/detalleventaRouter.js'));

app.use(express.urlencoded({ extended: true }));

const PORT = 4000;
 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
