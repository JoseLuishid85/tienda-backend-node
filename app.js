const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const sequelize = require('./config/database');
const setupSocketIO = require('./config/socket');

require('dotenv').config();
app.use(express.json());
app.use(cors());

// Configurar Socket.IO
setupSocketIO(server);

//force: false alter: true
sequelize.sync({ alter: false })
  .then(() => {
    console.log('Base de datos sincronizada dd.');
  })
  .catch(err => console.error('Error al sincronizar la BD:', err));

//app.use('/valery/api/data/', require('./routes/dataRouter.js'));

app.use('/valery/api/login', require('./routes/authRouter.js'));
app.use('/valery/api/usuario', require('./routes/usuario.js'));
app.use('/valery/api/categoria', require('./routes/categoriaRouter.js'));
app.use('/valery/api/sub_categoria', require('./routes/subCategoriaRouter.js'));
app.use('/valery/api/producto', require('./routes/productoRouter.js'));
app.use('/valery/api/variedad', require('./routes/variedadRouter.js'));
app.use('/valery/api/proveedor', require('./routes/proveedorRouter.js'));
app.use('/valery/api/cliente', require('./routes/clienteRouter.js'));
app.use('/valery/api/direccion', require('./routes/direccionRouter.js'));
app.use('/valery/api/ingreso', require('./routes/ingresoRouter.js'));
app.use('/valery/api/detalle_ingreso', require('./routes/detalleIngresoRouter.js'));
app.use('/valery/api/publico', require('./routes/publicoRouter.js'));
app.use('/valery/api/customer', require('./routes/customerRouter.js'));
app.use('/valery/api/venta', require('./routes/ventaRouter.js'));
app.use('/valery/api/detalleventa', require('./routes/detalleventaRouter.js'));
app.use('/valery/api/banco', require('./routes/bancoRouter.js'));
app.use('/valery/api/report', require('./routes/reportRouter.js'));

app.use(express.urlencoded({ extended: true }));

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Socket.IO listo para conexiones`);
});
