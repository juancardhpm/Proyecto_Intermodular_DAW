// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Asegúrate de que Vite se ejecute en el puerto 5173
    proxy: {
      '/api': 'http://localhost:3000',  // Redirige todas las solicitudes /api al backend en puerto 3000
    },
    hmr: {
      overlay: false,  // Desactiva el overlay de error si lo prefieres
    },
  },
});