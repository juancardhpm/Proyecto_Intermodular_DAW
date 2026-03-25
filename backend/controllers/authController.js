const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Importamos el modelo User desde el index de modelos

/**
 * CONTROLADOR DE REGISTRO
 * Se encarga de validar, encriptar y guardar nuevos usuarios.
 */
exports.register = async (req, res) => {
  try {
    const { nombre, apellidos, email, direccion, telefono, password, rol } = req.body;

    // 1. VALIDACIÓN: Comprobamos si el email ya existe para evitar duplicados en la BD
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // 2. SEGURIDAD: Encriptamos la contraseña antes de guardarla (10 rondas de salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. PERSISTENCIA: Creamos el usuario con la contraseña cifrada
    // Si no se especifica un rol en el body, se asigna 'cliente' por defecto
    const newUser = await User.create({ 
      nombre, 
      apellidos,
      email, 
      direccion,
      telefono,
      password: hashedPassword,
      rol: rol || 'cliente' 
    });

    // 4. RESPUESTA: Enviamos éxito (201 Created)
    res.status(201).json({ 
      message: 'Usuario registrado con éxito', 
      usuarioId: newUser.id 
    });

  } catch (error) {
    // Error de servidor (500)
    res.status(500).json({ 
      message: 'Error al registrar el usuario', 
      error: error.message 
    });
  }
};

/**
 * CONTROLADOR DE LOGIN
 * Verifica credenciales y genera el token JWT para el acceso a rutas protegidas.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. BÚSQUEDA: Intentamos encontrar al usuario por su email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // 2. VERIFICACIÓN: Comparamos la password del login con el hash de la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // 3. GENERACIÓN DE TOKEN: Creamos el "pase" firmado con los datos del usuario
    // IMPORTANTE: Incluimos el 'rol' para que el adminMiddleware pueda leerlo después
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        rol: user.rol // Clave para el Control de Acceso basado en Roles (RBAC)
      }, 
      process.env.JWT_SECRET || 'clave_secreta_tfg', // Clave de cifrado
      { expiresIn: '4h' } // El token caducará en 4 horas por seguridad
    );

    // 4. RESPUESTA: Enviamos el token al frontend para que lo guarde
    res.status(200).json({ 
      message: 'Inicio de sesión exitoso',
      token,
      user: { 
        id: user.id, 
        nombre: user.nombre, 
        rol: user.rol 
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
    console.error("--- ERROR DETALLADO ---");
    console.error(error); // Esto imprimirá el error real de SQL en la terminal
    res.status(500).json({ 
      message: 'Error al registrar', 
      error: error.message,
      sqlError: error.parent?.sqlMessage // Esto te dirá qué columna falta
    });
  }
};