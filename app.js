const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const sequelize = require('./config/database');
const setupSocketIO = require('./config/socket');

const link = process.env.LINK_API

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


//app.use(`/${link}/api/data/`, require('./routes/dataRouter.js'));
app.use(`/${link}/api/login`, require('./routes/authRouter.js'));
app.use(`/${link}/api/usuario`, require('./routes/usuario.js'));
app.use(`/${link}/api/categoria`, require('./routes/categoriaRouter.js'));
app.use(`/${link}/api/sub_categoria`, require('./routes/subCategoriaRouter.js'));
app.use(`/${link}/api/producto`, require('./routes/productoRouter.js'));
app.use(`/${link}/api/variedad`, require('./routes/variedadRouter.js'));
app.use(`/${link}/api/etiqueta`, require('./routes/etiquetaRouter.js'));
app.use(`/${link}/api/proveedor`, require('./routes/proveedorRouter.js'));
app.use(`/${link}/api/cliente`, require('./routes/clienteRouter.js'));
app.use(`/${link}/api/direccion`, require('./routes/direccionRouter.js'));
app.use(`/${link}/api/ingreso`, require('./routes/ingresoRouter.js'));
app.use(`/${link}/api/detalle_ingreso`, require('./routes/detalleIngresoRouter.js'));
app.use(`/${link}/api/publico`, require('./routes/publicoRouter.js'));
app.use(`/${link}/api/customer`, require('./routes/customerRouter.js'));
app.use(`/${link}/api/venta`, require('./routes/ventaRouter.js'));
app.use(`/${link}/api/detalleventa`, require('./routes/detalleventaRouter.js'));
app.use(`/${link}/api/banco`, require('./routes/bancoRouter.js'));
app.use(`/${link}/api/report`, require('./routes/reportRouter.js'));

app.use(express.urlencoded({ extended: true }));

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Socket.IO listo para conexiones`);
});
