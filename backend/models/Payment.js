const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('pagos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // <--- CRITICO: Esto permite que la BBDD gestione el ID
        allowNull: false
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
        // Nota: Asegúrate de que en la BBDD esta columna 
        // permita varios pagos si un pedido falla, o mantenlo unique si es 1 a 1.
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
        // Corregido: Tenías un error de escritura 'PaypPal' con dos 'p' seguidas
        type: DataTypes.ENUM('Tarjeta', 'PayPal', 'Transferencia'), 
        allowNull: false
    },
    estado_pago: {
        // Ajustado para coincidir con lo que enviamos: 'Completado'
        // Si en tu DB es 'Completo', cámbialo aquí o en el controlador.
        type: DataTypes.ENUM('Pendiente', 'Completado', 'Fallido'),
        allowNull: false,
        defaultValue: 'Pendiente'
    }
}, {
    tableName: 'pagos',
    timestamps: false
});

module.exports = Payment;