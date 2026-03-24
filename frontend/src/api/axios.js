//Configura el archivo para las peticiones al backend utilizando Axios. 
// Aquí definiremos la URL base de la API y cualquier configuración adicional 
// que necesitemos para manejar las solicitudes, como los encabezados de autenticación.


import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // La URL base de tu backend
  timeout: 10000,  // Tiempo máximo de espera para las respuestas
});

// / --- INTERCEPTOR DE PETICIONES (Request) ---
// Este código se ejecuta ANTES de que la petición salga hacia el backend
api.interceptors.request.use(
  (config) => {
    // 1. Buscamos el token en el almacenamiento local del navegador
    const token = localStorage.getItem('token');
    
    // 2. Si el token existe, lo añadimos automáticamente a las cabeceras
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- INTERCEPTOR DE RESPUESTAS (Response) ---
// Este código se ejecuta cuando el backend responde
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde con 401 (No autorizado) o 403 (Prohibido)
    // es probable que el token haya caducado o sea inválido
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Sesión caducada o sin permisos. Redirigiendo al login...");
      // Opcional: Borrar token y redirigir
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;