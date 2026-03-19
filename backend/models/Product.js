// Creamos el archivo de los productos

module.exports = (sequelize, DataTypes)  => {
    const Product = sequelize.define('Product', {
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

    return Product;
};