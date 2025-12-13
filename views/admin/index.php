<?php

include_once __DIR__ . ("/../templates/barra.php");

?>


<div class="tasa">
    <p class="tasa-bolivar">Tasa Bolivar: <?= number_format($tasaBs, 2) ?> </p>
    <a class="boton" href="/servicios/tasa">Actualizar</a>
</div>


<h1 class="nombre-pagina">Panel de Administración</h1>


    <div class="panel">
        <div class="ingresos">
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
