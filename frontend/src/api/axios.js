//Configura el archivo para las peticiones al backend utilizando Axios. 
// Aquí definiremos la URL base de la API y cualquier configuración adicional 
// que necesitemos para manejar las solicitudes, como los encabezados de autenticación.


import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // La URL base de tu backend
  timeout: 10000,  // Tiempo máximo de espera para las respuestas
});

export default api;