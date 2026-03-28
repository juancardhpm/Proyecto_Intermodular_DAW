const Category = require('../models/Category');

// Obtener todas las categorías
exports.getAll = async (req, res) => {
    try {
        const categorias = await Category.findAll();
        res.json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener las categorías' });
    }
};

// Crear una nueva categoría
exports.create = async (req, res) => {
    try {
        // req.body debe contener { nombre: "Nombre de la categoria" }
        const nuevaCategoria = await Category.create(req.body);
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: 'Error al crear la categoría. Asegúrate de que el nombre sea único.' });
    }
};

// ACTUALIZAR una categoría existente
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        // Buscamos y actualizamos
        const [rowsUpdated] = await Category.update(
            { nombre }, 
            { where: { id } }
        );

        if (rowsUpdated === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        res.json({ mensaje: 'Categoría actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar la categoría' });
    }
};

// Eliminar una categoría
exports.delete = async (req, res) => {
    try {
        await Category.destroy({ where: { id: req.params.id } });
        res.json({ mensaje: 'Categoría eliminada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar la categoría. Comprueba si hay productos asociados.' });
    }
};