const express = require('express');
const { conectarDB } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
conectarDB();

app.get('/', (req, res) => {
    res.send('Servidor del TFG de la Tienda Gaming');
});

app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});