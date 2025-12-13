<h1 class="nombre-pagina">Olvidé mi contraseña</h1>
<p class="descripcion-pagina">Establece tu Contraseña escribiendo tu Correo electrónico a continuación</p>

<?php
        include_once __DIR__ . "/../templates/alertas.php";
?>

<form class="formulario" method="POST" action="/recuperar-cuenta">

    <div class="campo">
        <label for="email">Correo</label>
        <input type="email" placeholder="Tu Correo electrónico" id="correo" name="correo">
    </div>

    <input class="boton" type="submit" value="Enviar">

</form>


<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesión.</a>
    <a href="/sign-up">¿Aún no tienes una cuenta? Crear una.</a>
</div>