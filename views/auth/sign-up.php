<h1 class="nombre-pagina">Sign-up</h1>
<p class="descripcion-pagina">Llena los siguientes campos para crear una cuenta</p>

<?php include_once __DIR__ . "/../templates/alertas.php"; ?>

<form class="formulario" method="POST" action="/sign-up" id="formulario-signup" novalidate>

<div class="campo">
    <label for="nombre">Nombre</label>
    <input 
        type="text" 
        id="nombre" 
        placeholder="Tu Nombre" 
        name="nombre" 
        value="<?php echo s($usuario->nombre) ?>"
        pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
        title="Solo se permiten letras y espacios entre nombres"
        required
        oninput="validarCampoLetras(this, 'nombre')"
    >
    <small class="mensaje-error" id="error-nombre"></small>
</div>

<div class="campo">
    <label for="apellido">Apellido</label>
    <input 
        type="text" 
        id="apellido" 
        placeholder="Tu Apellido" 
        name="apellido" 
        value="<?php echo s($usuario->apellido) ?>"
        pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
        title="Solo se permiten letras y espacios entre apellidos"
        required
        oninput="validarCampoLetras(this, 'apellido')"
    >
    <small class="mensaje-error" id="error-apellido"></small>
</div>

<div class="campo">
    <label for="telefono">Teléfono</label>
    <input 
        type="tel" 
        id="telefono" 
        placeholder="Ej: 04121234567" 
        name="telefono" 
        value="<?php echo s($usuario->telefono) ?>"
        pattern="^[0-9]{11}$"
        title="Debe tener exactamente 11 dígitos numéricos"
        required
        oninput="validarTelefono(this)"
    >
    <small class="mensaje-error" id="error-telefono"></small>
</div>

<div class="campo">
    <label for="correo">Correo</label>
    <input 
        type="email" 
        id="correo" 
        placeholder="Tu Correo electrónico" 
        name="correo" 
        value="<?php echo s($usuario->correo) ?>"
        required
    >
</div>

<div class="campo">
    <label for="password">Contraseña</label>
    <input 
        type="password" 
        id="password" 
        placeholder="Tu Contraseña (mínimo 6 caracteres)" 
        name="password"
        minlength="6"
        required
    >
</div>

<input class="boton" type="submit" value="Crear Cuenta" id="btn-submit">

</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesión.</a>
    <a href="/recuperar-cuenta">¿Olvidaste tu Contraseña?</a>
</div>

<?php 

    $script = "

    <script src='build/js/formulario.js'></script>
    ";
?>

