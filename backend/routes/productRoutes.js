const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');

// Aqui voy añadir publicas para los clientes
router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProductById);

// Aqui añado las rutas protegidas, ya que estas serian solamente para el admin. Mas adelante se añadiran los middleware)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


module.exports = router;