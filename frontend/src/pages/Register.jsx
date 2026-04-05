import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

// Defino el componente funcional de React
const Register = () => {
    // Guardo aqui todos los datos del formulario que vamos a lanzar para el registro del nuevo usuario guardando todos los imput en un estado
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        direccion: '',
        telefono: '',
        password: '',
        confirmPassword: ''
    });
    // Ponemos otro estados de Error y de Carga por si hay una peticion en curso
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // Cambiamos a otra pagina sin recargar
    const navigate = useNavigate();

    // Importante con esto, ya que con un handle solo permitimos usar la fucnion una sola vez para todos los imput
    // e --> Es el evento del input
    // e.target --> Es el input que disparo el evento 
    // e.target.name --> Es el atributo name del input 
    // e.target.value --> Es lo que escribe el usuario 
    // ...formData --> Copia todos los valores anteriores 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Funcion que se ejecuta al enviar el formulario
    // e.preventDefault --> sin esto el navegador recarga la pagna y se pierde el estado 
    // setError('') --> Con esto reseteamos el error 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Comprobacion de validacion del email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formData.email)){
            return setError('Por favor, introduce un email valido (ejemplo@dominio.com');
        }

        // Aqui lo que hago es la validacion basica de la contraseña, para ver si coinciden
        if (formData.password !== formData.confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        // Marco aqui que empieza la peticion al back
        setLoading(true);
        try{
            // Hago la peticion al back con todos los datos del usuario escritos en el formulario y que los registre en la base de datos
            await api.post('/auth/register', {
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                email: formData.email,
                direccion: formData.direccion,
                telefono: formData.telefono,
                password: formData.password
            });

            alert('Cuenta creada con exito! Ahora puedes ir a iniciar sesion.');
            navigate('/login');
        } catch(error){
            // 1. Extraemos el mensaje que viene del backend (si existe)
            const mensajeError = error.response?.data?.detalles || error.response?.data?.message || 'Error al registrarse';
            // 2. Lo guardamos en el estado para que el usuario lo vea en el formulario
            setError(mensajeError);
            // 3. Log para que tú lo veas en la consola del navegador (F12)
            console.error("Error completo de Axios:", error.response?.data);
        } finally {
            setLoading(false)
        }
    };

    // Ahora pinto todo en la web con HTML
    return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>NUEVA <span style={styles.accent}>CUENTA</span></h2>
        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            name="apellidos"
            type="text"
            placeholder="Apellidos"
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            name="telefono"
            type="number"
            placeholder="Telefono"
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            name="direccion"
            type="text"
            placeholder="Direccion de domicilio"
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Correo Electrónico"
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Repetir Contraseña"
            style={styles.input}
            onChange={handleChange}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'CREANDO PERFIL...' : 'REGISTRARSE'}
          </button>
        </form>

        <p style={styles.footerText}>
          ¿Ya tienes una cuenta? <Link to="/login" style={styles.link}>Entra aquí</Link>
        </p>
      </div>
    </div>
  );
};

// Simplemente pongo esto de prueba visutal
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0b0d', color: '#fff' },
  card: { backgroundColor: '#15151a', padding: '40px', borderRadius: '15px', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid #2d2d35' },
  title: { fontSize: '2rem', marginBottom: '20px', letterSpacing: '1px' },
  accent: { color: '#a855f7', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', boxSizing: 'border-box' },
  button: { padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#a855f7', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ef4444' },
  footerText: { marginTop: '20px', fontSize: '0.9rem', color: '#71717a' },
  link: { color: '#a855f7', textDecoration: 'none', fontWeight: 'bold' }
};

export default Register;
