<h1 class="nombre-pagina">Reestablecer contraseña</h1>
<p class="descripcion-pagina">Coloca tu nueva contraseña a continuación:</p>

<?php
        include_once __DIR__ . "/../templates/alertas.php";
?>

<?php
        if ($error) {
            return null;
        }
?>

<form class="formulario" method="POST">

    <div class="campo-login">
        <label for="password"></label>
        <input type="password" id="password" name="password" placeholder="Tu nueva contraseña">
    </div>

    <input type="submit" class="boton" value="Reestablecer">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes cuenta? Inicia Sesión.</a>
    <a href="/crear-cuenta">¿Aún no tienes cuenta? Obtener una.</a>
</div>