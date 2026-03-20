const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * RUTAS DE PEDIDOS (API: /api/orders)
 */

// 1. Checkout (POST /api/orders/checkout)
router.post('/checkout', authMiddleware, orderController.createOrder); 

// 2. Pedidos de un usuario
router.get('/user/:usuario_id', authMiddleware, orderController.getUserOrders);

// 3. Detalles de un pedido
router.get('/:id',authMiddleware, orderController.getOrderById);

// 4. Todos los pedidos (Admin)
router.get('/', authMiddleware,  orderController.getAllOrders);

// 5. Actualizar estado (Admin)
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);

// 6. Cancelar pedido
router.delete('/:id', authMiddleware, orderController.cancelOrder);

module.exports = router;