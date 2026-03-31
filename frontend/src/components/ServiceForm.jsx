import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ServiceForm = () => {
    const navigate = useNavigate();
    
    // Obtenemos datos de localStorage de forma segura
    const [token] = useState(localStorage.getItem('token'));
    const [user] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        if (token && user) {
            fetchHistorial();
        }
    }, [token, user]);

    const fetchHistorial = async () => {
        try {
            const res = await api.get(`/services/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistorial(res.data);
        } catch (err) {
            console.error("Error al obtener el historial:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!asunto.trim() || !mensaje.trim()) return alert("Por favor, rellena todos los campos.");

        setEnviando(true);
        try {
            await api.post('/services', {
                usuario_id: user.id,
                asunto,
                mensaje
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert("✅ Solicitud enviada correctamente.");
            setAsunto('');
            setMensaje('');
            fetchHistorial();
        } catch (error) {
            alert("❌ Error al enviar la solicitud.");
            setMensaje(error);
        } finally {
            setEnviando(false);
        }
    };

    // Pantalla en caso de no estar logueado
    if (!token || !user) {
        return (
            <div style={styles.container}>
                <div style={styles.formSection}>
                    <h2 style={styles.title}>ACCESO DENEGADO</h2>
                    <p style={{textAlign: 'center'}}>Debes iniciar sesión para solicitar asistencia.</p>
                    <button onClick={() => navigate('/login')} style={styles.btn}>IR AL LOGIN</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.formSection}>
                <h2 style={styles.title}>SOLICITUD DE <span style={styles.accent}>ASISTENCIA</span></h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Asunto:</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Problema con mi pedido"
                            value={asunto} 
                            onChange={(e) => setAsunto(e.target.value)} 
                            style={styles.input} 
                            required 
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mensaje:</label>
                        <textarea 
                            placeholder="Describe detalladamente tu problema..."
                            value={mensaje} 
                            onChange={(e) => setMensaje(e.target.value)} 
                            style={styles.textarea} 
                            required 
                        />
                    </div>
                    <button type="submit" disabled={enviando} style={styles.btn}>
                        {enviando ? 'PROCESANDO...' : 'ENVIAR SOLICITUD'}
                    </button>
                </form>
            </div>

            <div style={styles.historySection}>
                <h3 style={styles.historyTitle}>Mis Peticiones Anteriores</h3>
                {historial.length === 0 ? (
                    <p style={styles.emptyMsg}>Aún no has realizado ninguna consulta.</p>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.headerTr}>
                                    <th>Asunto</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((item) => (
                                    <tr key={item.id} style={styles.tr}>
                                        <td style={styles.td}>{item.asunto}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor: item.estado === 'abierto' ? '#3b82f6' : item.estado === 'respondido' ? '#10b981' : '#ef4444'
                                            }}>
                                                {item.estado.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={styles.td}>{new Date(item.fecha_creacion).toLocaleDateString()}</td>
                                        <td style={styles.td}>
                                            {item.respuesta_admin ? (
                                                <button 
                                                    onClick={() => setSelectedRequest(item)}
                                                    style={styles.btnLeer}
                                                >📖 Leer</button>
                                            ) : <span style={{color: '#666', fontSize: '0.8rem'}}>Esperando...</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL PARA RESPUESTA */}
            {selectedRequest && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{color: '#a855f7', marginTop: 0}}>DETALLE DEL TICKET #{selectedRequest.id}</h3>
                        <div style={styles.msgBoxCliente}>
                            <strong style={{color: '#a855f7'}}>Tu mensaje:</strong>
                            <p style={{marginTop: '5px', fontSize: '0.9rem'}}>{selectedRequest.mensaje}</p>
                        </div>
                        <div style={{...styles.msgBoxCliente, borderLeftColor: '#10b981', backgroundColor: '#050505'}}>
                            <strong style={{color: '#10b981'}}>Respuesta del Soporte:</strong>
                            <p style={{marginTop: '5px', fontSize: '0.9rem'}}>{selectedRequest.respuesta_admin}</p>
                        </div>
                        <button style={styles.btnCerrar} onClick={() => setSelectedRequest(null)}>CERRAR VENTANA</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '40px 20px', backgroundColor: '#0b0b0d', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
    formSection: { maxWidth: '600px', margin: '0 auto 40px auto', backgroundColor: '#1a1a21', padding: '30px', borderRadius: '12px', border: '1px solid #333' },
    title: { textAlign: 'center', marginBottom: '25px', fontSize: '1.5rem', letterSpacing: '1px' },
    accent: { color: '#a855f7' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.9rem', color: '#ccc', fontWeight: 'bold' },
    input: { padding: '12px', backgroundColor: '#0b0b0d', border: '1px solid #333', borderRadius: '6px', color: '#fff', outline: 'none' },
    textarea: { padding: '12px', backgroundColor: '#0b0b0d', border: '1px solid #333', borderRadius: '6px', color: '#fff', minHeight: '120px', resize: 'vertical', outline: 'none' },
    btn: { padding: '14px', backgroundColor: '#a855f7', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
    
    historySection: { maxWidth: '900px', margin: '0 auto' },
    historyTitle: { borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' },
    tableWrapper: { backgroundColor: '#1a1a21', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    headerTr: { backgroundColor: '#25252e', color: '#a855f7' },
    tr: { borderBottom: '1px solid #25252e' },
    td: { padding: '15px', fontSize: '0.9rem' },
    badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' },
    emptyMsg: { textAlign: 'center', color: '#666', marginTop: '20px' },

    btnLeer: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' },
    modalContent: { backgroundColor: '#1a1a21', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px', border: '1px solid #a855f7', boxShadow: '0 0 30px rgba(168,85,247,0.2)' },
    msgBoxCliente: { backgroundColor: '#0b0b0d', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #a855f7', margin: '15px 0' },
    btnCerrar: { width: '100%', padding: '12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }
};

export default ServiceForm;