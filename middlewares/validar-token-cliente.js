const jwt = require('jsonwebtoken');
const Cliente = require('../models/Cliente.js');


const checkAuthCliente = async (req, res, next) => {

  let token;

  token = req.headers.authorization;

  if (!token) {
    const error = new Error("Token Cliente no valido ");
    return res.status(401).json({ msg: error.message });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  } 

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET_CLIENTE);

    if (!decoded || !decoded.id) {
      throw new Error("Token Cliente no válido");
    }

    const cliente = await Cliente.findByPk(decoded.id);

    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }

    req.cliente = cliente;
    return next();

  } catch (error) {
    return res.status(404).json({ msg: 'Token Cliente no valido' });
  }

};

module.exports = checkAuthCliente;