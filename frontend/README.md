# JCS Gaming Store

JCS Gaming Store es una plataforma web de comercio electrónico orientada a la venta de productos gaming, periféricos y artículos de escritorio. El proyecto permite a los usuarios navegar por un catálogo de productos, registrarse, iniciar sesión, añadir artículos al carrito, realizar pedidos y consultar su historial de compras.

Además, incluye un panel de administración desde el que se pueden gestionar productos, categorías, pedidos y solicitudes de asistencia.

---

## Descripción del proyecto

Este proyecto ha sido desarrollado como Trabajo de Fin de Grado del ciclo de Desarrollo de Aplicaciones Web. Su objetivo principal es simular una tienda online funcional, aplicando una arquitectura fullstack basada en frontend, backend y base de datos.

La aplicación está dividida en tres capas principales:

- **Frontend:** desarrollado con React y Vite.
- **Backend:** desarrollado con Node.js y Express.
- **Base de datos:** gestionada con MySQL y Sequelize como ORM.

---

## Funcionalidades principales

### Usuario cliente

- Registro de usuarios.
- Inicio de sesión.
- Navegación por el catálogo de productos.
- Filtrado por nombre, categoría y rango de precio.
- Añadir productos al carrito.
- Modificar cantidades del carrito.
- Eliminar productos del carrito.
- Finalizar compra.
- Consultar historial de pedidos.
- Solicitar asistencia mediante tickets de soporte.

### Administrador

- Acceso a panel de administración.
- Gestión de productos.
- Gestión de categorías.
- Visualización de pedidos.
- Gestión de solicitudes de soporte.
- Respuesta a tickets de asistencia.
- Control de stock y datos del catálogo.

---

## Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router DOM
- Axios
- JavaScript
- HTML5
- CSS-in-JS mediante estilos integrados en componentes

### Backend

- Node.js
- Express
- Sequelize
- MySQL2
- JSON Web Token
- Bcryptjs
- Dotenv
- CORS
- Nodemon

### Base de datos

- MySQL
- Modelo relacional
- Relaciones entre usuarios, productos, categorías, carrito, pedidos y solicitudes de soporte

---

## Estructura general del proyecto

```bash
TFG/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md


# JCS Gaming Store

JCS Gaming Store es una plataforma web de comercio electrónico orientada a la venta de productos gaming, periféricos y artículos de escritorio.

El proyecto permite a los usuarios navegar por un catálogo de productos, registrarse, iniciar sesión, añadir artículos al carrito, realizar pedidos y consultar su historial de compras.

Además, incluye un panel de administración desde el que se pueden gestionar productos, categorías, pedidos y solicitudes de asistencia.

---

## Instalación del proyecto

### 1. Clonar el repositorio

git clone URL_DEL_REPOSITORIO  
cd TFG

---

## Configuración del backend

### 1. Entrar en la carpeta del backend

cd backend

### 2. Instalar dependencias

npm install

### 3. Crear archivo .env

En la carpeta backend, crear un archivo .env con la siguiente estructura:

PORT=5000

DB_NAME=gaming_jcs_bd  
DB_USER=root  
DB_PASSWORD=tu_password  
DB_HOST=localhost  
DB_DIALECT=mysql

JWT_SECRET=tu_clave_secreta

Importante: cambia los valores según tu configuración local.

### 4. Crear la base de datos

En MySQL, crear la base de datos:

CREATE DATABASE gaming_jcs_bd;

Después, ejecutar el script SQL correspondiente para crear las tablas del proyecto.

### 5. Iniciar el backend

npm run dev

Si no tienes script dev, puedes ejecutar:

node server.js

El backend quedará disponible normalmente en:

http://localhost:5000

---

## Configuración del frontend

### 1. Entrar en la carpeta del frontend

Desde la raíz del proyecto:

cd frontend

### 2. Instalar dependencias

npm install

### 3. Iniciar el frontend

npm run dev

La aplicación estará disponible normalmente en:

http://localhost:5173

---

## Configuración de Axios

El frontend utiliza Axios para comunicarse con la API del backend.

Ejemplo de configuración en:

frontend/src/api/axios.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

export default api;

---

## Rutas principales del frontend

| Ruta | Descripción |
|---|---|
| / | Página principal |
| /catalog | Catálogo de productos |
| /cart | Carrito de compra |
| /login | Inicio de sesión |
| /register | Registro de usuario |
| /mis-pedidos | Historial de pedidos del usuario |
| /serviceform | Solicitud de asistencia |
| /admin | Panel de administración |
| /admin/categorias | Gestión de categorías |
| /admin/pedidos | Gestión de pedidos y soporte |

---

## Roles de usuario

La aplicación diferencia entre dos tipos de usuarios:

### Cliente

Puede navegar por la tienda, añadir productos al carrito, realizar pedidos y solicitar asistencia.

### Administrador

Tiene acceso al panel de administración y puede gestionar productos, categorías, pedidos y solicitudes de soporte.

---

## Seguridad

El proyecto implementa medidas básicas de seguridad:

- Contraseñas cifradas mediante Bcryptjs.
- Autenticación mediante JSON Web Token.
- Protección de rutas privadas.
- Diferenciación de roles entre cliente y administrador.
- Validación de stock antes de finalizar pedidos.
- Uso de variables de entorno para proteger credenciales sensibles.

---

## Base de datos

La base de datos está diseñada siguiendo un modelo relacional. Las principales entidades son:

- Usuarios
- Categorías
- Productos
- Carrito
- Detalles del carrito
- Pedidos
- Detalles del pedido
- Pagos
- Solicitudes de servicio

El sistema mantiene relaciones entre estas entidades mediante claves primarias y claves foráneas.

---

## Comandos útiles

### Backend

cd backend  
npm install  
npm run dev

### Frontend

cd frontend  
npm install  
npm run dev

### Git

git status  
git add .  
git commit -m "Descripción de los cambios"  
git push origin main

---

## Estado actual del proyecto

El proyecto incluye una versión funcional de una tienda online con:

- Catálogo de productos.
- Sistema de autenticación.
- Carrito de compra.
- Gestión de pedidos.
- Panel de administración.
- Sistema de asistencia.
- Diseño responsive.
- Estética visual orientada al sector gaming.

---

## Posibles mejoras futuras

Algunas ampliaciones planteadas para futuras versiones son:

- Integración de una pasarela de pago real como Stripe o PayPal.
- Sistema de valoraciones y reseñas de productos.
- Notificaciones en tiempo real.
- Migración a TypeScript.
- Testing automatizado con Jest o Cypress.
- Despliegue mediante Docker.
- Pipeline CI/CD con GitHub Actions.
- Desarrollo de una versión móvil con React Native.

---

## Autor

Proyecto desarrollado por:

Juan Carlos Dahdah Herrera
Juan Carlos Piñas Muñoz


Trabajo de Fin de Grado  
Desarrollo de Aplicaciones Web

---

## Licencia

Este proyecto ha sido desarrollado con fines académicos.