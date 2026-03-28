const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');


// Estas rutas coinciden con lo que pusimos en React
router.get('/', categoryController.getAll);
router.post('/', verifyToken, isAdmin, categoryController.create);
router.delete('/:id', verifyToken, isAdmin, categoryController.delete);
router.put('/:id', verifyToken, isAdmin, categoryController.update);

module.exports = router;