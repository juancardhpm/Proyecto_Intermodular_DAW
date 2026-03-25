// Creamos un modelo intermedio 'CartDetails' para gestionar la relación N:M entre los carritos y los productos.
// Un carrito puede tener muchos productos, y un producto puede estar en muchos carritos diferentes.


// Ponemos en nombre de la tabla de la bbdd
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CartDetails = sequelize.define('detalles_carrito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // El ID de los detalles se incrementa automáticamente
  },
  cart_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Carts',  // Referencia a la tabla 'Carts' donde se almacenan los carritos
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products',  // Referencia a la tabla 'Products' donde se almacenan los productos (aunque aun no hayamos creado el modelo Productos lo dejamos aquí preparado para cuando lo hagamos)
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,  // La cantidad por defecto es 1
  },
});

module.exports = CartDetails;  // Exportamos para poder usarlo en otros archivos