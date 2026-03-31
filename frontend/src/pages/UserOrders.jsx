import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // Este enlace lo añado en caso de que se utilice un servidor propio para las imagenes
    const API_URL = 'http://localhost:5000'; 

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) { setLoading(false); return; }
            try {
                const res = await api.get(`/orders/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Error al obtener pedidos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user?.id, token]);

    if (loading) return <div style={styles.loading}>Cargando historial...</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📦 MIS <span style={styles.accent}>PEDIDOS</span></h2>
            
            {orders.length === 0 ? (
                <div style={styles.empty}>Aún no has realizado ninguna compra.</div>
            ) : (
                orders.map((order) => {
                    // Sequelize usa el nombre del modelo o de la tabla. 
                    // Probamos las dos variantes más comunes según tus modelos:
                    const detalles = order.detalles_pedidos || order.OrderDetails || [];

                    return (
                        <div key={order.id} style={styles.orderCard}>
                            <div style={styles.orderHeader}>
                                <div>
                                    <span style={styles.orderId}>PEDIDO #{order.id}</span>
                                    <p style={styles.orderDate}>{new Date(order.fecha_pedido).toLocaleDateString()}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        backgroundColor: order.estado === 'Entregado' ? '#10b981' : '#f59e0b'
                                    }}>
                                        {order.estado.toUpperCase()}
                                    </span>
                                    <p style={styles.orderTotal}>{parseFloat(order.total).toFixed(2)}€</p>
                                </div>
                            </div>

                            <div style={styles.detailsList}>
                                {detalles.map((item, index) => {
                                    // AQUÍ ESTÁ LA CLAVE: 
                                    // Sequelize anida el producto dentro de la propiedad "producto" o "Product"
                                    const productoInfo = item.producto || item.Product || {};
                                    const imagenRuta = productoInfo.imagen_url;

                                    // Construimos la URL igual que en el catálogo
                                    let urlFinal = "";
                                    if (imagenRuta) {
                                        urlFinal = imagenRuta.startsWith('http') 
                                            ? imagenRuta 
                                            : `${API_URL}${imagenRuta}`;
                                    }

                                    return (
                                        <div key={index} style={styles.productRow}>
                                            <div style={styles.productInfo}>
                                                <div style={styles.imgContainer}>
                                                    {urlFinal ? (
                                                        <img 
                                                            src={urlFinal} 
                                                            alt={productoInfo.nombre} 
                                                            style={styles.miniImg} 
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div style={{fontSize: '10px', color: '#444'}}>N/A</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p style={styles.prodName}>{productoInfo.nombre || "Cargando..."}</p>
                                                    <p style={styles.prodMeta}>Cantidad: {item.cantidad}</p>
                                                </div>
                                            </div>
                                            <span style={styles.prodPrice}>
                                                {(parseFloat(item.precio_unitario) * item.cantidad).toFixed(2)}€
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

const styles = {
    container: { padding: '40px 20px', maxWidth: '850px', margin: '0 auto', color: '#fff', fontFamily: 'sans-serif' },
    title: { fontWeight: '800', fontSize: '2rem', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '10px' },
    accent: { color: '#a855f7' },
    loading: { textAlign: 'center', padding: '100px', color: '#888' },
    empty: { textAlign: 'center', padding: '50px', backgroundColor: '#15151a', borderRadius: '10px' },
    orderCard: { backgroundColor: '#15151a', borderRadius: '12px', border: '1px solid #2d2d35', marginBottom: '25px', overflow: 'hidden' },
    orderHeader: { backgroundColor: '#1c1c24', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2d2d35' },
    orderId: { color: '#a855f7', fontWeight: 'bold' },
    orderDate: { margin: '0', fontSize: '0.85rem', color: '#71717a' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', color: '#fff' },
    orderTotal: { margin: '5px 0 0 0', fontSize: '1.1rem', fontWeight: '800' },
    detailsList: { padding: '10px 25px' },
    productRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #222' },
    productInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
    imgContainer: { width: '50px', height: '50px', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    miniImg: { width: '100%', height: '100%', objectFit: 'contain' },
    prodName: { margin: 0, fontWeight: 'bold', fontSize: '0.95rem' },
    prodMeta: { margin: 0, fontSize: '0.8rem', color: '#71717a' },
    prodPrice: { fontWeight: 'bold', color: '#a855f7' }
};

export default UserOrders;