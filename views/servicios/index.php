<?php

include_once __DIR__ . ("/../templates/barra.php");

?>


<h1 class="nombre-pagina"> Panel de Servicios</h1>
<p class="descripcion-pagina">Administración de Servicios</p>

<a class="boton" href="/servicios/crear">Crear Servicio</a>

<ul class="ser">
<?php 
    $tasa = (isset($tasaBs) && is_numeric($tasaBs) && $tasaBs > 0) ? (float)$tasaBs : 1.0; 

    foreach ($servicios as $servicio) { 
        // 1. Validar y formatear el precio en USD
        $precio_usd = is_numeric($servicio->precio) ? (float)$servicio->precio : 0;
        $precio_usd_formateado = number_format($precio_usd, 2);

        // 2. Calcular y formatear el precio en Bs.
        if ($precio_usd > 0) {
            $precio_bs = $precio_usd * $tasa;
            $precio_bs_formateado = number_format($precio_bs, );
        } else {
            $precio_bs_formateado = '0.00';
        }
?>
    <li>
        <p>Nombre: <span><?php echo $servicio->nombre; ?></span></p>
        
        <p>Precio: <span>$<?php echo $precio_usd_formateado; ?></span></p>
        
        <p>Precio en Bs: <span>Bs. <?php echo $precio_bs_formateado; ?></span></p>

        <p>Duración del Servicio: <span> <?php echo $servicio->duracion; ?> Minutos</span></p>

        <div class="acciones-servicios">
            <a class="boton" href="/servicios/actualizar?id=<?php echo $servicio->id;?>">Actualizar</a>
                        
            <form action="/servicios/eliminar" method="POST" >
                <input type="hidden" name="id" value="<?php echo $servicio->id; ?>">
                <input type="submit" value="Borrar" class="boton-eliminar">
            </form>
        </div>
    </li>
<?php } ?>
</ul>

