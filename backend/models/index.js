// Ahora creamos el archivo index.js que es quien se conectara direcamente con el archivo config/db.js

'use strict'; //Aqui lo que hago es activar el "Modo Estricto" de JS, para evitar errores silenciosos

// Lo primero que hago es importar la misma conexion que se ha creado en el archivo db.js
const { sequelize } = require('../config/db'); //Conexion a la base de datos
const { Sequelize, DataTypes } = require('sequelize'); //Tipo de datos

// Creacion de la constante db
const db = {};

// Ahora lo que hacemso es importas todos los modelos
// Le pasamos la conexion (sequelize) y los tipos de datos (DataTypes)
db.User = require('./User');
db.Category = require('./Category');
db.Product = require('./Product');
db.Order = require('./Order');
db.OrderDetail = require('./OrderDetail');
db.Payment = require('./Payment');
db.Cart = require('./Cart');
db.CartDetails = require('./CartDetails');
db.ServiceRequest = require('./ServiceRequest');


// Ahora creamos la asociaciones con la tablas de la base de datos
//La parte de Productos y categorias
db.Product.belongsTo(db.Category, { foreignKey: 'categoria_id' }); //Un producto pertenece a una categoria,
db.Category.hasMany(db.Product, { foreignKey: 'categoria_id' });  //Y una categoria pertenece a un producto (1:N)

//La parte de Pedidos y Usuarios
db.Order.belongsTo(db.User, { foreignKey: 'usuario_id' });
db.User.hasMany(db.Order, { foreignKey: 'usuario_id' });

//Pedidos y Sus detalles
db.OrderDetail.belongsTo(db.Order, { foreignKey: 'pedido_id' });
db.Order.hasMany(db.OrderDetail, { foreignKey: 'pedido_id' });


//La parte de Detalles de Pedido y Productos
db.OrderDetail.belongsTo(db.Product, {foreignKey: 'producto_id' });
db.Product.hasMany(db.OrderDetail, { foreignKey: 'producto_id' });

// La parte de Pedidos y Pagos
db.Payment.belongsTo(db.Order, { foreignKey: 'pedido_id' }); //Un pago pertenece a un pedido (1:1)
db.Order.hasOne(db.Payment, { foreignKey: 'pedido_id' }); //Un pedido tiene un pago, 

// La parte de Usuarios y Carrito
db.Cart.belongsTo(db.User, { foreignKey: 'usuario_id' });
db.User.hasOne(db.Cart, { foreignKey: 'usuario_id' });

// La parte de Carrito y Detalles Carrito
db.CartDetails.belongsTo(db.Cart, { foreignKey: 'carrito_id' });
db.Cart.hasMany(db.CartDetails, { foreignKey: 'carrito_id' });

// La parte de productos a Detalles de Carrito
db.CartDetails.belongsTo(db.Product, { foreignKey: 'producto_id' });
db.Product.hasMany(db.CartDetails, { foreignKey: 'producto_id' });

// La parte de usuarios a solicitudes de servicio
db.ServiceRequest.belongsTo(db.User, { foreignKey: 'usuario_id' });
db.User.hasMany(db.ServiceRequest, { foreignKey: 'usuario_id' });


// Ahora lo que hacemos es exportar todo.
db.sequelize = sequelize; //Aqui lo que hago es exportar la conexion por si hace falta para Transacciones de validacion
db.Sequelize = Sequelize //Esto lo importo por si necesito tipos de Sequelize en otro lado

module.exports = db;





// Un ejemplo para entender la parte de las relaciones de pertenencia
// 1. La Regla de Oro: ¿Quién tiene la "llave"?
// En tu base de datos SQL, tienes columnas como usuario_id, categoria_id, etc. Esas son las Foreign Keys (Claves Foráneas).

// belongsTo (Pertenece a): Se usa siempre en el modelo que TIENE la columna física en la tabla de SQL.

// Ejemplo: El producto tiene la columna categoria_id. Por eso decimos: Product.belongsTo(Category).

// hasMany (Tiene muchos): Se usa en el modelo que NO TIENE la columna, pero sabemos que está relacionado con muchos del otro lado.

// Ejemplo: La categoría no tiene ninguna columna de productos, pero sabemos que una categoría engloba a muchos productos. Por eso: Category.hasMany(Product).

// hasOne (Tiene uno): Igual que el anterior, pero solo para un objeto.

// Ejemplo: Un Pedido tiene un único Pago. Order.hasOne(Payment).