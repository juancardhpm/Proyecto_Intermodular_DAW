/**
 * MIDDLEWARE DE AUTORIZACIÓN PARA ADMINISTRADORES
 * Este filtro se ejecuta DESPUÉS del authMiddleware (o verifyToken).
 * Su objetivo es verificar si el usuario tiene el rol necesario.
 */
const isAdmin = (req, res, next) => {
    // 1. REVISIÓN DE DATOS: 
    // Gracias al middleware anterior, los datos del usuario ya están en 'req.user'
    // porque los extrajimos del Token JWT previamente.
    
    // 2. VERIFICACIÓN DE ROL:
    // Comprobamos si el campo 'rol' guardado en el token es exactamente 'admin'
    if (req.user && req.user.rol === 'admin') {
        
        // 3. ACCESO CONCEDIDO:
        // Si es administrador, llamamos a next() para que la petición
        // continúe hacia el controlador (ej: crear o borrar productos)
        next();
        
    } else {
        
        // 4. ACCESO DENEGADO (Error 403 Forbidden):
        // Si el usuario está logueado pero NO es admin (es un cliente normal),
        // le cortamos el paso con un mensaje de error de permisos.
        return res.status(403).json({ 
            message: 'Acceso denegado: Se requieren permisos de administrador para realizar esta acción.' 
        });
    }
};

// Lo exportamos como un objeto para que puedas hacer: 
// const { isAdmin } = require('./adminMiddleware');
module.exports = { isAdmin };