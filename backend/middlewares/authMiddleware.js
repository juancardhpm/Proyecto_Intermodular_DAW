const jwt = require('jsonwebtoken');

// Cambiamos el nombre a verifyToken para que coincida con tus rutas
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // IMPORTANTE: Guardamos el usuario en req.user para que el siguiente middleware lo vea
        req.user = verified; 
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token no válido.' });
    }
};

// Exportamos como objeto para que el { verifyToken } del require funcione
module.exports = { verifyToken };