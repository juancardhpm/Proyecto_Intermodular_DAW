const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Middlewares de protección
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

/**
 * RUTAS DE PEDIDOS (Prefijo: /api/orders)
 */

// 1. Checkout y Pago (Procesa el pedido, resta stock y registra el pago)
// POST /api/orders/checkout
router.post('/checkout', verifyToken, orderController.createOrder); 

// 2. Obtener historial de pedidos de un usuario específico
// GET /api/orders/user/:usuario_id
router.get('/user/:usuario_id', verifyToken, orderController.getUserOrders);

// 3. Obtener el detalle completo de un pedido por su ID
// GET /api/orders/:id
router.get('/:id', verifyToken, orderController.getOrderById);

// 4. Listar todos los pedidos del sistema (Solo para Administradores)
// GET /api/orders/
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);

// 5. Actualizar el estado de un pedido (Ej: Pendiente -> Enviado)
// PUT /api/orders/:id/status
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);

// 6. Cancelar o eliminar un pedido del sistema
// DELETE /api/orders/:id
router.delete('/:id', verifyToken, isAdmin, orderController.cancelOrder);

// Ruta para ver todos los pedidos de todos los clientes. Solo funcion del admin
router.get('/admin/all', verifyToken, isAdmin, orderController.getAllOrders);

module.exports = router;