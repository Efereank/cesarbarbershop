<?php 

namespace Model;

class AdminCita extends ActiveRecord{
    protected static $tabla = 'citasServicios';
    protected static $columnasDB = ['id','hora', 'cliente', 'correo','telefono', 'servicio', 'precio','duracion','barbero','confirmada'];

    public $id;
    public $hora;
    public $cliente;
    public $correo;
    public $telefono;
    public $servicio;

    public $barbero;

    public $precio;
    public $duracion;
    public $confirmada;


    public function __construct($args = [] ){
        $this->id = $args['id'] ?? null;
        $this-> hora = $args['hora'] ?? '';
        $this-> cliente = $args['cliente'] ?? '';
        $this-> correo = $args['correo'] ?? '';
        $this-> telefono = $args['telefono'] ?? '';
        $this-> servicio = $args['servicio'] ?? '';
        $this-> precio = $args['precio'] ?? '';
        $this-> duracion = $args['duracion'] ?? '';
        $this-> barbero = $args['barbero'] ?? '';
        $this-> confirmada = $args['confirmada'] ?? '';
    }
    
}

?>