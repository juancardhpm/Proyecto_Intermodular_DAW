const Cart = require('../models/Cart');
const CartDetails = require('../models/CartDetails');
const Product = require('../models/Product');

// Añadir al carrito con validación de stock
exports.addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    // 1. Verificar stock actual del producto
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // 2. Buscar o crear el carrito activo
    const [cart] = await Cart.findOrCreate({ 
      where: { usuario_id: user_id, estado: 'activo' } 
    });

    // 3. Verificar si el producto ya está en el carrito para sumar cantidades
    const existingItem = await CartDetails.findOne({
      where: { carrito_id: cart.id, producto_id: product_id }
    });

    const cantidadNueva = existingItem 
      ? existingItem.cantidad + parseInt(quantity) 
      : parseInt(quantity);

    // --- MEJORA: VALIDACIÓN DE STOCK ---
    if (cantidadNueva > product.stock) {
      return res.status(400).json({ 
        message: `Stock insuficiente. Solo quedan ${product.stock} unidades en total.` 
      });
    }

    if (existingItem) {
      existingItem.cantidad = cantidadNueva;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    // 4. Crear nuevo detalle
    const newItem = await CartDetails.create({
      carrito_id: cart.id,
      producto_id: product_id,
      cantidad: quantity
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error en addToCart:", error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    const cart = await Cart.findOne({ 
      where: { usuario_id: user_id, estado: 'activo' } 
    });
    
    if (!cart) return res.status(200).json([]);

    const items = await CartDetails.findAll({ 
        where: { carrito_id: cart.id },
        include: [{ model: Product }] 
    });

    res.status(200).json(items);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
  }
};

// --- MEJORA: ACTUALIZAR CON VALIDACIÓN DE STOCK ---
exports.updateCart = async (req, res) => {
  const { carrito_id, producto_id, cantidad } = req.body; 

  try {
    // Buscamos el producto para comparar la nueva cantidad con su stock real
    const product = await Product.findByPk(producto_id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (cantidad > product.stock) {
      return res.status(400).json({ 
        message: `No puedes añadir más. Stock disponible: ${product.stock}` 
      });
    }

    const cartItem = await CartDetails.findOne({
      where: { carrito_id, producto_id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cartItem.cantidad = cantidad; 
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: 'Error al actualizar el carrito' });
  }
};

exports.removeFromCart = async (req, res) => {
  console.log("Body recibido en DELETE:", req.body);
  const { carrito_id, producto_id } = req.body;

  try {
    if (!carrito_id || !producto_id) {
      return res.status(400).json({ message: 'Faltan IDs para eliminar' });
    }

    const deleted = await CartDetails.destroy({
      where: { carrito_id, producto_id },
    });

    if (deleted === 0) {
        return res.status(404).json({ message: 'No se encontró el registro' });
    }

    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ message: 'Error interno' });
  }
};