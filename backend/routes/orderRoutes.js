const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

/**
 * RUTAS DE PEDIDOS (API: /api/orders)
 */

// 1. Checkout (POST /api/orders/checkout)
router.post('/checkout', verifyToken, orderController.createOrder); 

// 2. Pedidos de un usuario
router.get('/user/:usuario_id', verifyToken, orderController.getUserOrders);

// 3. Detalles de un pedido
router.get('/:id', verifyToken, orderController.getOrderById);

// 4. Todos los pedidos (Admin)
router.get('/', verifyToken,  orderController.getAllOrders);

// 5. Actualizar estado (Admin)
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);

// 6. Cancelar pedido
router.delete('/:id', verifyToken, isAdmin, orderController.cancelOrder);

module.exports = router;