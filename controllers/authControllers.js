const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt.js');
const Usuario = require('../models/Usuario.js');

const loginUsuario = async (req, res) => {

  const { email, password } = req.body;
  
  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        return res.status(401).json({
          msg: 'Credenciales inválidas',
        });
      }

    if (usuario.estado === false) {
      res.status(401).json({ data: undefined, msg: 'Su cuenta esta Desactiva' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json({
        msg: 'Credenciales inválidas',
      });
    }

    // Generar un token JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: 'Inicio de sesión exitoso',
      usuario,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al procesar la solicitud',
    });
  }
};
module.exports = {
  loginUsuario,
}