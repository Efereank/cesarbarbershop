
<?php
include_once __DIR__ . ("/../templates/barra.php");
include_once __DIR__ . ("/../templates/alertas.php");
?>

<h1 class="nombre-pagina">Actualizar</h1>

<p class="descripcion-pagina">Llena los siguientes campos para la modificación del servicio</p>


<form  method="POST" class="formulario">
    <?php include_once __DIR__ . ('/formulario.php'); ?>    

    <input type="submit" class="boton" value="Actualizar">
</form>