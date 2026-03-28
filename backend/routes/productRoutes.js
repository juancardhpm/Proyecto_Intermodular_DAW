const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middlewares/authMiddleware'); //Es el que comprueba que estes logeado
const { isAdmin } = require('../middlewares/adminMiddleware') //Es el que compurbea que sea administrador

// Aqui voy añadir publicas para los clientes
router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProductById);

// Aqui añado las rutas protegidas, ya que estas serian solamente para el admin. Mas adelante se añadiran los middleware)
router.post('/', verifyToken, isAdmin ,productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin , productController.deleteProduct);


module.exports = router;