const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cart = sequelize.define('carrito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'completado'),
    defaultValue: 'activo',
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'carrito', 
  timestamps: false     
});

module.exports = Cart;