<?php 

namespace Controllers;

use Model\Citas;
use Model\CitaServicio;
use Model\Servicio;
use Model\Tasa;
use Model\Barbero;
use Exception;

class APIController{
    public static function index(){
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    public static function tasa(){
        $tasa = Tasa::all();
        echo json_encode($tasa);
    }

    public static function barberos(){
        $barberos = Barbero::activos();
        echo json_encode($barberos);
    }

    public static function guardar(){
        try {
            // Validar datos requeridos
            $usuarioId = $_POST['usuarioId'] ?? null;
            $fecha = $_POST['fecha'] ?? null;
            $hora = $_POST['hora'] ?? null;
            $servicios = $_POST['servicios'] ?? null;
            $barberoId = $_POST['barberoId'] ?? null;
            
            // Validaciones básicas
            if (!$usuarioId || !$fecha || !$hora || !$servicios || !$barberoId) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'Por favor completa todos los campos'
                ]);
                return;
            }
            
            // Validar formato de fecha (YYYY-MM-DD)
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'Formato de fecha inválido'
                ]);
                return;
            }
            
            // Validar formato de hora (HH:MM o HH:MM:SS)
            if (!preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $hora)) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'Formato de hora inválido'
                ]);
                return;
            }
            
            // Convertir hora a formato completo (HH:MM:SS)
            $horaInicio = date('H:i:s', strtotime($hora));
            
            // Calcular duración total desde los servicios
            $idServicios = explode(",", $servicios);
            $duracionTotal = 0;
            $serviciosValidos = [];
            
            foreach($idServicios as $idServicio) {
                $servicio = Servicio::find($idServicio);
                if (!$servicio) {
                    echo json_encode([
                        'resultado' => 'error', 
                        'mensaje' => 'Uno o más servicios no existen'
                    ]);
                    return;
                }
                $duracionTotal += $servicio->duracion ?? 30;
                $serviciosValidos[] = $servicio;
            }
            
            if ($duracionTotal <= 0) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'La duración de los servicios no es válida'
                ]);
                return;
            }
            
            // Calcular hora_fin usando el método del modelo
            $citaTemporal = new Citas(['hora' => $horaInicio]);
            $hora_fin = $citaTemporal->calcularHoraFin($duracionTotal);
            
            if (empty($hora_fin)) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'Error al calcular la hora de fin'
                ]);
                return;
            }
            
            // Verificar que el barbero existe
            $barbero = Barbero::find($barberoId);
            if (!$barbero) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'El barbero seleccionado no existe'
                ]);
                return;
            }
            
            // ✅ VERIFICACIÓN CRÍTICA: Validar disponibilidad ANTES de guardar
            // Usar el método con LOCK para evitar condiciones de carrera
            $citasSolapadas = Citas::obtenerCitasSolapadasConLock(
                $fecha, 
                $horaInicio, 
                $hora_fin, 
                null,  // No excluir ninguna cita (nueva reserva)
                $barberoId
            );
            
            if (!empty($citasSolapadas)) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'El barbero seleccionado ya tiene una cita en este horario.',
                    'actualizarPagina' => true
                ]);
                return;
            }
            
            // ✅ VERIFICAR HORARIO DE TRABAJO (10:00 - 20:00)
            $horaInicioTime = strtotime($horaInicio);
            $horaFinTime = strtotime($hora_fin);
            $horaApertura = strtotime('10:00:00');
            $horaCierre = strtotime('20:00:00');
            
            if ($horaInicioTime < $horaApertura || $horaFinTime > $horaCierre) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'El horario seleccionado está fuera del horario de atención (10:00 - 20:00)'
                ]);
                return;
            }
            
            // ✅ Verificar que no sea una fecha pasada (usar zona horaria de Caracas)
            $now = new \DateTime('now', new \DateTimeZone('America/Caracas'));
            $fechaActual = $now->format('Y-m-d');
            $horaActual = $now->format('H:i:s');

            if ($fecha < $fechaActual) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'No se pueden reservar citas en fechas pasadas'
                ]);
                return;
            }
            
            if ($fecha === $fechaActual && $horaInicio < $horaActual) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'No se pueden reservar citas en horas pasadas'
                ]);
                return;
            }
            
            // ✅ Verificar que la duración sea razonable (máximo 4 horas)
            if ($duracionTotal > 240) { // 4 horas en minutos
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'La duración total de los servicios excede el máximo permitido (4 horas)'
                ]);
                return;
            }
            
            // Crear la cita con datos validados
            $cita = new Citas([
                'usuarioId' => $usuarioId,
                'fecha' => $fecha,
                'hora' => $horaInicio,
                'hora_fin' => $hora_fin,
                'duracion' => $duracionTotal,
                'barberoId' => $barberoId,
                'confirmada' => 0
            ]);
            
            $resultado = $cita->guardar();
            
            if (!$resultado || !isset($resultado['id'])) {
                echo json_encode([
                    'resultado' => 'error', 
                    'mensaje' => 'Error al guardar la cita en la base de datos'
                ]);
                return;
            }
            
            $id = $resultado['id'];
            
            // Guardar los servicios de la cita
            foreach($idServicios as $idServicio) {
                $args = [
                    'citaId' => $id,
                    'servicioId' => $idServicio
                ];
                $citaServicio = new CitaServicio($args);
                $citaServicio->guardar();
            }
            
            echo json_encode([
                'resultado' => $resultado,
                'mensaje' => 'Cita creada exitosamente',
                'citaId' => $id
            ]);
            
        } catch (Exception $e) {
            error_log("Error en APIController::guardar: " . $e->getMessage());
            echo json_encode([
                'resultado' => 'error', 
                'mensaje' => 'Error interno al procesar la reserva. Por favor, intente nuevamente.'
            ]);
        }
    }

    public static function eliminar(){
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Citas::find($id);
            $cita -> eliminar();
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }

    public static function obtenerBarberoPorUsuario($usuarioId) {
        $consulta = "SELECT id FROM barberos WHERE usuarioId = " . $usuarioId;
    }
}
?>