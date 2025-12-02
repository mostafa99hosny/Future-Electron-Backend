const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret';
const COOKIE_NAME = 'refreshToken';  // or the cookie name you use

function authMiddleware(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // you may want different data/claims for refresh tokens
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
  }
}

module.exports = authMiddleware;
