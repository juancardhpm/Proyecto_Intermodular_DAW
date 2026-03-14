// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Ruta para obtener los productos del carrito
router.get('/', cartController.getCartItems);

module.exports = router;