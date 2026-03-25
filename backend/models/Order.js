// Creamos el archivo con las ordenes de la tabla pedidos

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Ponemos en nombre de la tabla de la bbdd
const Order = sequelize.define('pedidos', {
   id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    direccion_envio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado'),
        defaultValue: 'Pendiente'
    }
}, {
    tableName: 'pedidos',
    timestamps: false
});

module.exports = Order;
