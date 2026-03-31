const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCartItems);
router.post('/add', cartController.addToCart); // Esta es la que usa ProductCard
router.delete('/remove', cartController.removeFromCart);
router.put('/update', cartController.updateCart);

module.exports = router;