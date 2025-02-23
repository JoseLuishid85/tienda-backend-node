const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario.js');

const checkAuth = async (req, res, next) => {

  let token;

  token = req.headers.authorization;

  if (!token) {
    const error = new Error("Token no valido");
    return res.status(401).json({ msg: error.message });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  } 

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = await Usuario.findByPk(decoded.id);
    return next();

  } catch (error) {
    return res.status(404).json({ msg: 'Token no valido' });
  }

};

module.exports = checkAuth;