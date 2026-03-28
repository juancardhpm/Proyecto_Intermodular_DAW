import React from 'react';
import { Navigate } from 'react-router-dom';

// Creamos un componente de ruta protegida. Este envuelve a otros (como por ejemplo, AdminProducts), y decide si el usuario tiene permiso para verlos.
const ProtectedRoute = ({ children }) => {
    // Obtenemos lo primero los datos del usuario guardados en el Login
    const userstring = localStorage.getItem('user');
    const user = userstring ? JSON.parse(userstring) : null;

    // Logica de acceso --> Si no hay usuarioi logueado o el rol no es 'admin'...
    if(!user || user.rol !== 'admin'){
        // Lo redirijo al Login y no dejamos que vea el contenido.
        console.warn('Acceso denegado: Se requiere rol de administrador.');
        return <Navigate to = "/login" replace />;

    }
    return children;
};

export default ProtectedRoute;