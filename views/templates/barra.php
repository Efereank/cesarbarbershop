

<div class="logout">
        <a href="/logout">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                >
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M9 12h12l-3 -3" />
                <path d="M18 15l3 -3" />
            </svg>
            <p>Cerrar Sesión</p>
        </a>
</div>




<?php 
        $esAdmin = (isset($_SESSION['admin']) && $_SESSION['admin'] === true) || 
        (isset($_SESSION['admin']) && $_SESSION['admin'] === "1");

        $esBarbero = (isset($_SESSION['barbero']) && $_SESSION['barbero'] === true) || 
        (isset($_SESSION['barbero']) && $_SESSION['barbero'] === "1"); 
?>


<?php if($esAdmin ||  $esBarbero){ ?>

    <div class="mobile-menu">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        stroke-width="2.25"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mobile-menu-icon"
    >
        <path d="M4 6l16 0" />
        <path d="M4 12l16 0" />
        <path d="M4 18l16 0" />
    </svg>
</div>

<?php }?>


<div class="mobile-menu-content">
<?php
if ($esAdmin) { ?>
    <div class="barra-servicios">
        <a class="boton" href="/admin">Ver citas</a>
        <a class="boton" href="/servicios">Ver Servicios</a>
        <a href="/admin/barberos" class="boton">Ver Barberos</a>
        <a class="boton" href="/citas">Panel Clientes</a>
    </div>

<?php } elseif($esBarbero) {?>
    <a class="boton" href="/barbero">Ver Citas</a>
<?php } ?>

</div>

    <div class="barra">
        <p>Hola: <?php echo $nombre ?? ''; ?></p>
    </div>

<?php 

    $script = "
    <script src='build/js/barra.js'></script>
    ";
?>