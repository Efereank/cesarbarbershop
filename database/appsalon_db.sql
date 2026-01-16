-- 1. Crear o seleccionar la base de datos
CREATE DATABASE IF NOT EXISTS `cesarbarbershopmcbo_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `cesarbarbershopmcbo_db`;

-- 2. Configuraciones iniciales
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Desactivar verificaciones de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- 3. PRIMERO: Tablas SIN dependencias
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `servicios`;
CREATE TABLE `servicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `precio` decimal(7,2) DEFAULT NULL,
  `duracion` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `tasa`;
CREATE TABLE `tasa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tasaBs` decimal(5,2) NOT NULL,
  `fecha_actualizacion` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. SEGUNDO: Tablas que dependen de ROLES
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) DEFAULT NULL,
  `apellido` varchar(60) DEFAULT NULL,
  `telefono` varchar(11) DEFAULT NULL,
  `correo` varchar(60) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  `confirmado` tinyint(1) DEFAULT NULL,
  `token` varchar(15) DEFAULT NULL,
  `rolId` int DEFAULT '3',
  PRIMARY KEY (`id`),
  KEY `rolId` (`rolId`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rolId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TERCERO: Tablas que dependen de USUARIOS
DROP TABLE IF EXISTS `barberos`;
CREATE TABLE `barberos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  PRIMARY KEY (`id`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `barberos_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. CUARTO: Tablas que dependen de USUARIOS y BARBEROS
DROP TABLE IF EXISTS `citas`;
CREATE TABLE `citas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `usuarioId` int DEFAULT NULL,
  `duracion` int DEFAULT '30',
  `barberoId` int DEFAULT NULL,
  `confirmada` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `usuariosId` (`usuarioId`),
  KEY `citas_ibfk_1` (`barberoId`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`barberoId`) REFERENCES `barberos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuariosId` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=343 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. QUINTO: Tablas que dependen de CITAS y SERVICIOS
DROP TABLE IF EXISTS `citasservicios`;
CREATE TABLE `citasservicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `citaId` int DEFAULT NULL,
  `servicioId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `servicioId` (`servicioId`),
  KEY `citaId` (`citaId`),
  CONSTRAINT `citaId` FOREIGN KEY (`citaId`) REFERENCES `citas` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `servicioId` FOREIGN KEY (`servicioId`) REFERENCES `servicios` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=340 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reactivar verificaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- 8. INSERTAR DATOS en ORDEN CORRECTO
-- Primero: roles (dependencia de usuarios)
INSERT INTO `roles` (`id`, `nombre`) VALUES
(1, 'admin'),
(2, 'barbero'),
(3, 'cliente');

-- Segundo: servicios (no tiene dependencias)
INSERT INTO `servicios` (`id`, `nombre`, `precio`, `duracion`) VALUES
(20, 'Corte De Cabello', '6.00', 30),
(21, 'Corte De Barba', '2.00', 30),
(22, 'Corte de Cabello + Barba', '7.00', 45);

-- Tercero: tasa (no tiene dependencias)
INSERT INTO `tasa` (`id`, `tasaBs`, `fecha_actualizacion`) VALUES
(17, '500.00', '2026-01-16 01:30:28');

-- Cuarto: usuarios (depende de roles)
INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `telefono`, `correo`, `password`, `admin`, `confirmado`, `token`, `rolId`) VALUES
(31, 'Frank', 'Diaz', '04124656958', 'correo@correo.com', '$2y$10$4oC10BHFcyVRBUcivsBhkucjMdwGWaiZ/BFseRR651kRgnP4CSJE6', 0, 1, '', 2),
(32, 'Admin', 'Superpoderoso', '04124636917', 'correo70@correo.com', '$2y$10$HyitmT98YwMk8I7xI.PuZeoYcbx.ncBk/7KeHr6RVM81emllFo0Me', 0, 1, '', 1);

-- Quinto: barberos (depende de usuarios)
INSERT INTO `barberos` (`id`, `usuarioId`, `especialidad`, `telefono`, `estado`) VALUES
(25, 31, 'Multifacético ', '04125052658', 'activo');

-- Sexto: citas (depende de usuarios y barberos)
INSERT INTO `citas` (`id`, `fecha`, `hora`, `hora_fin`, `usuarioId`, `duracion`, `barberoId`, `confirmada`) VALUES
(341, '2025-12-12', '10:00:00', '10:30:00', 32, 30, 25, 1),
(342, '2025-12-15', '10:00:00', '10:45:00', 32, 45, 25, 0);

-- Séptimo: citasservicios (depende de citas y servicios)
INSERT INTO `citasservicios` (`id`, `citaId`, `servicioId`) VALUES
(337, NULL, 22),
(338, 341, 20),
(339, 342, 22);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;