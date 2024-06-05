-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-06-2024 a las 01:49:49
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mascotas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `tipo_categoria` varchar(32) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `tipo_categoria`, `admin_id`) VALUES
(6, 'Perro', 1121),
(7, 'Gato', 1121),
(8, 'Ave', 1121),
(9, 'Reptil', 1121),
(10, 'Roedor', 1121);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

CREATE TABLE `generos` (
  `id_genero` int(11) NOT NULL,
  `tipo_generos` varchar(32) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `generos`
--

INSERT INTO `generos` (`id_genero`, `tipo_generos`, `admin_id`) VALUES
(1, 'Macho', 1121),
(2, 'Hembra', 1121);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascotas`
--

CREATE TABLE `mascotas` (
  `id_mascota` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `fk_id_raza` int(11) NOT NULL,
  `fk_id_categoria` int(11) NOT NULL,
  `fk_id_genero` int(11) NOT NULL,
  `foto` varchar(60) NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascotas`
--

INSERT INTO `mascotas` (`id_mascota`, `name`, `fk_id_raza`, `fk_id_categoria`, `fk_id_genero`, `foto`, `admin_id`) VALUES
(11, 'Bolita', 4, 6, 1, 'DulcePerro-1716687709823-454755574.jpg', 1121),
(12, 'Blues', 12, 9, 1, 'Serpiente-1716691840105-194078399.jpg', 1121),
(14, 'Antonio', 14, 8, 1, 'Perico-1716691926059-848352455.jpg', 1121),
(15, 'Husky', 7, 6, 1, 'LoboSiberiano-1716687152423-582518093.jpg', 1121);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `razas`
--

CREATE TABLE `razas` (
  `id_raza` int(11) NOT NULL,
  `nombre_raza` varchar(32) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `razas`
--

INSERT INTO `razas` (`id_raza`, `nombre_raza`, `admin_id`) VALUES
(1, 'Doberman', 1121),
(2, 'Pitbull', 1121),
(4, 'Chihuahua', 1121),
(5, 'Pastor Aleman', 1121),
(6, 'Dalmata', 1121),
(7, 'Lobo Siberiano', 1121),
(8, 'Hámster', 1121),
(9, 'Conejo', 1121),
(11, 'Tortuga', 1121),
(12, 'Serpiente', 1121),
(13, 'Loro', 1121),
(14, 'Periquito', 1121),
(15, 'Callejero', 1121);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `identificacion` int(11) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `email` varchar(32) NOT NULL,
  `password` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`identificacion`, `nombre`, `email`, `password`) VALUES
(1121, 'Esteban', 'esteban@gmail.com', '$2b$10$bbk9RaHgTv17tGZtn7cVrOK.boiHG8Nde16gZwXvf5WWgWpy4P3u2');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indices de la tabla `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id_genero`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indices de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD PRIMARY KEY (`id_mascota`),
  ADD KEY `fk_id_raza` (`fk_id_raza`),
  ADD KEY `fk_id_categoria` (`fk_id_categoria`),
  ADD KEY `fk_id_genero` (`fk_id_genero`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indices de la tabla `razas`
--
ALTER TABLE `razas`
  ADD PRIMARY KEY (`id_raza`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`identificacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `id_genero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  MODIFY `id_mascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `razas`
--
ALTER TABLE `razas`
  MODIFY `id_raza` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `generos`
--
ALTER TABLE `generos`
  ADD CONSTRAINT `generos_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`fk_id_raza`) REFERENCES `razas` (`id_raza`),
  ADD CONSTRAINT `mascotas_ibfk_2` FOREIGN KEY (`fk_id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `mascotas_ibfk_3` FOREIGN KEY (`fk_id_genero`) REFERENCES `generos` (`id_genero`),
  ADD CONSTRAINT `mascotas_ibfk_4` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);

--
-- Filtros para la tabla `razas`
--
ALTER TABLE `razas`
  ADD CONSTRAINT `razas_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`identificacion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
