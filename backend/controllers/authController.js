
// Crea el controlador que maneja las solicitudes de autenticación, como el registro y el inicio de sesión.
// Aquí implementaremos la lógica para registrar nuevos usuarios, verificar sus credenciales durante el inicio de sesión y manejar cualquier error que pueda surgir durante estos procesos.

const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Registro de usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};