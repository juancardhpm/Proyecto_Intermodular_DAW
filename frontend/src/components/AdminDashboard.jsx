import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
    const [tab, setTab] = useState('pedidos');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [textoRespuesta, setTextoRespuesta] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        fetchData();
    }, [tab]);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const endpoint = tab === 'pedidos' ? '/orders/admin/all' : '/services/admin/all';
        
        try {
            const res = await api.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error("Error al cargar datos:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGestionarSoporte = async (id, estado) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/services/${id}/status`, { 
                nuevoEstado: estado,
                respuestaAdmin: textoRespuesta 
            }, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            alert(`Solicitud #${id} actualizada con éxito`);
            setSelectedItem(null); 
            setTextoRespuesta(''); 
            fetchData(); 
        } catch (err) {
            console.error("Error al procesar la respuesta:", err);
            alert("Error al procesar la respuesta");
            setMensaje(err.message); 
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>PANEL DE CONTROL <span style={styles.accent}>ADMIN</span></h2>
            
            <div style={styles.tabContainer}>
                <button 
                    style={tab === 'pedidos' ? styles.activeTab : styles.tab} 
                    onClick={() => setTab('pedidos')}
                >🛒 VER PEDIDOS</button>
                <button 
                    style={tab === 'soporte' ? styles.activeTab : styles.tab} 
                    onClick={() => setTab('soporte')}
                >🛠️ VER SOPORTE</button>
            </div>

            <div style={styles.tableCard}>
                {loading ? <p>Cargando información...</p> : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.headerTr}>
                                <th>ID</th>
                                <th>{tab === 'pedidos' ? 'ID Usuario' : 'Asunto'}</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id} style={styles.tr}>
                                    <td>#{item.id}</td>
                                    <td>{tab === 'pedidos' ? `User: ${item.usuario_id}` : item.asunto}</td>
                                    <td>
                                        <span style={{
                                            ...styles.badge,
                                            backgroundColor: 
                                                item.estado === 'abierto' ? '#ef4444' : 
                                                item.estado === 'respondido' ? '#3b82f6' : '#10b981'
                                        }}>
                                            {item.estado}
                                        </span>
                                    </td>
                                    <td>{new Date(item.fecha_pedido || item.fecha_creacion).toLocaleDateString()}</td>
                                    <td>
                                        <button 
                                            style={styles.btnVer} 
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setTextoRespuesta(item.respuesta_admin || ''); 
                                            }}
                                        >👁️ Ver Detalle</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedItem && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{color: '#ff4d4d'}}>DETALLES DEL REGISTRO #{selectedItem.id}</h3>
                        <hr style={{borderColor: '#333'}} />
                        
                        <div style={styles.infoGrid}>
                            <p><strong>Usuario ID:</strong> {selectedItem.usuario_id}</p>
                            <p><strong>Fecha:</strong> {new Date(selectedItem.fecha_pedido || selectedItem.fecha_creacion).toLocaleString()}</p>
                        </div>

                        {tab === 'soporte' ? (
                            <>
                                <p><strong>Asunto:</strong> {selectedItem.asunto}</p>
                                <div style={styles.msgBox}>
                                    <strong>Mensaje del Cliente:</strong>
                                    <p style={{marginTop: '5px', fontStyle: 'italic'}}>{selectedItem.mensaje}</p>
                                </div>

                                {selectedItem.respuesta_admin && (
                                    <div style={{...styles.msgBox, borderLeftColor: '#3b82f6', backgroundColor: '#0b0b0d'}}>
                                        <strong style={{color: '#3b82f6'}}>Respuesta Guardada:</strong>
                                        <p style={{marginTop: '5px'}}>{selectedItem.respuesta_admin}</p>
                                    </div>
                                )}

                                <label style={styles.label}>
                                    {selectedItem.respuesta_admin ? 'Modificar Respuesta:' : 'Escribir Respuesta:'}
                                </label>
                                <textarea 
                                    style={styles.textarea}
                                    placeholder="Escribe aquí la solución para el cliente..."
                                    value={textoRespuesta}
                                    onChange={(e) => setTextoRespuesta(e.target.value)}
                                />

                                <div style={styles.modalActions}>
                                    <button 
                                        style={{...styles.btnAction, backgroundColor: '#3b82f6'}}
                                        onClick={() => handleGestionarSoporte(selectedItem.id, 'respondido')}
                                    >
                                        {selectedItem.respuesta_admin ? '📩 Actualizar Respuesta' : '📩 Enviar Respuesta'}
                                    </button>
                                    <button 
                                        style={{...styles.btnAction, backgroundColor: '#10b981'}}
                                        onClick={() => handleGestionarSoporte(selectedItem.id, 'cerrado')}
                                    >🔒 Cerrar Ticket</button>
                                </div>
                            </>
                        ) : (
                            <div style={styles.msgBox}>
                                <p><strong>Total del Pedido:</strong> {selectedItem.total}€</p>
                                <p><strong>Estado Actual:</strong> {selectedItem.estado}</p>
                            </div>
                        )}

                        <button style={styles.btnCerrarModal} onClick={() => setSelectedItem(null)}>VOLVER AL PANEL</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '40px', backgroundColor: '#0b0b0d', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
    title: { textAlign: 'center', marginBottom: '30px' },
    accent: { color: '#ff4d4d', fontWeight: 'bold' },
    tabContainer: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' },
    tab: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#1a1a21', color: '#fff', border: '1px solid #333', borderRadius: '4px' },
    activeTab: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', fontWeight: 'bold', borderRadius: '4px' },
    tableCard: { backgroundColor: '#1a1a21', padding: '20px', borderRadius: '8px', border: '1px solid #333' },
    table: { width: '100%', borderCollapse: 'collapse' },
    headerTr: { borderBottom: '2px solid #ff4d4d', textAlign: 'left', height: '40px', color: '#ff4d4d' },
    tr: { borderBottom: '1px solid #333', height: '50px' },
    badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: 'white', textTransform: 'uppercase' },
    btnVer: { backgroundColor: '#444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#1a1a21', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '600px', border: '1px solid #ff4d4d', boxShadow: '0 0 20px rgba(255,77,77,0.2)' },
    infoGrid: { display: 'flex', justifyContent: 'space-between', margin: '15px 0' },
    msgBox: { backgroundColor: '#0b0b0d', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ff4d4d', margin: '15px 0' },
    label: { display: 'block', marginTop: '20px', fontWeight: 'bold', color: '#ff4d4d' },
    textarea: { width: '100%', height: '120px', backgroundColor: '#0b0b0d', color: '#fff', border: '1px solid #333', borderRadius: '4px', padding: '10px', marginTop: '10px', resize: 'none' },
    modalActions: { display: 'flex', gap: '10px', marginTop: '20px' },
    btnAction: { flex: 1, padding: '12px', border: 'none', borderRadius: '4px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
    btnCerrarModal: { width: '100%', marginTop: '20px', padding: '10px', backgroundColor: 'transparent', color: '#666', border: '1px solid #333', cursor: 'pointer', borderRadius: '4px' }
};

export default AdminDashboard;