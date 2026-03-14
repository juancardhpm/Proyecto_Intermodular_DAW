
//Creamos un archivo de rutas para manejar las solicitudes relacionadas con la autenticación, como el registro y el inicio de sesión.


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registrar un usuario
router.post('/register', authController.register);

// Ruta para el login
router.post('/login', authController.login);

module.exports = router;