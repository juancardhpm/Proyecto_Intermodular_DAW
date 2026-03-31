const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CartDetails = sequelize.define('detalles_carrito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  carrito_id: { // Antes era cart_id
    type: DataTypes.INTEGER,
    allowNull: false
  },
  producto_id: { // Antes era product_id
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'detalles_carrito',
  timestamps: false
});

const Product = require('./Product'); // Ajusta la ruta a tu modelo de Producto

CartDetails.belongsTo(Product, { foreignKey: 'producto_id' });

module.exports = CartDetails;