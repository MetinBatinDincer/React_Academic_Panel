const jwt = require('jsonwebtoken');

const jwtSecret = 'your_jwt_secret_here';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token geçersiz' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
