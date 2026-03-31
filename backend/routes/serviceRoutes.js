const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware'); 

// Ruta para enviar una nueva petición
router.post('/', verifyToken, serviceController.createServiceRequest);

// Ruta para ver el historial de peticiones de un usuario
router.get('/user/:usuario_id', verifyToken, serviceController.getUserServiceRequests);

// Ruta para que el admin vea todo
router.get('/admin/all', verifyToken, serviceController.getAllServiceRequests);

// --- AÑADE ESTA LÍNEA QUE ES LA QUE FALTA ---
router.put('/:id/status', verifyToken, serviceController.updateServiceStatus);

module.exports = router;