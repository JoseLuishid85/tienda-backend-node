const express = require('express');
const app = express();
require('dotenv').config();

const usuarioRoutes = require('./routes/usuario');

app.use(express.json());
app.use('/store/api/usuario', usuarioRoutes);

const PORT = 4000;
 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
