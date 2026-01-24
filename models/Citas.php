<?php
namespace Model;

class Citas extends ActiveRecord {
    protected static $tabla = 'citas';
    protected static $columnasDB = [
        'id', 'fecha', 'hora', 'usuarioId', 'confirmada', 
        'hora_fin', 'duracion', 'barberoId'
    ];

    public $id;
    public $fecha;
    public $hora;
    public $usuarioId;
    public $confirmada;
    public $hora_fin;
    public $duracion;  
    public $barberoId;  

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->fecha = $args['fecha'] ?? '';
        $this->hora = $args['hora'] ?? '';
        $this->usuarioId = $args['usuarioId'] ?? '';
        $this->confirmada = $args['confirmada'] ?? 0;
        $this->hora_fin = $args['hora_fin'] ?? '';
        $this->duracion = $args['duracion'] ?? 30; 
        $this->barberoId = $args['barberoId'] ?? null; 
    }


public static function obtenerCitasSolapadas($fecha, $horaInicio, $horaFin, $idExcluir = null, $barberoId = null) {

    $fechaEsc = addslashes($fecha);
    $horaInicioEsc = addslashes($horaInicio);
    $horaFinEsc = addslashes($horaFin);

    $query = "SELECT * FROM " . static::$tabla . "
                WHERE fecha = '$fechaEsc'
                AND hora < '$horaFinEsc'
                AND hora_fin IS NOT NULL
                AND hora_fin > '$horaInicioEsc'";

    if ($idExcluir) {
        $idExcluir = (int) $idExcluir;
        $query .= " AND id != $idExcluir";
    }

    if ($barberoId) {
        $barberoId = (int) $barberoId;
        $query .= " AND barberoId = $barberoId";
    }

    $query .= " ORDER BY hora";

    return self::consultarSQL($query);
}
    /**
     * Calcula la hora_fin según la duración del servicio
     */

public function calcularHoraFin($duracionMinutos) {
    if (empty($this->hora)) {
        return '';
    }

    $hora = $this->hora;
    
    
    if (strlen($hora) === 5) {
        $hora .= ':00';
    }
    
    $horaDateTime = \DateTime::createFromFormat('H:i:s', $hora);
    if ($horaDateTime === false) {
        // Intentar con formato diferente si falla
        $horaDateTime = \DateTime::createFromFormat('H:i', $this->hora);
        if ($horaDateTime === false) {
            return '';
        }
    }
    $horaDateTime->modify("+{$duracionMinutos} minutes");
    return $horaDateTime->format('H:i:s'); 
}

public static function obtenerCitasSolapadasConLock($fecha, $horaInicio, $horaFin, $citaId = null, $barberoId = null) {
    // Asegurar formato de hora
    if (strlen($horaInicio) === 5) $horaInicio .= ':00';
    if (strlen($horaFin) === 5) $horaFin .= ':00';

    $where = "fecha = '{$fecha}' AND (
        (hora < '{$horaFin}' AND hora_fin > '{$horaInicio}') OR
        (hora_fin > '{$horaInicio}' AND hora < '{$horaFin}') OR
        (hora <= '{$horaInicio}' AND hora_fin >= '{$horaFin}')
    )";

    if ($citaId) {
        $where .= " AND id != {$citaId}";
    }

    if ($barberoId) {
        $where .= " AND barberoId = {$barberoId}";
    }

    // Usar LOCK para prevenir condiciones de carrera
    $query = "SELECT * FROM citas WHERE {$where} FOR UPDATE";
    
    $resultado = self::SQL($query);
    return $resultado;
}

}


