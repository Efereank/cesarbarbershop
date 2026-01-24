<?php

include_once __DIR__ . ("/../templates/alertas.php");

?>

    <h2 class="nombre-pagina">Tasa del Bolívar</h2>
    <p class="descripcion-pagina"> Actualice el tipo de cambio actual</p>


<form method="POST">
    <div class="campo">
        <label for="tasaBs">Tasa Bs:</label>
        <input 
            type="number" 
            id="tasaBs" 
            name="tasaBs" 
            placeholder="Tasa Actual" 
            value="<?php echo $tasaBs; ?>"
            step="0.0001" 
            min="0.0001"
            required
        >
    </div>
    <input class="boton" type="submit" value="Guardar">
</form>