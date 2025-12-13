<?php
// Comprueba que $alertas es un array (por si acaso) y que no está vacío
if (is_array($alertas) && !empty($alertas)) { 
    // Recorre cada tipo de alerta (ej: 'error', 'exito')
    foreach ($alertas as $key => $mensajes) {
        // Recorre cada mensaje dentro de ese tipo
        foreach ($mensajes as $mensaje) {
?>
            <div class="alerta <?php echo$key; ?>">
                <?php echo s($mensaje); ?>
            </div>
<?php
        }
    }
}
?>