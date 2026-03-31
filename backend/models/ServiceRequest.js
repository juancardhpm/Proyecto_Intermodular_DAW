
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


// Ponemos en nombre de la tabla de la bbdd
const ServiceRequest =  sequelize.define('solicitud_servicio', {
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
    respuesta_admin: {
        type: DataTypes.TEXT,
        allowNull: true // Se queda en NULL hasta que el admin responda
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