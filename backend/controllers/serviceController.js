const ServiceRequest = require('../models/ServiceRequest');

// Crear una nueva solicitud de servicio
exports.createServiceRequest = async (req, res) => {
    try {
        const { usuario_id, asunto, mensaje } = req.body;

        // Validación simple
        if (!asunto || !mensaje) {
            return res.status(400).json({ message: "El asunto y el mensaje son obligatorios." });
        }

        const nuevaSolicitud = await ServiceRequest.create({
            usuario_id,
            asunto,
            mensaje
            // El estado 'abierto' y la fecha se ponen solos por tu modelo
        });

        res.status(201).json({
            message: "¡Solicitud enviada con éxito!",
            solicitud: nuevaSolicitud
        });
    } catch (error) {
        console.error("Error en createServiceRequest:", error);
        res.status(500).json({ message: "Error al procesar la solicitud", error: error.message });
    }
};

// Obtener todas las solicitudes de un usuario concreto
exports.getUserServiceRequests = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const solicitudes = await ServiceRequest.findAll({
            where: { usuario_id },
            order: [['fecha_creacion', 'DESC']] // De más reciente a más antigua
        });
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tus solicitudes", error: error.message });
    }
};

// Obtener TODAS las solicitudes (Para el Admin)
exports.getAllServiceRequests = async (req, res) => {
    try {
        const solicitudes = await ServiceRequest.findAll({
            order: [['fecha_creacion', 'DESC']],
            // Opcional: Incluir el nombre del usuario si tienes la relación hecha
            // include: [{ model: User, attributes: ['nombre', 'email'] }] 
        });
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener todas las solicitudes", error: error.message });
    }
};

// Actualizar el estado de una solicitud (Solo para Admin)
exports.updateServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoEstado, respuestaAdmin } = req.body;

        const solicitud = await ServiceRequest.findByPk(id);
        
        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        // Actualizamos los campos
        solicitud.estado = nuevoEstado;
        solicitud.respuesta_admin = respuestaAdmin; // Se guardará el texto que escribas

        await solicitud.save();

        res.status(200).json({ 
            message: "Solicitud actualizada correctamente", 
            solicitud 
        });
    } catch (error) {
        console.error("Error en updateServiceStatus:", error);
        res.status(500).json({ message: "Error al actualizar", error: error.message });
    }
};