// Creo el modulo de pago de los productos

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    fecha_pago: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    cantidad_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    metodo_pago: {
        type: DataTypes.ENUM('Tarjeta', 'PaypPal', 'Transferencia'),
        allowNull: false
    },
    estado_pago: {
        type: DataTypes.ENUM('Pendiente', 'Completo', 'Fallido'),
        allowNull: false,
        defaultValue: 'Pendiente'
    }
}, {
    tableName: 'pagos',
    timestamps: false
});

module.exports = Payment;
