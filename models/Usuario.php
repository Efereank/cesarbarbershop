<?php

namespace Model;

class Usuario extends ActiveRecord {
    // Base de datos
    protected static $tabla = 'usuarios';

    protected static $columnasDB = ['id', 'nombre', 'apellido', 'telefono', 'correo', 'password', 'admin', 'confirmado', 'token','rolId'];

    public $id;
    public $nombre;
    public $apellido;
    public $telefono;
    public $correo;
    public $password;
    public $admin;
    public $confirmado;
    public $token;
    public $rolId;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido = $args['apellido'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->correo = $args['correo'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->admin = $args['admin'] ?? 0;
        $this->confirmado = $args['confirmado'] ?? 0;
        $this->token = $args['token'] ?? '';
        $this->rolId = $args['rolId'] ?? 3;
    }


        // Métodos para verificar roles
    public function esAdmin() {
        return $this->rolId == 1;
    }

    public function esBarbero() {
        return $this->rolId == 2;
    }

    public function esCliente() {
        return $this->rolId == 3;
    }

    public function validarNuevaCuenta(){
        if (!$this->nombre) {
            self::$alertas['error'][] = 'El nombre es obligatorio';
        }
        if (!$this->apellido) {
            self::$alertas['error'][] = 'El apellido es obligatorio';
        }
        if (!$this->correo) {
            self::$alertas['error'][] = 'El correo es obligatorio';
        }
        if (!$this->password) {
            self::$alertas['error'][] = 'La contraseña es obligatoria';
        }
        if(strlen( $this->password) < 6){
            self::$alertas['error'][] = 'La contraseña debe contener al menos 6 caracteres';
        }
        return self::$alertas;
    }

    //Validar el correo
    public function validarCorreo(){

    if (!$this->correo) {
    self::$alertas['error'][] = 'El correo es obligatorio';
    }
    return self::$alertas;
    }


    //Validar contraseña
    public function validarPassword(){
    
        if (!$this->password) {
        self::$alertas['error'][] = 'La contraseña es obligatoria';
        }

        if (strlen($this->password) < 6) {
            self::$alertas['error'][] = 'La contraseña debe contener al menos 6 caracteres';
        }

        return self::$alertas;
    }



        public function validarLogin(){
            if (!$this->correo) {
                self::$alertas['error'][] = 'El correo es obligatorio';
            }
            if (!$this->password) {
                self::$alertas['error'][] = 'La contraseña es obligatoria';
            }

            return self::$alertas;
        }



    //revisa si el usuario existe
    public function existeUsuario(){
        $query = ' SELECT * FROM ' . self::$tabla . " WHERE correo = '" . $this->correo . "' LIMIT  1";

        $resultado = self::$db->query($query);

        if ($resultado->num_rows) {
            self::$alertas['error'][] = 'El usuario ya está registrado';
        }

        return $resultado;
    }



    public function hashPassword(){
        $this->password = password_hash($this->password, PASSWORD_BCRYPT );
    }


    public function crearToken(){
        $this->token = uniqid();
    }

    public function comprobarPasswordAndVerificado($password){
        $resultado = password_verify($password, $this->password);

        if (!$resultado || !$this->confirmado) {
            self::$alertas['error'][]="La contraseña es incorrecta o tu cuenta no ha sido confirmada";
            return false;
        } else {
            return true;
        }
        
    }
} 