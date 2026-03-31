const { Order, OrderDetail, Product, Payment, sequelize } = require('../models');

exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { usuario_id, direccion_envio, metodo_pago, items, total, detalles_pago } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío." });
        }

        // --- VALIDACIÓN DE DATOS DE PAGO SEGÚN MÉTODO ---
        if (metodo_pago === 'Tarjeta') {
            if (!detalles_pago.numeroTarjeta || !detalles_pago.cvv) {
                throw new Error("Datos de tarjeta incompletos.");
            }
        } else if (metodo_pago === 'PayPal') {
            if (!detalles_pago.correoPaypal || !detalles_pago.passPaypal) {
                throw new Error("Credenciales de PayPal incompletas.");
            }
        } else if (metodo_pago === 'Transferencia') {
            if (!detalles_pago.numeroCuenta) {
                throw new Error("Número de cuenta IBAN requerido.");
            }
        }

        // A. Crear el Pedido
        const nuevoPedido = await Order.create({
            usuario_id,
            direccion_envio,
            total: total,
            estado: 'Pendiente'
        }, { transaction: t });

        // B. Stock y Detalles
        for (const item of items) {
            const prod = await Product.findByPk(item.producto_id);

            if (!prod || prod.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para: ${prod ? prod.nombre : 'ID ' + item.producto_id}`);
            }

            await OrderDetail.create({
                pedido_id: nuevoPedido.id,
                producto_id: item.producto_id,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario
            }, { transaction: t });

            await Product.decrement('stock', {
                by: item.cantidad,
                where: { id: item.producto_id },
                transaction: t
            });
        }

        // C. Registrar el Pago
        await Payment.create({
            pedido_id: nuevoPedido.id,
            cantidad_total: total,
            metodo_pago: metodo_pago,
            estado_pago: 'Completado'
        }, { transaction: t });
        
        await t.commit();

        res.status(201).json({
            message: "¡Pedido verificado y realizado con éxito!",
            pedido_id: nuevoPedido.id
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error("Error en createOrder:", error);
        res.status(400).json({
            message: "Error al procesar la compra.",
            error: error.message
        });
    }
};

// 2. Obtener pedidos por usuario
exports.getUserOrders = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        
        const orders = await Order.findAll({ 
            where: { usuario_id },
            // Incluir detalles y el producto para tener el nombre y la imagen
            include: [
                {
                    model: OrderDetail,
                    include: [{ model: Product }] // Esto trae los datos de la tabla 'productos'
                }
            ],
            order: [['fecha_pedido', 'DESC']] // Los más recientes primero
        });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
    }
};

// 3. Obtener pedido por ID
exports.getOrderById = async (req, res) => {
    try {
        const pedido = await Order.findByPk(req.params.id, { include: [OrderDetail] });
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// 4. Listar todos los pedidos (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const pedidos = await Order.findAll({
            // Usamos la columna real de tu BBDD para ordenar
            order: [['fecha_pedido', 'DESC']] 
        });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
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