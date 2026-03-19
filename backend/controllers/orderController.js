const { Order, OrderDetail, Product, Payment, sequelize } = require('../models');

exports.processCheckout = async (req, res) => {
    // Aqui inicio la transiccion de todo o nada.
    const t = await sequelize.transaction();

    try {
        // Aqui lo que hacemos es recibir los datos del frontend
        const { usuario_id, direccion_envio, metodo_pago, productos } = req.body

        // Lo primero que hacemos, es calcular el total real y verificamos stock
        let totalPedido = 0;
        for (const item of productos) {
            const prod = await Product.findByPk(item.producto_id);
            if(!prod || prod.stock < item.cantidad) {
                throw new Error(`stock insuficiente para el producto: ${prod ? prod.nombre : 'ID' + item.producto_id}`); //Si el producto existe, saco su nombre. Si no existe, saco el IDdel producto
            }
            totalPedido += item.cantidad * prod.precio;
        }

        // Lo segundo que hacemos, es crear el registro en la tabla 'pedidos'
        const nuevoPedido = await Order.create({
            usuario_id,
            direccion_envio,
            total: totalPedido,
            estado: 'Pendiente'
        }, {transaction: t });

        // Lo tercero, es crear los registros en 'detalles_pedido' y restamos stock
        for (const item of productos){
            const prod = await Product.findByPk(item.producto_id);

            await OrderDetail.create({
                pedido_id: nuevoPedido.id,
                producto_id: item.producto_id,
                cantidad: item.cantidad,
                precio_unitario: prod.precio
            }, { transaction: t });

            // Y aqui restamos el stock en la tabla 'productos'
            await Product.decrement('stoc', {
                by: item.cantidad,
                where: { id: item.producto_id },
                transaction: t
            });
        }

        // Por cuarto, creamos el registro en la tabla 'pagos'
        await Payment.create({
            pedido_id: nuevoPedido.id,
            // cantidad_total: totalPedido, //Nombre exacto de la columna de SQL
            metodo_pago: metodo_pago,  //EMUN: ' Tarjeta', Paypal....
            estado_pago: 'Completado' //EMUN: 'Pendiente', completado,...
        }, { transaction: t });
        
        // Si todo esta bien, confirmamos la transaccion
        await t.commit();

        res.status(201).json({
            message: "¡Pedido y pago realizado con existo!",
            pedido_id: nuevoPedido.id
        });

    } catch (error) {
        // Si algo falla en cualquiera de los pasos anteriores, se deshace todo lo anterior.
        await t.rollback();
        res.status(500).json({
            message: "Error al procesar la compra. No se ha realizado ningun cargo en tu medio de pago",
            error: message.error
        });
    }
};