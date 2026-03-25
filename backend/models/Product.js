
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importamos la conexión directamente


// Ponemos en nombre de la tabla de la bbdd
const Product = sequelize.define('productos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoria_id: DataTypes.INTEGER,
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: DataTypes.TEXT,
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    activo: {
        type: DataTypes.ENUM('si', 'no'),
        defaultValue: 'si'
    },
    imagen_url: DataTypes.STRING
}, {
    tableName: 'productos',
    timestamps: false
});

// Exportamos el objeto directamente, NO una función
module.exports = Product;