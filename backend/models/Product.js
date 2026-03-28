const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('productos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categorias', // Nombre de la tabla de categorías
            key: 'id'
        }
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

module.exports = Product;