const express = require('express');
const cors = require('cors'); 
const { conectarDB, sequelize } = require('./config/db');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173', // La URL del Frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos de interaccion
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas 
}));

app.use(express.json());
conectarDB();


app.get('/', (req, res) => {
    res.send('Servidor del TFG de la Tienda Gaming');
});

app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});