<?php 
namespace Controllers;

use Model\Citas;
use Model\Servicio;
use Model\Barbero; 
use MVC\Router;

class CitaController{
    public static function index(Router $router){
        isSession();

        
        if (!isset($_SESSION['nombre'])) {
            header("Location: /");
            exit();
        }

        $router->render('citas/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }

    public static function crear(Router $router){
        isSession();
        $alertas = [];
        $cita = new Citas();

        
        $servicios = Servicio::all();
        
        
        $barberos = Barbero::all();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $cita->sincronizar($_POST);
            
            $servicioId = $cita->servicioId ?? $_POST['servicioId'] ?? null;
            $servicio = Servicio::find($servicioId);
            
            if ($servicio && isset($_POST['hora'])) {
                $duracion = $servicio->duracion ?? 30;
                $hora_fin = date('H:i', strtotime($_POST['hora']) + $duracion * 60);
                $cita->hora_fin = $hora_fin;
                
                $_POST['hora_fin'] = $hora_fin;
                $_POST['duracion'] = $duracion;
            }
        }

        $router->render('citas/crear', [
            'nombre' => $_SESSION['nombre'],
            'cita' => $cita,
            'alertas' => $alertas,
            'servicios' => $servicios,
            'barberos' => $barberos 
        ]);
    }

    public static function guardar() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            
            $cita = new Citas($_POST);
            
            
            $barberoId = self::asignarBarbero($cita->fecha);
            
            if (!$barberoId) {
                header('Content-Type: application/json');
                echo json_encode(['resultado' => 'error', 'mensaje' => 'No hay barberos disponibles']);
                return;
            }
            
            $cita->barberoId = $barberoId; 

            $servicioId = $cita->servicioId ?? $_POST['servicioId'] ?? null;
            $servicio = Servicio::find($servicioId);

            if ($servicio && isset($_POST['hora'])) {
                $duracion = $servicio->duracion ?? 30;
                $hora_fin = date('H:i:s', strtotime($_POST['hora']) + $duracion * 60);
                $cita->hora_fin = $hora_fin;
                
                error_log("Hora_fin calculada: " . $hora_fin);
            }
            
            
            $resultado = $cita->guardar();
            
            header('Content-Type: application/json');
            echo json_encode(['resultado' => $resultado]);
        }
    }




    private static function asignarBarbero($fecha) {
        $barberos = Barbero::all();
        
        if (empty($barberos)) {
            return null;
        }

        $barberoCounts = [];
        
        foreach ($barberos as $barbero) {
            $consulta = "SELECT COUNT(*) as total FROM citas 
                        WHERE barberoId = {$barbero->id} AND fecha = '{$fecha}'";
            $resultado = Citas::SQL($consulta);
            $barberoCounts[$barbero->id] = $resultado[0]->total ?? 0;
        }
        
        // Encontrar el barbero con menos citas
        asort($barberoCounts);
        $barberoId = array_key_first($barberoCounts);
        
        return $barberoId;
        
        // return $barberos[array_rand($barberos)]->id;
    }

    public static function actualizar(Router $router){
        isSession();
        $alertas = [];

        if(!is_numeric($_GET['id'])) return;
        $cita = Citas::find($_GET['id']);

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            
            // Obtener la duración del servicio
            $servicioId = $cita->servicioId ?? $_POST['servicioId'] ?? null;
            $servicio = Servicio::find($servicioId);
            
            if ($servicio && isset($_POST['hora'])) {
                $duracion = $servicio->duracion ?? 30;
                $hora_fin = date('H:i', strtotime($_POST['hora']) + $duracion * 60);
                
                $_POST['hora_fin'] = $hora_fin;
                $_POST['duracion'] = $duracion;
            }

            $cita->sincronizar($_POST);
            $cita->guardar();
        }

        $router->render('citas/actualizar', [
            'nombre' => $_SESSION['nombre'],
            'cita' => $cita,
            'alertas' => $alertas
        ]);
    }

public static function verificarDisponibilidad() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $datos = json_decode(file_get_contents('php://input'), true);

        $fecha = $datos['fecha'] ?? '';
        $hora = $datos['hora'] ?? '';
        $duracion = $datos['duracion'] ?? 30;
        $barberoId = $datos['barberoId'] ?? null;


        if (!$barberoId) {
            header('Content-Type: application/json');
            echo json_encode([
                'disponible' => true,
                'mensaje' => 'Selecciona un barbero para verificar disponibilidad exacta'
            ]);
            return;
        }

        if (!$fecha || !$hora) {
            header('Content-Type: application/json');
            echo json_encode(['disponible' => false, 'mensaje' => 'Fecha u hora inválida']);
            return;
        }


        $horaInicio = date('H:i:s', strtotime($hora));
        $hora_fin = date('H:i:s', strtotime($horaInicio) + $duracion * 60);

        $citasSolapadas = Citas::obtenerCitasSolapadas($fecha, $horaInicio, $hora_fin, null, $barberoId);

        $disponible = empty($citasSolapadas);
        $mensaje = $disponible ? '' : 'El barbero seleccionado ya tiene una cita en este horario.';

        header('Content-Type: application/json');
        echo json_encode([
            'disponible' => $disponible,
            'mensaje' => $mensaje,
            'hora_fin' => $hora_fin
        ]);
        return;
    }
}
public static function obtenerHorariosDisponibles() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $datos = json_decode(file_get_contents('php://input'), true);
        
        $fecha = $datos['fecha'] ?? '';
        $duracion = $datos['duracion'] ?? 30;
        $barberoId = $datos['barberoId'] ?? null; 
        
        if (!$fecha) {
            header('Content-Type: application/json');
            echo json_encode(['horarios' => []]);
            return;
        }
        

        if ($barberoId) {
            
            $citasExistentes = Citas::where('fecha', $fecha) ?? [];        
        }

    
        
        $horaInicio = '10:00';
        $horaFin = '20:00';
        $intervalo = 30; 
        
        $horariosDisponibles = self::generarHorariosDisponibles(
            $horaInicio, 
            $horaFin, 
            $intervalo, 
            $citasExistentes,
            $duracion
        );
        
        header('Content-Type: application/json');
        echo json_encode(['horarios' => $horariosDisponibles]);
        return;
    }
}
    private static function generarHorariosDisponibles($inicio, $fin, $intervalo, $citasExistentes, $duracionCita) {
        $horarios = [];
        $horaActual = strtotime($inicio);
        $horaFin = strtotime($fin);
        
        while ($horaActual < $horaFin) {
            $horaFormato = date('H:i', $horaActual);
            $horaFinCita = date('H:i', $horaActual + ($duracionCita * 60));
            
            $disponible = self::verificarDisponibilidadHorario(
                $horaFormato, 
                $horaFinCita, 
                $citasExistentes
            );
            
            
            if ($disponible && strtotime($horaFinCita) <= $horaFin) {
                $horarios[] = [
                    'hora' => $horaFormato,
                    'display' => $horaFormato,
                    'disponible' => true
                ];
            } else {
                $horarios[] = [
                    'hora' => $horaFormato,
                    'display' => $horaFormato . ' - No disponible',
                    'disponible' => false
                ];
            }
            
            $horaActual = strtotime("+{$intervalo} minutes", $horaActual);
        }
        
        return $horarios;
    }

    private static function verificarDisponibilidadHorario($horaInicio, $horaFin, $citasExistentes) {
        if (empty($citasExistentes)) return true;
        
        foreach ($citasExistentes as $cita) {
            if (!isset($cita->hora) || !isset($cita->hora_fin)) continue;
            
            $citaInicio = $cita->hora;
            $citaFin = $cita->hora_fin;
            
            // Asegurarse de que las horas tengan formato completo
            if (strlen($citaInicio) === 5) $citaInicio .= ':00';
            if (strlen($citaFin) === 5) $citaFin .= ':00';
            if (strlen($horaInicio) === 5) $horaInicio .= ':00';
            if (strlen($horaFin) === 5) $horaFin .= ':00';
            
            // Verificar solapamiento
            $haySolapamiento = ($horaInicio < $citaFin) && ($horaFin > $citaInicio);
            
            if ($haySolapamiento) {
                return false;
            }
        }
        
        return true;
    }

}