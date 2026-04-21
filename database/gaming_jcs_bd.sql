-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-03-2026 a las 03:21:13
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gaming_jcs_bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id`, `usuario_id`, `fecha_creacion`, `estado`) VALUES
(1, 1, '2026-03-30 20:06:58', 'activo'),
(2, 3, '2026-03-30 20:23:00', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Tarjetas Graficas', NULL),
(2, 'Prueba', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_carrito`
--

CREATE TABLE `detalles_carrito` (
  `id` int(11) NOT NULL,
  `carrito_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_carrito`
--

INSERT INTO `detalles_carrito` (`id`, `carrito_id`, `producto_id`, `cantidad`) VALUES
(7, 2, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedido`
--

CREATE TABLE `detalles_pedido` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_pedido`
--

INSERT INTO `detalles_pedido` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`) VALUES
(6, 6, 2, 4, 2000.00),
(7, 7, 2, 4, 2000.00),
(8, 8, 2, 1, 2000.00),
(9, 8, 1, 1, 20.00),
(10, 9, 2, 1, 2000.00),
(11, 10, 1, 1, 20.00),
(12, 11, 1, 1, 20.00),
(13, 11, 2, 1, 2000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp(),
  `cantidad_total` decimal(10,2) NOT NULL,
  `metodo_pago` enum('Tarjeta','PayPal','Transferencia') NOT NULL,
  `estado_pago` enum('Pendiente','Completado','Fallido') DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id`, `pedido_id`, `fecha_pago`, `cantidad_total`, `metodo_pago`, `estado_pago`) VALUES
(1, 6, '2026-03-30 23:38:07', 8000.00, 'Transferencia', 'Completado'),
(2, 7, '2026-03-30 23:38:47', 8000.00, 'PayPal', 'Completado'),
(3, 8, '2026-03-30 23:39:34', 2020.00, 'Tarjeta', 'Completado'),
(4, 9, '2026-03-30 23:48:02', 2000.00, 'Tarjeta', 'Completado'),
(5, 10, '2026-03-30 23:48:40', 20.00, 'PayPal', 'Completado'),
(6, 11, '2026-03-30 23:50:26', 2020.00, 'Transferencia', 'Completado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `direccion_envio` varchar(255) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('Pendiente','Enviado','Entregado') DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `usuario_id`, `fecha_pedido`, `direccion_envio`, `total`, `estado`) VALUES
(6, 1, '2026-03-30 23:38:07', 'Calle Prueba, 4', 8000.00, 'Pendiente'),
(7, 1, '2026-03-30 23:38:47', 'Prueba', 8000.00, 'Pendiente'),
(8, 1, '2026-03-30 23:39:34', 'cccc', 2020.00, 'Pendiente'),
(9, 1, '2026-03-30 23:48:02', 'ffff', 2000.00, 'Pendiente'),
(10, 1, '2026-03-30 23:48:40', 'vvvv', 20.00, 'Pendiente'),
(11, 1, '2026-03-30 23:50:26', 'fff', 2020.00, 'Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `activo` enum('si','no') DEFAULT 'si',
  `imagen_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`categoria_id`, `nombre`, `descripcion`, `precio`, `stock`, `activo`, `imagen_url`) 
VALUES 
(1, 'MSI GeForce RTX 3080', 'Tarjeta gráfica de alto rendimiento para gamers', 800.00, 50, 'si', 'https://example.com/rtx3080.jpg'),
(1, 'Gigabyte Radeon RX 6800 XT', 'Tarjeta gráfica potente para juegos en 4K', 1000.00, 30, 'si', 'https://example.com/rx6800xt.jpg'),
(2, 'Intel Core i7-12700K', 'Procesador de alto rendimiento para PC gaming y estaciones de trabajo', 350.00, 40, 'si', 'https://example.com/i712700k.jpg'),
(2, 'AMD Ryzen 9 5900X', 'Procesador AMD de 12 núcleos ideal para multitarea y gaming', 750.00, 45, 'si', 'https://example.com/ryzen95900x.jpg'),
(1, 'NVIDIA GeForce GTX 1660', 'Tarjeta gráfica de gama media ideal para gaming 1080p', 250.00, 60, 'si', 'https://example.com/gtx1660.jpg'),
(2, 'Corsair Vengeance LPX 16GB DDR4', 'Memoria RAM DDR4 de 16 GB para aumentar el rendimiento de tu PC', 80.00, 80, 'si', 'https://example.com/ramcorsair.jpg'),
(2, 'Kingston A2000 500GB SSD', 'Disco SSD NVMe para mejorar la velocidad de carga de tu PC', 60.00, 70, 'si', 'https://example.com/kingstonssd.jpg'),
(2, 'Samsung 970 EVO Plus 1TB', 'SSD NVMe M.2 de alto rendimiento para PC de alta gama', 150.00, 50, 'si', 'https://example.com/samsungssd.jpg'),
(1, 'MSI MAG 27" Gaming Monitor', 'Monitor gaming de 27 pulgadas con frecuencia de actualización de 144Hz', 350.00, 30, 'si', 'https://example.com/msimonitor.jpg'),
(1, 'Logitech G502 Hero', 'Ratón gaming con sensor de alta precisión y 11 botones programables', 50.00, 100, 'si', 'https://example.com/g502hero.jpg');
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_servicio`
--

CREATE TABLE `solicitud_servicio` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `asunto` varchar(200) NOT NULL,
  `mensaje` text NOT NULL,
  `estado` enum('abierto','respondido','cerrado') DEFAULT 'abierto',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `respuesta_admin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitud_servicio`
--

INSERT INTO `solicitud_servicio` (`id`, `usuario_id`, `asunto`, `mensaje`, `estado`, `fecha_creacion`, `respuesta_admin`) VALUES
(1, 1, 'Error de prueba', 'Esto es una prueba de asistencia', 'respondido', '2026-03-31 00:05:15', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('cliente','admin') DEFAULT 'cliente',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellidos`, `email`, `password`, `direccion`, `telefono`, `rol`, `fecha_registro`) VALUES
(1, 'Prueba', 'Prueba', 'prueba@prueba.com', '$2b$10$Lz8GraOifLfNaMDP6Y2mm.k.4t6n6ajThHPlM2iihICmMrr0KAjUO', 'Calle Prueba', '66666666', 'cliente', '2026-03-25 02:45:27'),
(2, 'pruebas', 'admin', 'admin@admin.com', '$2b$10$lmZ5HfL5OzK8ntaLEdNnfuTaUg6gVphbZtOVqLEyL49ei.SyQuosq', 'Calle Pruebas Admin', '555555555', 'admin', '2026-03-27 23:04:55'),
(3, 'prueba2', 'prueba2', 'prueba2@prueba.com', '$2b$10$4aYh6AM4xhUyVM2T3KS9VO2Vg9hfyaMxcXwOBHYkWgkvKUvfogxsO', 'Calle Prueba2', '666666666', 'cliente', '2026-03-30 20:22:43');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `detalles_carrito`
--
ALTER TABLE `detalles_carrito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carrito_id` (`carrito_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pedido_id` (`pedido_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `solicitud_servicio`
--
ALTER TABLE `solicitud_servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalles_carrito`
--
ALTER TABLE `detalles_carrito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `solicitud_servicio`
--
ALTER TABLE `solicitud_servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalles_carrito`
--
ALTER TABLE `detalles_carrito`
  ADD CONSTRAINT `detalles_carrito_ibfk_1` FOREIGN KEY (`carrito_id`) REFERENCES `carrito` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalles_carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD CONSTRAINT `detalles_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalles_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `solicitud_servicio`
--
ALTER TABLE `solicitud_servicio`
  ADD CONSTRAINT `solicitud_servicio_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
