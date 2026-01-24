<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;



class LoginController{


    public static function login(Router $router) {

        $alertas = [];

        $auth = new Usuario();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);

            $alertas = $auth -> validarLogin();

            if (empty($alertas)) {
                $usuario = Usuario::where('correo', $auth->correo);

                if ($usuario) {
                    //verificar el password
                    if($usuario->comprobarPasswordAndVerificado($auth->password)){
                        // autenticar el usuario
                        isSession();

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido;
                        $_SESSION['correo'] = $usuario->correo;
                        $_SESSION['login'] = true;


            // redireccionamiento por rolId
            if ($usuario->rolId == 1) { // Admin
                $_SESSION['admin'] = true;
                $_SESSION['rol'] = 'admin';
                header('Location: /admin');
                exit;
            } else if ($usuario->rolId == 2) { // Barbero
                $_SESSION['barbero'] = true;
                $_SESSION['rol'] = 'barbero';
                header('Location: /barbero');
                exit;
            } else { // Cliente
                $_SESSION['cliente'] = true;
                $_SESSION['rol'] = 'cliente';
                header('Location: /citas');
                exit;
            }      
                    }
                }else {
                    Usuario::setAlerta('error','Usuario No Encontrado');
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/login', [
            'alertas' => $alertas,
            'auth' => $auth
        ]);
    }


    public static function logout() {
        session_start();

        $_SESSION = [];

        header('location: /');
    }


    public static function recuperarCuenta(Router $router) {

        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth -> validarCorreo();

            if (empty($alertas)) {
                $usuario = Usuario::where('correo', $auth->correo);

                if ($usuario && $usuario->confirmado === "1") {

                    // generar token
                    $usuario->crearToken();
                    $usuario->guardar();

                    //  GENERAR EMAIL

                    $email = new Email($usuario->correo, $usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();

                    // ALERTA EXITO
                    Usuario::setAlerta('exito','Revisa tu correo electrónico');

                }else{
                    // ALERTA ERROR
                    Usuario::setAlerta('error','El usuario no existe o no está confirmado');
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/recuperar-cuenta', [
            'alertas' => $alertas
        ]);
    }

    public static function reestablecerCuenta(Router $router) {

        $alertas = [];
        $error = false;

        $token = s($_GET['token']);

        //buscar usuario por su token
        $usuario = Usuario::where('token', $token);

        if (empty($usuario)) {
            Usuario::setAlerta('error','Token no válido');
            $error = true;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // leer el nuevo password y guardarlo

            $password = new Usuario($_POST);
            $alertas = $password -> validarPassword();

            if (empty($alertas)) {
                $usuario-> password = null;
                
                $usuario-> password = $password -> password;
                $usuario->hashPassword();
                $usuario->token = null;

                $resultado = $usuario -> guardar();

                if($resultado) {
                    // Crear mensaje de exito
                    Usuario::setAlerta('exito', 'Password Actualizado Correctamente');
                                    
                    // Redireccionar al login tras 3 segundos
                    header('Refresh: 2; url=/');
                }

            }

        }


        $alertas= Usuario::getAlertas();
        $router -> render('auth/reestablecer-cuenta', [
            'alertas' => $alertas,
            'error' => $error
        ]);
    }

    public static function crearCuenta(Router $router) {
        $usuario = new Usuario;

        //alertas vacias
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            // ✅ VALIDACIÓN ADICIONAL PARA NOMBRE Y APELLIDO
            if (empty($alertas)) {
                // Validar que nombre solo contenga letras, espacios y acentos
                if (!preg_match('/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/', $usuario->nombre)) {
                    Usuario::setAlerta('error', 'El nombre solo puede contener letras y espacios');
                    $alertas = Usuario::getAlertas();
                }
                
                // Validar que apellido solo contenga letras, espacios y acentos
                if (!preg_match('/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/', $usuario->apellido)) {
                    Usuario::setAlerta('error', 'El apellido solo puede contener letras y espacios');
                    $alertas = Usuario::getAlertas();
                }
                
                // Validar que nombre y apellido no sean solo espacios
                if (trim($usuario->nombre) === '') {
                    Usuario::setAlerta('error', 'El nombre no puede estar vacío');
                    $alertas = Usuario::getAlertas();
                }
                
                if (trim($usuario->apellido) === '') {
                    Usuario::setAlerta('error', 'El apellido no puede estar vacío');
                    $alertas = Usuario::getAlertas();
                }
                
                // Validar formato del teléfono (11 dígitos)
                if (!preg_match('/^[0-9]{11}$/', $usuario->telefono)) {
                    Usuario::setAlerta('error', 'El teléfono debe tener exactamente 11 dígitos numéricos');
                    $alertas = Usuario::getAlertas();
                }
                
                // ✅ LIMPIAR Y FORMATEAR LOS DATOS
                if (empty($alertas)) {
                    // Limpiar espacios extras
                    $usuario->nombre = preg_replace('/\s+/', ' ', trim($usuario->nombre));
                    $usuario->apellido = preg_replace('/\s+/', ' ', trim($usuario->apellido));
                    
                    // Capitalizar nombre y apellido (primera letra de cada palabra en mayúscula)
                    $usuario->nombre = ucwords(mb_strtolower($usuario->nombre, 'UTF-8'));
                    $usuario->apellido = ucwords(mb_strtolower($usuario->apellido, 'UTF-8'));
                }
            }

            // revisar que alertas esté vacio
            if (empty($alertas)) {

                // verificar que el usuario no esta registrado
                $resultado = $usuario-> existeUsuario();

                if ($resultado->num_rows) {
                    $alertas = Usuario::getAlertas();
                } else {

                    // Hashear el password
                    $usuario->hashPassword();


                    // Generar un token unico
                    $usuario->crearToken();

                    // Enviar el email
                    $email = new Email($usuario->correo,$usuario->nombre ,$usuario->token);
                    $email->enviarConfirmacion();

                    // crear el usuario
                    $resultado = $usuario-> guardar();
                    if ($resultado) {

                        header('location: /mensaje');
                    }
                  //  debuguear($usuario);
                }
            }
        }
                
        $router->render('auth/sign-up', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }


    public static function mensaje(Router $router) {
        $router->render('auth/mensaje');
    }


    public static function confirmar (Router $router) {
        $alertas = [];
 
        //sanitizar y leer token desde la url
        $token = s($_GET['token']);
 
        $usuario = Usuario::where('token', $token);
 
        if(empty($usuario) || $usuario->token === '') {
 
            //mostrar mensaje de error
            Usuario::setAlerta('error', 'Token no válido...');
 
        }else {
 
            //cambiar valor de columna confirmado
            $usuario->confirmado = '1';
            //eliminar token
            $usuario->token = '';
            //Guardar y Actualizar 
            $usuario->guardar();
            //mostrar mensaje de exito
            Usuario::setAlerta('exito', 'Tu cuenta ha sido verificada con éxito');
        }
 
        $alertas = Usuario::getAlertas();
        $router->render('auth/confirmar-cuenta', [
            'alertas'=>$alertas
        ]);
    }
}