const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

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

const checkAdmin = (req, res, next) => {
  try {
    const role = getUserRole(req);
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Missing token' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  getUserRole,
  getUserId,
  checkAdmin,
  authenticate,
};
