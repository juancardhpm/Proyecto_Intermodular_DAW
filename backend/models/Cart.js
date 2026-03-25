// Creamos el modelo 'Cart' para gestionar los carritos de compra de los usuarios.
// Este modelo tiene un ID único, un campo para identificar al usuario y el estado del carrito (activo, completado, abandonado).

// Ponemos en nombre de la tabla de la bbdd
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cart = sequelize.define('carrito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // El ID del carrito se incrementa automáticamente
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // El carrito debe estar asociado a un usuario
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'abandoned'),  // El carrito puede tener tres estados
    defaultValue: 'active',  // El valor por defecto es 'activo'
  },
});

module.exports = Cart;  // Exportamos el modelo para poder usarlo en otros archivos