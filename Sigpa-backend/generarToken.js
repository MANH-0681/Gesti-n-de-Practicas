require('dotenv').config(); 
const jwt = require('jsonwebtoken');

const token = jwt.sign({
  id: 1,
  universities_id: 1,
  admin: true,
  tipo: 'docente'
}, process.env.JWT_SECRET);

console.log('TOKEN:\n', token);