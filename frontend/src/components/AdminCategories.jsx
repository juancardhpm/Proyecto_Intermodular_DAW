import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AdminCategories = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState(''); // Maneja el input
    const [mensaje, setMensaje] = useState('');
    const [editando, setEditando] = useState(false); // Estado para saber si estamos editando
    const [idEditar, setIdEditar] = useState(null); // Guarda el ID de la categoría a modificar

    const cargarCategorias = useCallback(async () => {
        try {
            const res = await api.get('/category');
            setCategorias(res.data);
        } catch (error) {
            console.error("Error al cargar categorías", error);
        }
    }, []);

    useEffect(() => {
        cargarCategorias();
    }, [cargarCategorias]);

    // Función para preparar el formulario para editar
    const seleccionarParaEditar = (cat) => {
        setEditando(true);
        setIdEditar(cat.id);
        setNombreCategoria(cat.nombre);
        setMensaje(''); 
    };

    // Función para resetear el formulario
    const cancelarEdicion = () => {
        setEditando(false);
        setIdEditar(null);
        setNombreCategoria('');
        setMensaje('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (editando) {
                // Lógica para ACTUALIZAR
                await api.put(`/category/${idEditar}`, { nombre: nombreCategoria }, { headers });
                setMensaje('Categoría actualizada con éxito');
            } else {
                // Lógica para CREAR
                await api.post('/category', { nombre: nombreCategoria }, { headers });
                setMensaje('Categoría creada con éxito');
            }

            setNombreCategoria('');
            setEditando(false);
            setIdEditar(null);
            cargarCategorias(); 
        } catch (error) {
            setMensaje('Error al guardar la categoría');
            console.error(error);
        }
    };

    const eliminarCategoria = async (id) => {
        if (!window.confirm('¿Eliminar categoría? Los productos asociados podrían dar error.')) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/category/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMensaje('Categoría eliminada');
            cargarCategorias();
        } catch (error) {
            alert("No se puede eliminar: comprueba si tiene productos asociados.");
            console.error(error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Gestión de Categorías</h2>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <input 
                    name="nombre" 
                    placeholder="Nombre de la categoría" 
                    value={nombreCategoria} 
                    onChange={(e) => setNombreCategoria(e.target.value)} 
                    required 
                    style={styles.input} 
                />
                <button type="submit" style={editando ? styles.editBtn : styles.addBtn}>
                    {editando ? 'Actualizar' : 'Añadir'}
                </button>
                {editando && (
                    <button type="button" onClick={cancelarEdicion} style={styles.cancelBtn}>
                        Cancelar
                    </button>
                )}
            </form>

            {mensaje && <p style={{ color: '#10b981' }}>{mensaje}</p>}

            <ul style={styles.list}>
                {categorias.map((cat) => (
                    <li key={cat.id} style={styles.listItem}>
                        <span>{cat.nombre} <small style={styles.idText}>(ID: {cat.id})</small></span>
                        <div>
                            <button onClick={() => seleccionarParaEditar(cat)} style={styles.editBtnSmall}>Editar</button>
                            <button onClick={() => eliminarCategoria(cat.id)} style={styles.deleteBtn}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: { padding: '20px', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh' },
    title: { fontSize: '2.2rem', marginBottom: '20px', textAlign: 'center', color: '#fff' },
    form: { display: 'flex', gap: '10px', marginBottom: '20px' },
    input: { 
        padding: '8px', 
        borderRadius: '4px', 
        border: '1px solid #444', 
        backgroundColor: '#333', 
        color: 'white', 
        flex: 1 
    },
    addBtn: { 
        backgroundColor: '#8b5cf6', 
        color: 'white', 
        padding: '10px 20px', 
        cursor: 'pointer', 
        border: 'none', 
        borderRadius: '5px' 
    },
    editBtn: { 
        backgroundColor: '#3b82f6', 
        color: 'white', 
        padding: '10px 20px', 
        cursor: 'pointer', 
        border: 'none', 
        borderRadius: '5px' 
    },
    cancelBtn: { 
        backgroundColor: '#444', 
        color: 'white', 
        padding: '10px 20px', 
        cursor: 'pointer', 
        border: 'none', 
        borderRadius: '5px' 
    },
    editBtnSmall: { 
        backgroundColor: '#3b82f6', 
        color: 'white', 
        padding: '5px 10px', 
        cursor: 'pointer', 
        border: 'none', 
        borderRadius: '3px', 
        marginRight: '5px' 
    },
    deleteBtn: { 
        backgroundColor: '#ef4444', 
        color: 'white', 
        padding: '5px 10px', 
        cursor: 'pointer', 
        border: 'none', 
        borderRadius: '3px' 
    },
    listItem: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px', 
        borderBottom: '1px solid #333', 
        background: '#222', 
        marginBottom: '5px', 
        borderRadius: '4px' 
    },
    list: { listStyle: 'none', padding: 0 },
    idText: { color: '#666' }
};

export default AdminCategories;