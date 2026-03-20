const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Extraer el token del header 'Authorization'
    // El formato suele ser: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Si no hay token, denegar el acceso
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        // 3. Verificar si el token es válido usando la CLAVE_SECRETA de tu .env
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Guardar los datos del usuario verificado en el objeto 'req'
        // Esto permite que el controlador sepa QUÉ usuario está haciendo la petición
        req.user = verified;

        // 5. Dar paso al siguiente paso (el controlador)
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token no válido o expirado.' });
    }
};

module.exports = authMiddleware;