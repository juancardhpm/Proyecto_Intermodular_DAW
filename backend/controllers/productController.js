const { Product, Category } = require('../models');


// Metodos para obtener todos los product
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { activo: 'si' },
            include: [{ model: Category, attributes: ['nombre'] }] //Aqui configuro para que salgan los product existentes
        });
        res.status(200).json(products);
    } catch(error){
        res.status(500).json({ message: "Error al obtener product", error: error.message });
    };
}

// Metodo para obtener un producto por ID 
exports.getProductById = async (req, res) => {
    try {
    // Aqui extraigo el ID del producto
      const { id } = req.params;
    //   Y obtengo la categoria y el nombre del producto
      const producto = await Product.findByPk(id, {
        include: [{ model: Category, attributes: ['nombre'] }]
      });
      
      if(!producto){
        return res.status(404).json({ message: "prodcuto no encontrado" });
      }
      res.status(200).json(producto); //EN caso de encontrar el producto, envio el producto

    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
};


// Metodo para crear un producto, en este caso solo del admin
exports.createProduct = async (req, res) => {
    try {
        // Los datos vienen del cuerpo de la peticion al crear el producto (req.body)
        const nuevoProducto = await Product.create(req.body);
        res.status(201).json({ message: "Producto creado con exito", nuevoProducto })
    } catch (error) {
        res.status(500).json({ message: "Error al crear un producto", error: error.message });
    }
};


// Metodo para actualizar un producto en este caso
exports.updateProduct = async (req, res) => {
    try {
        // Aqui extraigo el ID del producto
        const { id } = req.params

        // Product.update: Busca en la tabla de product y aplica los cambios.
        // req.body: Contiene los nuevos datos que quieres guardar (ej. el nuevo precio o nombre).
        // where: { id }: Es el filtro para asegurar que solo se actualice el producto con ese ID específico.
        // [actualizado]: Sequelize devuelve un array. El primer elemento es un número que indica cuántas filas fueron afectadas. Si es 1, significa que se encontró y actualizó el registro.
        const [actualizado] = await Product.update(req.body, { where: { id }  });

        // Creo un If para verificar si el prodcuto esta actualizado. En caso de que si, consultamos a la BBDD con la clave primaria para obtener el producto ya actualizado y enviarselo al cliente con un codigo 200(ok)
        if(actualizado){
            const productoEditado = await Product.findByPk(id);
            return res.status(200).json({ message: "Producto Actualizado", productoEditado });
        }
        // Si no tuve cambios en el producto actualizado, lazno un error indicando que el producto no fue encontrado
        throw new Error('Producto no encontrado');
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
    }
};


// Metodo para realizar un borrado logico (Cambiar el estado del producto a  'activo' a 'no')
exports.deleteProduct = async (req, res) => {
    try {
        // Igual que antes, obtengo el ID del producto
        const { id } = req.params;
        // Actualizado el estado del producto a "no" activo
        await Product.update({ activo: 'no'}, { where: { id }});
        res.status(200).json({ message:"Producto desactivado (borrado logico) correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al borrar el producto", error: error.message });
    }
};