<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\AdminController;
use Controllers\APIController;
use Controllers\CitaController;
use Controllers\LoginController;
use Controllers\ServicioController;
use Controllers\BarberoController;
use Controllers\BarberosController;
use MVC\Router;

$router = new Router();



// INICIAR SESIÓN
$router->get('/', [LoginController::class, 'login']);
$router->post('/', [LoginController::class, 'login']);

// CERRAR SESIÓN
$router->get('/logout', [LoginController::class, 'logout']);

// RECUPERAR PASSWORD
$router->get('/recuperar-cuenta', [LoginController::class, 'recuperarCuenta']);
$router->post('/recuperar-cuenta', [LoginController::class, 'recuperarCuenta']);

// REESTABLECER PASSWORD
$router->get('/reestablecer-cuenta', [LoginController::class, 'reestablecerCuenta']);
$router->post('/reestablecer-cuenta', [LoginController::class, 'reestablecerCuenta']);

// CREAR CUENTA
$router->get('/sign-up', [LoginController::class, 'crearCuenta']);
$router->post('/sign-up', [LoginController::class, 'crearCuenta']);

// CONFIRMAR CUENTA
$router->get('/confirmar-cuenta', [LoginController::class, 'confirmar']);
$router->get('/mensaje', [LoginController::class, 'mensaje']);



// ÁREA PRIVADA

$router->get('/citas', [CitaController::class, 'index']);
$router->get('/admin', [AdminController::class, 'index']);



// API DE CITAS
$router->get('/api/servicios', [APIController::class, 'index']);
$router->get('/api/tasa', [APIController::class, 'tasa']);
$router->get('/api/barberos', [APIController::class, 'barberos']); // ← Nueva ruta
$router->post('/api/citas', [APIController::class, 'guardar']);
$router->post('/api/eliminar', [APIController::class, 'eliminar']);



// HORAS DISPONIBLES
$router->post('/citas/verificar-disponibilidad', [CitaController::class, 'verificarDisponibilidad']);
$router->post('/citas/horarios-disponibles', [CitaController::class, 'obtenerHorariosDisponibles']);



// CRUD DE SERVICIOS
$router->get('/servicios', [ServicioController::class, 'index']);
$router->get('/servicios/crear', [ServicioController::class, 'crear']);
$router->post('/servicios/crear', [ServicioController::class, 'crear']);
$router->get('/servicios/actualizar', [ServicioController::class, 'actualizar']);
$router->post('/servicios/actualizar', [ServicioController::class, 'actualizar']);
$router->post('/servicios/eliminar', [ServicioController::class, 'eliminar']);


$router->get('/api/barberos', [APIController::class, 'barberos']);
$router->get('/admin/barberos', [BarberoController::class, 'index']);
$router->get('/admin/barberos/crear', [BarberoController::class, 'crear']);
$router->post('/admin/barberos/crear', [BarberoController::class, 'crear']);
$router->get('/admin/barberos/actualizar', [BarberoController::class, 'actualizar']);
$router->post('/admin/barberos/actualizar', [BarberoController::class, 'actualizar']);
$router->post('/admin/barberos/eliminar', [BarberoController::class, 'eliminar']);

// En tu archivo de rutas
$router->get('/barbero', [BarberosController::class, 'index']);
// En tu archivo de rutas
$router->post('/barbero/confirmar', [BarberosController::class, 'confirmar']);

// ACTUALIZAR TASA
$router->get('/servicios/tasa', [ServicioController::class, 'tasa']);
$router->post('/servicios/tasa', [ServicioController::class, 'tasa']);



// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();