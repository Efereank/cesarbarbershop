<?php 
namespace Controllers;

use Model\AdminCita;
use Model\Servicio;
use Model\Citas;
use Model\Tasa;
use Model\Barbero;
use MVC\Router;

class BarberosController {
    public static function index(Router $router) {
        isSession();
        
        
        $usuarioId = $_SESSION['id'] ?? null;
        
        if (!$usuarioId) {
            header('Location: /login');
            return;
        }

        // Buscar el barbero por usuarioId
        $barbero = Barbero::where('usuarioId', $usuarioId);
        $barbero = is_array($barbero) ? array_shift($barbero) : $barbero;
        
        if (!$barbero) {

            header('Location: /citas');
            return;
        }

        $barberoId = $barbero->id; 

        $servicios = Servicio::all();


        $fechaStr = $_GET['fecha'] ?? date('Y-m-d');
        $fecha = explode('-', $fechaStr);

        if (!checkdate($fecha[1], $fecha[2], $fecha[0])) {
            header('Location: /404');
        }

    // CONSULTA MODIFICADA - FILTRAR POR FECHA Y BARBERO E INCLUIR CONFIRMADA
    $consulta = "SELECT citas.id, citas.hora, citas.confirmada, "; // ← AGREGADO citas.confirmada
    $consulta .= "CONCAT(usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
    $consulta .= "usuarios.correo, usuarios.telefono, servicios.nombre as servicio, servicios.precio, servicios.duracion ";
    $consulta .= "FROM citas ";
    $consulta .= "LEFT OUTER JOIN usuarios ON citas.usuarioId=usuarios.id ";
    $consulta .= "LEFT OUTER JOIN citasservicios ON citasservicios.citaId=citas.id ";
    $consulta .= "LEFT OUTER JOIN servicios ON servicios.id=citasservicios.servicioId ";
    $consulta .= "WHERE fecha = '{$fechaStr}' AND citas.barberoId = {$barberoId}";

        $citas = AdminCita::SQL($consulta);

        
        $ingresosDia = 0;
        foreach ($citas as $cita) {
            
            if (isset($cita->precio) && is_numeric($cita->precio)) {
                $ingresosDia += $cita->precio;
            }
        }

        $tasaBs = 1.0; 
        $tasaObj = Tasa::getTasaActual();
        
        if ($tasaObj && is_numeric($tasaObj->tasaBs) && $tasaObj->tasaBs > 0) {
            $tasaBs = (float)$tasaObj->tasaBs; 
        }

        $router->render('barbero/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fechaStr,
            'tasaBs' => $tasaBs,
            'servicios' => $servicios,
            'barbero' => $barbero,
            'ingresosDia' => $ingresosDia 
        ]);
    }


public static function confirmar() {
    isSession();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = $_POST['id'];
        
        // Buscar la cita
        $resultadosCita = Citas::find($id);
        $cita = is_array($resultadosCita) && !empty($resultadosCita) ? array_shift($resultadosCita) : $resultadosCita;
        
        if ($cita && $cita instanceof Citas) {
            // Confirmar la cita - actualizar ambos campos
            $cita->confirmada = 1;
            $resultado = $cita->guardar();
            
            if ($resultado) {
                header('Location: /barbero?confirmada=1');
            } else {
                header('Location: /barbero?error=1');
            }
        }
    }
}
}