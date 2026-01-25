<?php

include_once __DIR__ . ("/../templates/barra.php");

?>


<div class="tasa">
    <p class="tasa-bolivar">Tasa Bolivar: <?= number_format($tasaBs, 2) ?> </p>
    <a class="boton" href="/servicios/tasa">Actualizar</a>
</div>


<h1 class="nombre-pagina">Panel Administración</h1>


    <div class="panel">
        <div class="ingresos">

        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
        >
        <path d="M17.1 8.648a.568 .568 0 0 1 -.761 .011a5.682 5.682 0 0 0 -3.659 -1.34c-1.102 0 -2.205 .363 -2.205 1.374c0 1.023 1.182 1.364 2.546 1.875c2.386 .796 4.363 1.796 4.363 4.137c0 2.545 -1.977 4.295 -5.204 4.488l-.295 1.364a.557 .557 0 0 1 -.546 .443h-2.034l-.102 -.011a.568 .568 0 0 1 -.432 -.67l.318 -1.444a7.432 7.432 0 0 1 -3.273 -1.784v-.011a.545 .545 0 0 1 0 -.773l1.137 -1.102c.214 -.2 .547 -.2 .761 0a5.495 5.495 0 0 0 3.852 1.5c1.478 0 2.466 -.625 2.466 -1.614c0 -.989 -1 -1.25 -2.886 -1.954c-2 -.716 -3.898 -1.728 -3.898 -4.091c0 -2.75 2.284 -4.091 4.989 -4.216l.284 -1.398a.545 .545 0 0 1 .545 -.432h2.023l.114 .012a.544 .544 0 0 1 .42 .647l-.307 1.557a8.528 8.528 0 0 1 2.818 1.58l.023 .022c.216 .228 .216 .569 0 .773l-1.057 1.057z" />
        </svg>



            <p class="panel-p">Ingreso Diario: $<span>
            <?php
                $ingresosDiarios = 0;
                foreach ($citas as $cita) {
                    $ingresosDiarios += $cita->precio;
                }
                echo $ingresosDiarios;
            ?>
            </span></p>
        </div>
        <div class="personas">

        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
        >
        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        <path d="M9 17v-4" />
        <path d="M12 17v-1" />
        <path d="M15 17v-2" />
        <path d="M12 17v-1" />
        </svg>


            <p class="panel-p">Total Citas:<span>
            <?php
            // Contar citas únicas por id
            $citasUnicas = [];
            foreach ($citas as $cita) {
                $citasUnicas[$cita->id] = true;
            }
            echo count($citasUnicas);
            ?>
            </span></p>
        </div>
    </div>

    <h2>Buscar Citas</h2>

    <div class="busquedad"></div>
        <form class="formulario">
            <div class="campo">
            <label for="fecha">Fecha</label>
            <input type="date" id="fecha" name="fecha" value="<?php echo $fecha; ?>">
    </div>
        </form>


        <?php
            if (count($citas) === 0 ) {
                echo "<h2> No hay citas en esta fecha </h2>";
            }
        ?>
<div id="citas-admin">
    <ul class="citas"> 
<?php
$idCita = 0;
$total = 0; 
$totalDuracion = 0;

foreach ($citas as $key => $cita) {
    $proximo_id = $citas[$key + 1]->id ?? 0;


    if ($idCita !== $cita->id) {
        $total = 0; 
        $totalDuracion = 0;
?>
        <li>
            <h3>Cita</h3>

            <p>Hora: <span> <?php echo substr($cita->hora, 0, 5); ?></span> </p>
            <p>Cliente: <span> <?php echo $cita->cliente ?> </span> </p>
            <p>Correo: <span> <?php echo $cita->correo ?> </span> </p>
            <p>Telefono<span> <?php echo $cita->telefono ?> </span> </p>

            
                
            

        
            <h3> servicios </h3>
<?php 
        $idCita = $cita->id;
    } 

    $tasaBolivar = number_format($tasaBs, 2);
    $total += $cita->precio;
    $precioBs = $total * $tasaBolivar;
    $totalDuracion += $cita->duracion;

?>
    <p class="servicio"><?php echo $cita->servicio . ":  $" . $cita->precio; ?></p> 

    

<?php

    if ($idCita !== $proximo_id) { 
        // Calcular hora de fin aquí, cuando ya tenemos $totalDuracion
        $horaInicio = $cita->hora;
        $horaFin = date('H:i', strtotime($horaInicio) + ($totalDuracion * 60));
?>
        <li>
        <p>Barbero <span> <?php echo !empty($cita->barbero) ? $cita->barbero : 'Sin asignar'; ?>  </span></p>
        <p class="total">Horario: <span><?php echo substr($horaInicio, 0, 5); ?> - <?php echo substr($horaFin, 0, 5); ?></span></p>
        <p class="total">Total: <span>$<?php echo $total; ?></span></p>
        <p class="total">Total Bolivares: <span> <?php echo $precioBs; ?> Bs</span></p>

        </li>   
            <form action="/api/eliminar" method="POST">
            <input type="hidden" name="id" value="<?php echo $cita->id; ?>">
            <button class="boton-eliminar" type="submit" value="eliminar">Eliminar</button>
            </form>
        </li> 
        
        <?php } } // FIN DE FOREACH ?>
    </ul>
</div>

<?php 

    $script = "
    <script src='build/js/buscador.js'></script>
    <script src='build/js/barra.js'></script>
    ";
?>
