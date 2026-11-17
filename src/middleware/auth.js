const { verifyAccessToken } = require("../utils/jwt")

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "Токен не дали" })
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Токен невалид" })
    }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Не аутентифицирован' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Нет прав доступа' })
    }
    next()
  }
}

module.exports = { authenticate, authorize }
