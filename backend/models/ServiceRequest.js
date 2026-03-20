
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ServiceRequest =  sequelize.define('ServiceRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    asunto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('abierto', 'respondido', 'cerrado'),
        defaultValue: 'abierto'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
        tableName: 'solicitud_servicio',
        timestamps: false
});


module.exports = ServiceRequest;