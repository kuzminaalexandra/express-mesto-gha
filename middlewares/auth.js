const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ message: 'Требуется авторизация' });
  }

  try {
    const payload = jwt.verify(token, 'secret');
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Требуется авторизация' });
  }
};
