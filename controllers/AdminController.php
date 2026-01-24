<?php 

namespace Controllers;

use Model\AdminCita;
use Model\Servicio;
use Model\Tasa;
use MVC\Router;

class AdminController {
    public static function index( Router $router ) {
        isSession();
        isAdmin();

        $servicios = Servicio::all();

        $fechaStr = $_GET['fecha'] ?? date('Y-m-d');
        $fecha = explode('-', $fechaStr);

        if (!checkdate($fecha[1], $fecha[2], $fecha[0] )) {
            header('Location: /404');
        }

        $consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= " usuarios.correo, usuarios.telefono, servicios.nombre as servicio, servicios.precio, servicios.duracion, ";
        $consulta .= " CONCAT(barberos_usuarios.nombre, ' ', barberos_usuarios.apellido) as barbero, ";
        $consulta .= " barberos_usuarios.telefono as telefono_barbero "; //OPCIONAL
        $consulta .= " FROM citas  ";
        $consulta .= " LEFT OUTER JOIN usuarios ";
        $consulta .= " ON citas.usuarioId=usuarios.id  ";
        $consulta .= " LEFT OUTER JOIN citasservicios ";
        $consulta .= " ON citasservicios.citaId=citas.id ";
        $consulta .= " LEFT OUTER JOIN servicios ";
        $consulta .= " ON servicios.id=citasservicios.servicioId ";
        $consulta .= " LEFT OUTER JOIN barberos "; 
        $consulta .= " ON citas.barberoId=barberos.id ";
        $consulta .= " LEFT OUTER JOIN usuarios as barberos_usuarios "; // ← NUEVO JOIN con usuarios para el barbero
        $consulta .= " ON barberos.usuarioId=barberos_usuarios.id ";
        $consulta .= " WHERE fecha = '{$fechaStr}'"; 

        $citas = AdminCita::SQL($consulta);

        $tasaBs = 1.0; 
        $tasaObj = Tasa::getTasaActual();
        
        if ($tasaObj && is_numeric($tasaObj->tasaBs) && $tasaObj->tasaBs > 0) {
            $tasaBs = (float)$tasaObj->tasaBs; 
        }

        $router -> render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fechaStr,
            'tasaBs' => $tasaBs,
            'servicios' => $servicios
        ]);
    }
}