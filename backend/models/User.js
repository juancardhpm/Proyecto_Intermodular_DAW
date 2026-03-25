
//En primer lugar, creamos el Modelo de Usuario utilizando Sequelize.
//  Este modelo representará la tabla de usuarios en la base de datos 
// y definirá los campos necesarios para almacenar la información del usuario,
//  como el nombre, correo electrónico, contraseña y rol.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


// Ponemos en nombre de la tabla de la bbdd
const User = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('cliente', 'admin'),
    defaultValue: 'cliente',
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = User;