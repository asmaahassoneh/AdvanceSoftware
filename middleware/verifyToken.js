const authService = require('../services/authService');

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  authService.verifyToken(token)
    .then((decoded) => {
      req.user = decoded; // attach decoded user info to request
      next();
    })
    .catch((err) => {
      res.status(401).json({ message: 'Invalid or expired token.' });
    });
}

module.exports = verifyToken;
