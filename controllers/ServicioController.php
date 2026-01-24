<?php 

namespace Controllers;

use Model\Servicio;
use Model\Tasa;
use MVC\Router;

class ServicioController{
    public static function index(Router $router){
        isSession();
        isAdmin();

        $servicio = Servicio::all();


    $tasaObj = Tasa::getTasaActual();
    

    $tasaBs = 1.0; 
    if ($tasaObj && is_numeric($tasaObj->tasaBs) && $tasaObj->tasaBs > 0) {
        $tasaBs = (float)$tasaObj->tasaBs; 
    }

    $router->render('servicios/index', [
        'nombre' => $_SESSION['nombre'],
        'servicios' => $servicio,
        'tasaBs' => $tasaBs
    ]);
}



    public static function crear(Router $router){
            isSession();
            isAdmin();

        $servicio = new Servicio;
        $alertas = [];
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $servicio -> sincronizar($_POST);

            $alertas = $servicio->validar();

            if (empty($alertas)) {
                $servicio->guardar();
                header('Location: /servicios');
            }
        }

        $router->render('/servicios/crear',[
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }




    public static function actualizar(Router $router){
        isSession();
        isAdmin();

        if(!is_numeric($_GET['id'])) return;
        $servicio = Servicio::find($_GET['id']);
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $servicio-> sincronizar($_POST);

            $alertas = $servicio->validar();


            if (empty($alertas)) {
                $servicio->guardar();
                header('Location: /servicios');
            }
        }

        $router->render('servicios/actualizar',[
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }
    
    public static function eliminar(){
        isSession();
        isAdmin();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $servicio = Servicio::find($id);
            $servicio -> eliminar();
            header('Location: /servicios');
        }
    }


public static function tasa(Router $router) {
    isSession();
    isAdmin();

    $alertas = [];
    $tasaObj = Tasa::getTasaActual(); 

    if (!$tasaObj) {
        $tasaObj = new Tasa();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $tasaObj->sincronizar($_POST);
        
        
        $alertas = $tasaObj->validar();

        if (empty($alertas)) {
            $tasaObj->fecha_actualizacion = date('Y-m-d H:i:s');
            
            // Guardar en la base de datos
            $resultado = $tasaObj->guardar();
            
            if ($resultado) {
                header('Location: /admin');
                return;
            } else {
                $alertas['error'][] = 'Error al guardar la tasa en la base de datos';
            }
        }
    }

    
    $tasaBs = 1.0;
    if ($tasaObj && is_numeric($tasaObj->tasaBs) && $tasaObj->tasaBs > 0) {
        $tasaBs = (float)$tasaObj->tasaBs;
    }

    $router->render('servicios/tasa', [
        "nombre" => $_SESSION['nombre'],
        'alertas' => $alertas,
        'tasaBs' => $tasaBs,
        'tasa' => $tasaObj 
    ]);
}



public static function obtenerServicios() {
    $servicios = Servicio::all();
    

    
    header('Content-Type: application/json');
    echo json_encode($servicios);
}


}

?>