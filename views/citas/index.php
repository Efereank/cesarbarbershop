<?php

include_once __DIR__ . '/../templates/barra.php';
?>



<h1 class="nombre-pagina">Nueva cita</h1>
<p class="descripcion-pagina"> Elige tus servicios y coloca tus datos:</p>


<div id="app">

    <nav class="tabs">
        <button type="button" class="actual" data-paso="1">Servicios</button>
        <button type="button" data-paso="2">Informacion Citas</button>
        <button type="button" data-paso="3">Resumen</button>
    </nav>

    <div id="paso-1" class="seccion">
        <h2>Servicios</h2>
        <p class="text-center">Elige tus servicios a continuación:</p>
        <div id="servicio" class="listado-servicios"></div>
    </div> 

    <div id="paso-2" class="seccion">
        <h2>Tus datos y cita</h2>
        <p class="text-center">Coloca tus datos y la fecha de tu cita:</p>

        <form class="formulario">
            <div class="campo-login">
                <label for="nombre"></label>
                <input type="text" name="nombre" placeholder="tu nombre" id="nombre" value="<?php echo $nombre; ?>" disabled>
            </div>

            <div class="campo">
                <label for="fecha">Fecha</label>
                <input type="date" id="fecha" min="<?php echo date('Y-m-d'); ?>">
            </div>

            <div class="campo">
                <label for="barberoId">Barbero:</label>
                <select id="barberoId" name="hora" required>
                    <option value="">Selecciona un barbero</option>
                </select>
            </div>

            <div class="campo">
                <label for="hora">Hora</label>
                <select id="hora" name="hora" required>
                    <option value="">Selecciona una hora</option>
                </select>
            </div>



            <input type="hidden" id="id" name="id" value="<?php echo $id ?>">
        </form>
    </div>  

    <div id="paso-3" class="seccion contenido-resumen">

        <h2>Resumen</h2>
        <p>Verifica que la información sea correcta</p>
    </div>


    <div class="paginacion">
        <button id="anterior" class="boton">&laquo; Anterior</button>
        <button id="siguiente" class="boton"> Siguiente &raquo;</button>

    </div>
</div>


<footer class="footer-total">
    <div class="total-info">
        <span class="total-label">Total seleccionado:</span>
        <span class="total-precio">$0.00</span>
    </div>
    <div class="total-acciones">
        <span id="total-servicios">0 servicios seleccionados</span>
    </div>
</footer>


<?php 

    $script = "

    <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
    <script src='build/js/app.js'></script>
    <script src='build/js/footer.js'></script>
    <script src='build/js/barra.js'></script>
    ";
?>