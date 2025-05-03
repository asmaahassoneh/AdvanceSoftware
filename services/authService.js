const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const JWT_SECRET = process.env.JWT_SECRET;

const isValidEmail = (email) => validator.isEmail(email);

const getUserRole = (req) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('Missing token');
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.role;
};

const getUserId = (req) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('Missing token');
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.id;
};


const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};

const generateToken = (payload, expiresIn = '2h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

module.exports = {
  isValidEmail,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  getUserRole,
  getUserId,
};
