<h1 class="nombre-pagina">Cesar's BarbershSSop</h1>
<p class="descripcion-pagina-login">Iniciar Sesión</p>

<?php
        include_once __DIR__ . "/../templates/alertas.php";
?>

<form class="formulario" method="POST" action="/">

<div class="campo-login">
        <label for="email"></label>
        <input type="email" id="correo" placeholder="Tu Correo electrónico" name="correo" value="<?php echo s($auth->correo); ?>">
</div>



<div class="campo-login">
        <label for="password"></label>
        <input type="password" id="password" placeholder="Tu Contraseña" name="password">
</div>


<input class="boton" type="submit" value="Entrar">

</form>

<div class="acciones">
    <a href="/sign-up">¿Aún no tienes una cuenta? Crear una.</a>
    <a href="/recuperar-cuenta">¿Olvidaste tu Contraseña?</a>
</div>