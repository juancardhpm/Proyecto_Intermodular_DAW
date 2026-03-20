const { Order, OrderDetail, Product, Payment, sequelize } = require('../models');

// 1. Procesar el Checkout (Crear pedido)
exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { usuario_id, direccion_envio, metodo_pago, productos } = req.body;

        let totalPedido = 0;
        for (const item of productos) {
            const prod = await Product.findByPk(item.producto_id);
            if (!prod || prod.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto: ${prod ? prod.nombre : 'ID ' + item.producto_id}`);
            }
            totalPedido += item.cantidad * prod.precio;
        }

        const nuevoPedido = await Order.create({
            usuario_id,
            direccion_envio,
            total: totalPedido,
            estado: 'Pendiente'
        }, { transaction: t });

        for (const item of productos) {
            const prod = await Product.findByPk(item.producto_id);

            await OrderDetail.create({
                pedido_id: nuevoPedido.id,
                producto_id: item.producto_id,
                cantidad: item.cantidad,
                precio_unitario: prod.precio
            }, { transaction: t });

            // CORREGIDO: 'stock' con K
            await Product.decrement('stock', {
                by: item.cantidad,
                where: { id: item.producto_id },
                transaction: t
            });
        }

        await Payment.create({
            pedido_id: nuevoPedido.id,
            metodo_pago: metodo_pago,
            estado_pago: 'Completado'
        }, { transaction: t });
        
        await t.commit();

        res.status(201).json({
            message: "¡Pedido y pago realizado con éxito!",
            pedido_id: nuevoPedido.id
        });

    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: "Error al procesar la compra.",
            error: error.message // CORREGIDO: error.message
        });
    }
};

// 2. Obtener pedidos por usuario
exports.getUserOrders = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const orders = await Order.findAll({ where: { usuario_id } });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
    }
};

// 3. Obtener pedido por ID
exports.getOrderById = async (req, res) => {
    try {
        const pedido = await Order.findByPk(req.params.id, { include: [{ model: OrderDetail }] });
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// 4. Listar todos los pedidos (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// 5. Actualizar estado
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await Order.update({ estado }, { where: { id } });
        res.status(200).json({ message: "Estado actualizado" });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// 6. Cancelar pedido
exports.cancelOrder = async (req, res) => {
    try {
        await Order.update({ estado: 'Cancelado' }, { where: { id: req.params.id } });
        res.status(200).json({ message: "Pedido cancelado" });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};