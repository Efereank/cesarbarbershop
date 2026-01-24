<?php

include_once __DIR__ . ("/../templates/barra.php");
include_once __DIR__ . ("/../templates/alertas.php");

?>


<h1 class="nombre-pagina">Crear Nuevo Servicio</h1>
<p class="descripcion-pagina">Administración de Servicios</p>


<form action="/servicios/crear" method="POST" class="formulario">
    <?php include_once __DIR__ . ('/formulario.php'); ?>    
        <p>Por defecto: 30 Minutos</p>

    <input type="submit" class="boton" value="Guardar Servicio">
</form>
