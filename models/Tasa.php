<?php 

// C:\Users\efere\projects\appsalon\models\Tasa.php

namespace Model;

class Tasa extends ActiveRecord {
    protected static $tabla = 'tasa';
    protected static $columnasDB = ['id', 'tasaBs', 'fecha_actualizacion'];

    public $id;
    public $tasaBs;
    public $fecha_actualizacion;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->tasaBs = $args['tasaBs'] ?? null;
        $this->fecha_actualizacion = $args['fecha_actualizacion'] ?? date('Y-m-d H:i:s');
    }

    public function validar() : array {
        
        $tasa = filter_var($this->tasaBs, FILTER_VALIDATE_FLOAT);
        
        if ($tasa === false || $tasa <= 0) {
            self::$alertas['error'][] = 'La Tasa de cambio es obligatoria y debe ser mayor a cero.';
        } else {
            
            $this->tasaBs = $tasa;
        }
        return self::$alertas;
    }

    public static function getTasaActual() : ?Tasa {
        $query = "SELECT * FROM " . static::$tabla . " ORDER BY id DESC LIMIT 1";
        $resultado = self::consultarSQL($query);
        return array_shift($resultado);
    }
}


?>