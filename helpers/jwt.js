const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generarJWT = (userId) =>{
    const token = jwt.sign({ id: userId},  process.env.JWT_SECRET,  { expiresIn: '5d' } );

    return token;
}

module.exports = {
    generarJWT
}