// Creamos los controladores para gestionar las acciones del carrito como añadir, actualizar y eliminar productos.

const Cart = require('../models/Cart');
const CartDetails = require('../models/CartDetails')


// Obtener los productos del carrito
exports.getCartItems = async (req, res) => {
  try {
    const { user_id } = req.query; // O req.params según cómo lo hayas diseñado
    const cart = await Cart.findOne({ where: { user_id, status: 'active' } });
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const items = await CartDetails.findAll({ where: { cart_id: cart.id } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos del carrito', error: error.message });
  }
};


// Añadir producto al carrito
exports.addToCart = async (req, res) => {
  // Recibimos el ID del usuario, el ID del producto y la cantidad
  const { user_id, product_id, quantity } = req.body;

  try {
    // Buscamos o creamos un carrito activo para el usuario
    const cart = await Cart.findOrCreate({ where: { user_id, status: 'active' } });

    // Añadimos el producto al carrito en la tabla de 'CartDetails'
    const cartDetails = await CartDetails.create({
      cart_id: cart.id,
      product_id,
      quantity,
    });

    // Devolvemos el detalle del carrito
    res.status(201).json(cartDetails);
  } catch (error) {
    // Si ocurre un error, devolvemos un mensaje de error
    res.status(500).json({ message: 'Error al añadir producto al carrito' });
  }
};


// Actualizar cantidad de producto en el carrito
exports.updateCart = async (req, res) => {
  const { cart_id, product_id, quantity } = req.body;

  try {
    // Buscamos el producto dentro del carrito
    const cartDetails = await CartDetails.findOne({
      where: { cart_id, product_id },
    });

    // Si no encontramos el producto, devolvemos un error
    if (!cartDetails) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    // Actualizamos la cantidad del producto
    cartDetails.quantity = quantity;
    await cartDetails.save();  // Guardamos el cambio

    // Devolvemos los detalles actualizados del carrito
    res.status(200).json(cartDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito' });
  }
};


// Eliminar producto del carrito
exports.removeFromCart = async (req, res) => {
  const { cart_id, product_id } = req.body;

  try {
    // Eliminamos el producto de la tabla CartDetails
    await CartDetails.destroy({
      where: { cart_id, product_id },
    });

    // Devolvemos un mensaje de éxito
    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto del carrito' });
  }
}; 

