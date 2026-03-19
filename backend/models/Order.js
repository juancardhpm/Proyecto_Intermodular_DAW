// Creamos el archivo con las ordenes de la tabla pedidos

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
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

    return Order;
};