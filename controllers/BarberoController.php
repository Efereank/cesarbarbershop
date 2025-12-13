<?php
namespace Controllers;

use Model\Barbero;
use Model\Usuario;
use MVC\Router;

class BarberoController {
    
    public static function index(Router $router) {
        isAdmin();
        
        // Obtener barberos con información de usuario
        $barberos = Barbero::activos();
        
        $router->render('admin/barberos/index', [
            'barberos' => $barberos,
            'nombre' => $_SESSION['nombre'],
            'alertas' => Barbero::getAlertas()
        ]);
    }

public static function crear(Router $router) {
    isAdmin();
    $alertas = [];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Buscar usuario por email - asegurar que sea instancia de Usuario
        $resultado = Usuario::where('correo', $_POST['correo']);
        $usuario = is_array($resultado) ? array_shift($resultado) : $resultado;
        
        if (!$usuario || !($usuario instanceof Usuario)) {
            $alertas['error'][] = 'No existe un usuario con ese correo electrónico';
        } else {
            // Verificar si ya es barbero
            $barberoExistente = Barbero::where('usuarioId', $usuario->id);
            $barberoExistente = is_array($barberoExistente) ? array_shift($barberoExistente) : $barberoExistente;
            
            if ($barberoExistente) {
                $alertas['error'][] = 'Este usuario ya está registrado como barbero';
            } else {
                // Crear barbero
                $barbero = new Barbero([
                    'usuarioId' => $usuario->id,
                    'especialidad' => $_POST['especialidad'],
                    'telefono' => $_POST['telefono'],
                    'estado' => 'activo'
                ]);
                
                // Cambiar rol del usuario a barbero
                $usuario->rolId = 2; 
                $usuario->guardar();
                
                $barbero->guardar();
                $alertas['exito'][] = 'Barbero agregado correctamente';
            }
        }
    }
    
    $router->render('admin/barberos/crear', [
        'alertas' => $alertas,
        'nombre' => $_SESSION['nombre']
    ]);
}

        public static function actualizar(Router $router){
        isSession();
        isAdmin();

        if(!is_numeric($_GET['id'])) return;
        $barberos = Barbero::find($_GET['id']);
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $barberos-> sincronizar($_POST);

            $alertas = $barberos->validar();


            if (empty($alertas)) {
                $barberos->guardar();
                header('Location: /servicios');
            }
        }

        $router->render('admin/barberos/actualizar',[
            'nombre' => $_SESSION['nombre'],
            'barberos' => $barberos,
            'alertas' => $alertas
        ]);
    }
        
    
public static function eliminar() {
    isAdmin();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = $_POST['id'];
        
        // Buscar barbero
        $resultadosBarbero = Barbero::find($id);
        $barbero = is_array($resultadosBarbero) && !empty($resultadosBarbero) ? array_shift($resultadosBarbero) : $resultadosBarbero;
        
        if ($barbero && $barbero instanceof Barbero) {
            
            $resultadosUsuario = Usuario::find($barbero->usuarioId);
            $usuario = is_array($resultadosUsuario) && !empty($resultadosUsuario) ? array_shift($resultadosUsuario) : $resultadosUsuario;
            
            if ($usuario && $usuario instanceof Usuario) {
                $usuario->rolId = 3; // 3 = cliente
                $usuario->guardar();
            }
            
            $barbero->eliminar();
        }
        
        header('Location: /admin/barberos');
    }
}
}