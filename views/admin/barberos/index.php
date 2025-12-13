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

<div class="barra-servicios">
        <a class="boton" href="/admin">Ver citas</a>
        <a class="boton" href="/servicios">Ver Servicios</a>
        <a class="boton" href="/citas">Panel Clientes</a>
</div>


<h1 class="nombre-pagina">Panel de Barberos</h1>
<p class="descripcion-pagina">Administración de Barberos</p>

<a class="boton" href="/admin/barberos/crear">Crear Barbero</a>

<ul class="ser">
<?php 
    if(empty($barberos)): 
?>
    <li style="text-align: center; color: var(--gris); font-style: italic;">
        No hay barberos registrados en el sistema
    </li>
<?php 
    else: 
        foreach ($barberos as $barbero) { 
?>
    <li>
        <p>Nombre: <span><?php echo $barbero->nombre ?? 'Sin nombre'; ?></span></p>
        
        <p>Especialidad: <span><?php echo $barbero->especialidad ?: 'Sin especialidad'; ?></span></p>
        
        <p>Teléfono: <span><?php echo $barbero->telefono ?: 'No especificado'; ?></span></p>

        <p>Email: <span><?php echo $barbero->correo ?? 'No disponible'; ?></span></p>

        <p>Estado: <span class="estado-<?php echo $barbero->estado; ?>"><?php echo ucfirst($barbero->estado); ?></span></p>

        <div class="acciones-servicios">
            <a class="boton" href="/admin/barberos/actualizar?id=<?php echo $barbero->id;?>">Actualizar</a>
                        
            <form action="/admin/barberos/eliminar" method="POST">
                <input type="hidden" name="id" value="<?php echo $barbero->id; ?>">
                <input type="submit" value="Borrar" class="boton-eliminar" onclick="return confirm('¿Estás seguro de eliminar este barbero?')">
            </form>
        </div>
    </li>
<?php 
        }
    endif; 
?>