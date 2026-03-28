'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { conectarDB } = require('./config/db');
const db = require('./models'); // Importante para cargar las relaciones (belongsTo, etc.)

// 1. Importar todas tus rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Configuración de Middlewares
app.use(cors({
    origin: 'http://localhost:5173', // URL de tu React/Vue
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json()); // Para poder leer JSON en el body

// 3. Conexión a la Base de Datos
conectarDB();

// 4. Registro de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/category', categoryRoutes);

// Ruta de bienvenida/test
app.get('/', (req, res) => {
    res.send('🚀 Servidor del TFG de la Tienda Gaming funcionando');
});

// 5. Arrancar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// 6. Si no arranca el servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor' });
});