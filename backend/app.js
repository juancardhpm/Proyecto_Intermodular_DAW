//Crea el archivo principal para iniciar la aplicación

// backend/app.js
const express = require('express');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');  // Importamos las rutas del carrito

const app = express();
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
/* app.use('/api/products', productRoutes); */
app.use('/api/cart', cartRoutes);  // Registramos las rutas del carrito

app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});