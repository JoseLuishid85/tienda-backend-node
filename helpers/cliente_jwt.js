const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generarClienteJWT = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_CLIENTE, { expiresIn: '100d' });

    return token;
}

module.exports = {
    generarClienteJWT
} 