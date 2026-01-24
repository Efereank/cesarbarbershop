<?php
namespace Model;

class Barbero extends ActiveRecord {
    protected static $tabla = 'barberos';
    protected static $columnasDB = [
        'id', 'usuarioId', 'especialidad', 'telefono', 'estado'
    ];

    public $id;
    public $usuarioId;
    public $especialidad;
    public $telefono;
    public $estado;
    
    public $nombre;
    public $correo;
    public $telefono_usuario;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->usuarioId = $args['usuarioId'] ?? '';
        $this->especialidad = $args['especialidad'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->estado = $args['estado'] ?? 'activo';
        
        
        $this->nombre = $args['nombre'] ?? '';
        $this->correo = $args['correo'] ?? '';
        $this->telefono_usuario = $args['telefono_usuario'] ?? '';
    }

    // Validación
    public function validar() {
        if(!$this->especialidad) {
            self::$alertas['error'][] = 'La especialidad es obligatoria';
        }
        if(!$this->telefono) {
            self::$alertas['error'][] = 'El teléfono es obligatorio';
        }
        return self::$alertas;
    }

    // Obtener barberos activos con información del usuario
    public static function activos() {
        $query = "SELECT b.*, u.nombre, u.correo 
                FROM barberos b 
                INNER JOIN usuarios u ON b.usuarioId = u.id 
                WHERE b.estado = 'activo'";
        $resultado = self::consultarSQL($query);
        return $resultado;
    }

    // Obtener información completa del barbero
    public static function conUsuario($id) {
        $query = "SELECT b.*, u.nombre, u.correo, u.telefono as telefono_usuario
                FROM barberos b 
                INNER JOIN usuarios u ON b.usuarioId = u.id 
                WHERE b.id = {$id}";
        $resultado = self::consultarSQL($query);
        return array_shift($resultado);
    }

    // Buscar por usuarioId
    public static function porUsuario($usuarioId) {
        $query = "SELECT * FROM barberos WHERE usuarioId = {$usuarioId}";
        $resultado = self::consultarSQL($query);
        return array_shift($resultado);
    }


    
}