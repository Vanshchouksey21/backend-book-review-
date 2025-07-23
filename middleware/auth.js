const jwt = require('jsonwebtoken');
const JWT_SECRET = "secret_key";

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;
