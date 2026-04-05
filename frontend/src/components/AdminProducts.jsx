import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AdminProducts = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [formProducto, setFormProducto] = useState({ 
        id: null, 
        nombre: '', 
        descripcion: '', 
        precio: '', 
        stock: '', 
        imagen_url: '', 
        categoria_id: '' 
    });
    const [editando, setEditando] = useState(false);

    const cargarProductos = useCallback(async () => {
        try {
            const res = await api.get('/products');
            setProductos(res.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const cargarCategorias = useCallback(async () => {
        try {
            const res = await api.get('/category');
            setCategorias(res.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        cargarProductos();
        cargarCategorias();
    }, [cargarProductos, cargarCategorias]);

    const handleChange = (e) => {
        setFormProducto({ ...formProducto, [e.target.name]: e.target.value });
    };

    const limpiarFormulario = () => {
        setFormProducto({ id: null, nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', categoria_id: '' });
        setEditando(false);
    };

    const seleccionarParaEditar = (producto) => {
        setFormProducto({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio,
            stock: producto.stock,
            imagen_url: producto.imagen_url || '',
            categoria_id: producto.categoria_id || ''
        });
        setEditando(true);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (editando) {
                await api.put(`/products/${formProducto.id}`, formProducto, { headers });
                setMensaje('¡Producto actualizado con éxito!');
            } else {
                await api.post('/products', formProducto, { headers });
                setMensaje('¡Producto creado con éxito!');
            }

            limpiarFormulario();
            cargarProductos();
        } catch (error) {
            setMensaje('Error al guardar el producto');
            console.error(error);
        }
    };

    const eliminarProducto = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMensaje('Producto eliminado correctamente');
            cargarProductos();
        } catch (error) {
            setMensaje('Error al eliminar el producto.');
            console.error(error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Panel de Administración de Productos</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <h3>{editando ? `Editar Producto (ID: ${formProducto.id})` : 'Añadir Nuevo Producto'}</h3>
                
                <input name="nombre" placeholder="Nombre" value={formProducto.nombre} onChange={handleChange} required style={styles.input} />
                
                {/* SELECT DINÁMICO DE CATEGORÍAS */}
                <select name="categoria_id" value={formProducto.categoria_id} onChange={handleChange} required style={styles.input}>
                    <option value="">Selecciona una Categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>

                <input name="precio" type="number" step="0.01" placeholder="Precio (€)" value={formProducto.precio} onChange={handleChange} required style={styles.input} />
                <input name="stock" type="number" placeholder="Stock" value={formProducto.stock} onChange={handleChange} required style={styles.input} />
                
                <input name="imagen_url" placeholder="URL de la Imagen (http://...)" value={formProducto.imagen_url} onChange={handleChange} style={styles.input} />
                
                {formProducto.imagen_url && (
                    <img src={formProducto.imagen_url} alt="Preview" style={styles.imgPreview} />
                )}

                <textarea name="descripcion" placeholder="Descripción" value={formProducto.descripcion} onChange={handleChange} style={styles.input} />
                
                <div style={styles.buttonGroup}>
                    <button type="submit" style={styles.addBtn}>
                        {editando ? 'Actualizar Producto' : 'Guardar Producto'}
                    </button>
                    {editando && (
                        <button type="button" onClick={limpiarFormulario} style={styles.cancelBtn}>
                            Cancelar Edición
                        </button>
                    )}
                </div>
            </form>

            {mensaje && <p style={{ color: '#10b981' }}>{mensaje}</p>}

            <table style={styles.table}>
                <thead>
                    <tr style={styles.tableHeader}>
                        <th>Miniatura</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((p) => (
                        <tr key={p.id} style={styles.tableRow}>
                            <td>
                                {p.imagen_url ? (
                                    <img src={p.imagen_url} alt={p.nombre} style={styles.productImg} />
                                ) : 'N/A'}
                            </td>
                            <td>{p.nombre}</td>
                            <td>{p.precio}€</td>
                            <td>{p.stock}</td>
                            <td>
                                <div style={styles.actionBtns}>
                                    <button style={styles.editBtn} onClick={() => seleccionarParaEditar(p)}>Editar</button>
                                    <button style={styles.deleteBtn} onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: { padding: '20px', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh' },
    title: { fontSize: '2.2rem', marginBottom: '20px', textAlign: 'center', color: '#fff' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginBottom: '30px', background: '#222', padding: '15px', borderRadius: '8px', border: '1px solid #333' },
    input: { padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: 'white' },
    addBtn: { backgroundColor: '#8b5cf6', color: 'white', padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '5px' },
    cancelBtn: { backgroundColor: '#444', color: 'white', padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '5px' },
    editBtn: { backgroundColor: '#3b82f6', color: 'white', padding: '5px 10px', cursor: 'pointer', border: 'none', borderRadius: '3px' },
    deleteBtn: { backgroundColor: '#ef4444', color: 'white', padding: '5px 10px', cursor: 'pointer', border: 'none', borderRadius: '3px' },
    table: { width: '100%', marginTop: '20px', textAlign: 'left', borderCollapse: 'collapse' },
    tableHeader: { borderBottom: '2px solid #444' },
    tableRow: { borderBottom: '1px solid #333', height: '60px' },
    productImg: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' },
    actionBtns: { display: 'flex', gap: '5px' },
    imgPreview: { width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', margin: '5px 0' },
    buttonGroup: { display: 'flex', gap: '10px' }
};

export default AdminProducts;