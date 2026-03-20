// Aqui lo que hago es el modelo de las categorias
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: DataTypes.TEXT
}, {
    tableName: 'categorias', // Asegúrate de que sea el nombre real en tu BD
    timestamps: false
});

module.exports = Category;