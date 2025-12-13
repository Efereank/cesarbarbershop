
<?php
include_once __DIR__ . ("/../../templates/barra.php");

?>

<h1 class="nombre-pagina">Actualizar</h1>

<p class="descripcion-pagina">Llena los siguientes campos para la modificación del Barbero</p>


<form method="POST" class="formulario">
    <div class="campo">
        <label for="correo">Correo</label>
        <input 
            type="email" 
            id="correo" 
            name="correo" 
            placeholder="correo@ejemplo.com"
            value=""
            required
        >
    </div>

    <div class="campo">
        <label for="especialidad">Especialidad</label>
        <input 
            type="text" 
            id="especialidad" 
            name="especialidad" 
            placeholder="Ej: Corte clásico, Barba, Tinte, etc." 
            required
        >
    </div>

    <div class="campo">
        <label for="telefono">Teléfono</label>
        <input 
            type="tel" 
            id="telefono" 
            name="telefono" 
            placeholder="Ej: 0412-5555555" 
            required
        >
    </div>
        <input type="submit" class="boton" value="Actualizar">
        <a href="/admin/barberos" class="boton-eliminar">Cancelar</a>
</form>