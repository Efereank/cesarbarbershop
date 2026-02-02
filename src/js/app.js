    let paso = 1;
    const pasoInicial = 1;
    const pasoFinal = 3;

    const cita = {
        id: '',
        nombre: '',
        fecha: '',
        hora: '',
        servicios: [],
        barberoId: '' // ← Nuevo campo para el barbero
    }

    document.addEventListener('DOMContentLoaded', function(){
        iniciarApp()
    });

    function iniciarApp(){

        
        mostrarSeccion();
        tabs();
        botonesPaginador();
        paginaSiguiente();
        paginaAnterior();

        consultarAPI();

        idCliente();
        nombreCliente();
        seleccionarFecha();
        inicializarSelectHora();

        actualizarDuracionServicio();
        mostrarResumen();

        cargarBarberos(); // ← Nueva función para cargar barberos
    }



    function mostrarSeccion() {
        const seccionAnterior = document.querySelector('.mostrar');
        if (seccionAnterior) {
            seccionAnterior.classList.remove('mostrar');    
        }

        const pasoSelector = `#paso-${paso}`;
        const seccion = document.querySelector(pasoSelector);
        seccion.classList.add('mostrar');

        const tabAnterior = document.querySelector('.actual');
        if (tabAnterior) {
            tabAnterior.classList.remove('actual');
        }

        const tab = document.querySelector(`[data-paso="${paso}"]`);
        tab.classList.add('actual');

        const footer = document.querySelector('.footer-total');
        if (footer) {
            if (paso === 3) {
                footer.style.display = 'none';
            } else {
                footer.style.display = 'flex';
            }
        }
    }

    function tabs(){
        const botones = document.querySelectorAll('.tabs button')

        botones.forEach(boton => {
            boton.addEventListener('click', function(e) {
                paso = parseInt(e.target.dataset.paso);
                mostrarSeccion();
                botonesPaginador();

                if (paso === 3) {
                    mostrarResumen();
                }
                
                actualizarFooterTotal();
            })
        })



    }

    function botonesPaginador() {
        const paginaAnterior = document.querySelector('#anterior');
        const paginaSiguiente = document.querySelector('#siguiente');

        if (paso === 1) {
            paginaAnterior.classList.add('ocultar');
            paginaSiguiente.classList.remove('ocultar');
        } else if (paso === 3) {
            paginaAnterior.classList.remove('ocultar');
            paginaSiguiente.classList.add('ocultar');
            if (paginaSiguiente) {
                paginaSiguiente.classList.add('ocultar');
            }
        } else {
            paginaAnterior.classList.remove('ocultar');
            paginaSiguiente.classList.remove('ocultar');
            if (paginaSiguiente) {
                paginaSiguiente.textContent = 'Siguiente »';
            }
        }

        mostrarSeccion();
    }

    function paginaAnterior() {
        const paginaAnterior = document.querySelector('#anterior');
        paginaAnterior.addEventListener('click', function() {
            if (paso <= pasoInicial) return;
            paso--;
            botonesPaginador();
            actualizarFooterTotal();
        })
    }

    function paginaSiguiente() {
        const paginaSiguiente = document.querySelector('#siguiente');

        if (paginaSiguiente) {
            paginaSiguiente.addEventListener('click', function() {
                if (paso >= pasoFinal) {
                        confirmarCita();
                    return;
                } 
                
                paso++; 
                botonesPaginador(); 
                
                if (paso === 3) {
                    mostrarResumen();
                }
                
                actualizarFooterTotal();
            });
        }
    }

    async function consultarAPI() {
        try {
            const url = '/api/servicios';
            const resultado = await fetch(url);
            
            if (!resultado.ok) {
                throw new Error(`Error HTTP: ${resultado.status}`);
            }
            
            const servicios = await resultado.json();
            mostrarServicios(servicios);
        } catch (error) {
            mostrarAlerta('Error al cargar los servicios', 'error', '.formulario');
        }

        // Mantén tu código existente para la tasa
        try {
            const urlTasa = '/api/tasa';
            const resultadoTasa = await fetch(urlTasa);
            const Tasa = await resultadoTasa.json();
            mostrarResumen(Tasa);
        } catch (error) {
            console.log(error);
        }
    }

    function mostrarServicios(servicios) {
        window.todosLosServicios = servicios;
        
        const contenedorServicios = document.querySelector('#servicio');
        if (!contenedorServicios) {
            return;
        }
        
        contenedorServicios.innerHTML = '';
        
        servicios.forEach( servicio => {
            const { id, nombre, precio, duracion } = servicio;

            const nombreServicio = document.createElement('P');
            nombreServicio.classList.add('nombre-servicio');
            nombreServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.classList.add('precio-servicio');
            precioServicio.textContent = `$${precio}`;

            const duracionServicio = document.createElement('P');
            duracionServicio.classList.add('duracion-servicio');
            duracionServicio.textContent = `${duracion} minutos`;
            duracionServicio.style.fontSize = '0.8rem';
            duracionServicio.style.color = '#666';

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;
            servicioDiv.dataset.duracion = duracion;
            
            servicioDiv.addEventListener('click', function() {
                seleccionarServicio(servicio);
            });

            if (cita.servicios.some(s => s.id === id)) {
                servicioDiv.classList.add('seleccionado');
            }

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            servicioDiv.appendChild(duracionServicio);
            
            contenedorServicios.appendChild(servicioDiv);
        });
        
        actualizarFooterTotal();
    }

    function seleccionarServicio(servicio) {
        
        const { id } = servicio;
        const { servicios } = cita;

        // Encontrar el div del servicio
        const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

        const servicioExistente = servicios.findIndex(agregado => agregado.id === id);
        
        if (servicioExistente !== -1) {
            // Remover servicio
            cita.servicios = servicios.filter(agregado => agregado.id !== id);
            if (divServicio) {
                divServicio.classList.remove('seleccionado');
            }
        } else {
            // Agregar servicio
            cita.servicios = [...servicios, servicio];
            if (divServicio) {
                divServicio.classList.add('seleccionado');
            }
        }
            
        actualizarFooterTotal();
        
        // Recargar horarios cuando cambian los servicios
        if (cita.fecha) {
            cargarHorariosDisponibles();
        }
    }

    function idCliente() {
        const id = document.querySelector('#id').value;
        cita.id = id;
    }

    function nombreCliente() {
        const nombre = document.querySelector('#nombre').value;
        cita.nombre = nombre
        
    }


    function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
        const alertaPrevia = document.querySelector('.alerta');
        if (alertaPrevia) {
            alertaPrevia.remove();
        }


        const alerta = document.createElement('DIV');
        alerta.textContent = mensaje;
        alerta.classList.add('alerta');
        alerta.classList.add(tipo);

        const referencia = document.querySelector(elemento);
        referencia.appendChild(alerta);

        if (desaparece) {
            setTimeout(() => {
                alerta.remove();
            }, 9000);
        }
    }


    let duracionServicio = 15; // Valor por defecto 15 minutos

    function actualizarDuracionServicio() {
        const selectServicio = document.querySelector('#servicioId');
        if (selectServicio) {
            selectServicio.addEventListener('change', function(e) {
                const servicioId = e.target.value;

                const duraciones = {
                    '1': 30, 
                    '2': 15,
                    '3': 45, 
                    '4': 60,
                    '5': 30, 
                    '6': 90  
                };
                
                duracionServicio = duraciones[servicioId] || 15;            
                const inputHora = document.querySelector('#hora');
                if (inputHora && inputHora.value) {
                    validarHoraCita();
                }
            });
        }
    }

    function calcularHoraFin(horaInicio, duracionMinutos) {
        const [horas, minutos] = horaInicio.split(':').map(Number);
        const fecha = new Date();
        fecha.setHours(horas, minutos, 0, 0);
        fecha.setMinutes(fecha.getMinutes() + duracionMinutos);
        
        return fecha.toTimeString().substring(0, 5); // Formato HH:MM
    }


async function verificarDisponibilidad(fecha, hora, horaFin, duracion) {
    try {
        const respuesta = await fetch('/citas/verificar-disponibilidad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fecha: fecha,
                hora: hora,
                hora_fin: horaFin,
                duracion: duracion
            })
        });

        const datos = await respuesta.json();
        

        if (!datos.disponible) {
            Swal.fire({
                icon: "error",
                title: "Horario No Disponible",
                text: datos.mensaje || 'El barbero seleccionado ya tiene una cita en este horario.',
                confirmButtonText: "Actualizar",
                timer: 5000, 
                timerProgressBar: true
            }).then((result) => {
                window.location.reload();
            });
            

        }
        
        return datos;
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        return { disponible: true };
    }
}

function seleccionarFecha() {
    const selectorFechasContainer = document.querySelector('#selector-fechas');
    const inputFechaHidden = document.querySelector('#fecha');
    if (!selectorFechasContainer || !inputFechaHidden) return;

    // Crear estructura con flechas
    selectorFechasContainer.innerHTML = `
        <div class="selector-fechas-container">
            <button type="button" class="flecha-deslizable flecha-izquierda" id="flecha-izquierda" aria-label="Días anteriores">
                <span>&#9664;</span>
            </button>
            <div class="selector-fechas" id="contenedor-fechas"></div>
            <button type="button" class="flecha-deslizable flecha-derecha" id="flecha-derecha" aria-label="Días siguientes">
                <span>&#9654;</span>
            </button>
        </div>
    `;

    const contenedorFechas = selectorFechasContainer.querySelector('#contenedor-fechas');
    const flechaIzquierda = selectorFechasContainer.querySelector('#flecha-izquierda');
    const flechaDerecha = selectorFechasContainer.querySelector('#flecha-derecha');

    // Nombres de días en español
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    // Obtener fecha actual SIN horas/minutos/segundos (para evitar problemas de zona horaria)
    const hoy = new Date();
    const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    
    // Generar 5 días
    for (let i = 0; i < 5; i++) {
        const fecha = new Date(hoyLocal);
        fecha.setDate(hoyLocal.getDate() + i);
        
        const diaSemana = fecha.getDay();
        const diaNumero = fecha.getDate();
        const mes = fecha.getMonth();
        
        const diaOption = document.createElement('div');
        diaOption.className = 'dia-option';
        
        // Deshabilitar domingos (0 = Domingo)
        if (diaSemana === 0) {
            diaOption.classList.add('deshabilitado');
        }
        
        // Formatear fecha como YYYY-MM-DD para el valor - CORREGIDO
        // Usar fecha local en lugar de UTC
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const fechaFormato = `${year}-${month}-${day}`;
        
        diaOption.dataset.fecha = fechaFormato;
        
        // Para depuración (puedes quitarlo después)
        diaOption.title = `Seleccionar: ${fechaFormato} (Mostrando: ${diaNumero})`;
        
        // Contenido HTML
        diaOption.innerHTML = `
            <div class="dia-semana">${diasSemana[diaSemana]}</div>
            <div class="dia-numero">${diaNumero.toString().padStart(2, '0')}</div>
            <div class="dia-mes">${meses[mes]}</div>
        `;
        
        // Evento click solo para días habilitados
        if (diaSemana !== 0) {
            diaOption.addEventListener('click', function() {
                const estaSeleccionado = this.classList.contains('seleccionado');
                
                if (estaSeleccionado) {
                    this.classList.remove('seleccionado');
                    inputFechaHidden.value = '';
                    
                    if (typeof cita !== 'undefined') {
                        cita.fecha = '';
                        if (typeof cargarHorariosDisponibles !== 'undefined') {
                            cargarHorariosDisponibles();
                        }
                    }
                    
                    console.log('Fecha deseleccionada:', this.dataset.fecha);
                } else {
                    document.querySelectorAll('.dia-option.seleccionado').forEach(el => {
                        el.classList.remove('seleccionado');
                    });
                    
                    this.classList.add('seleccionado');
                    inputFechaHidden.value = this.dataset.fecha;
                    
                    if (typeof cita !== 'undefined') {
                        cita.fecha = this.dataset.fecha;
                        if (typeof cargarHorariosDisponibles !== 'undefined') {
                            cargarHorariosDisponibles();
                        }
                    }
                    
                    // Para depuración
                    console.log('Fecha seleccionada:', this.dataset.fecha);
                    console.log('Día mostrado en pantalla:', diaNumero);
                    console.log('Fecha completa del objeto:', fecha.toString());
                }
            });
        }
        
        contenedorFechas.appendChild(diaOption);
    }
    
    // Selección automática del primer día disponible
    if (hoyLocal.getDay() !== 0) {
        const primerDia = contenedorFechas.querySelector('.dia-option:not(.deshabilitado)');
        if (primerDia) {
            primerDia.click();
        }
    }
    
    // Configurar flechas deslizantes
    function deslizar(direccion) {
        const anchoDia = 80; // 70px + 10px gap
        const scrollActual = contenedorFechas.scrollLeft;
        const nuevoScroll = direccion === 'derecha' 
            ? scrollActual + (anchoDia * 3)
            : scrollActual - (anchoDia * 3);
        
        contenedorFechas.scrollTo({
            left: nuevoScroll,
            behavior: 'smooth'
        });
    }
    
    // Event listeners para flechas con preventDefault
    flechaIzquierda.addEventListener('click', (e) => {
        e.preventDefault();
        deslizar('izquierda');
    });
    
    flechaDerecha.addEventListener('click', (e) => {
        e.preventDefault();
        deslizar('derecha');
    });
    
    // También permitir scroll con rueda del mouse
    contenedorFechas.addEventListener('wheel', (e) => {
        e.preventDefault();
        contenedorFechas.scrollLeft += e.deltaY * 0.5;
    }, { passive: false });
}

function seleccionarHora() {
    const inputFecha = document.querySelector('#fecha'); 
    
    inputFecha.addEventListener('input', function(e) {
        if (typeof cita !== 'undefined') {
            cita.fecha = e.target.value;
        }
        // No llamamos a validarHoraCita aquí, se llama desde cargarHorariosDisponibles
    });

    actualizarDuracionServicio();
}

    async function validarHoraCita(e) {
        const inputHora = document.querySelector('#hora');
        const inputFecha = document.querySelector('#fecha'); 
        const horaCita = inputHora.value; 
        
        if (!horaCita || !inputFecha.value) {
            if (typeof cita !== 'undefined') cita.hora = ''; 
            return;
        }
        
        const [horaSeleccionadaStr, minutosSeleccionadosStr] = horaCita.split(":");
        const hora = parseInt(horaSeleccionadaStr, 10); 
        const minutos = parseInt(minutosSeleccionadosStr, 10);

        // HORA DE VENEZUELA (UTC-4)
        const fechaActual = new Date();
        
        // Obtener fecha en hora de Venezuela
        const opciones = { timeZone: 'America/Caracas' };
        const fechaVenezuela = new Date(fechaActual.toLocaleString('en-US', opciones));
        
        const year = fechaVenezuela.getFullYear();
        const month = String(fechaVenezuela.getMonth() + 1).padStart(2, '0');
        const day = String(fechaVenezuela.getDate()).padStart(2, '0');
        const fechaActualFormato = `${year}-${month}-${day}`;
        
        const fechaSeleccionada = inputFecha.value;

        const limite15Minutos = new Date(fechaVenezuela.getTime() + (15 * 60 * 1000));
        const horaLimite = limite15Minutos.getHours();
        const minutosLimite = limite15Minutos.getMinutes();
        

        let horaNoValida = false;
        let mensajeError = '';

        // Validación de horario de atención
        if (hora < 10 || hora >= 20) {
            horaNoValida = true;
            mensajeError = 'Hora no válida. Nuestro horario de atención es de 10:00 a 20:00.';
        }


        const horaFinCalculada = calcularHoraFin(horaCita, duracionServicio);
        const [horaFin, minutosFin] = horaFinCalculada.split(':').map(Number);
        if (horaFin > 20 || (horaFin === 20 && minutosFin > 0)) {
            horaNoValida = true;
            mensajeError = `El servicio seleccionado terminaría a las ${horaFinCalculada} fuera del horario de atención (hasta 20:00).`;
        }


        if (fechaSeleccionada === fechaActualFormato && !horaNoValida) {
            let fueraDeMargen = false;
        
            if (hora < horaLimite) {
                fueraDeMargen = true;
            } 
            
            if (hora === horaLimite) {
                if (minutos < minutosLimite) {
                    fueraDeMargen = true;
                }
            }
            
            if (fueraDeMargen) {
                horaNoValida = true;
                mensajeError = 'Hora no válida. Las citas para hoy requieren un margen de 5 minutos.';
            }
        }
        
        const alertaExistente = document.querySelector('.alerta');

        if (horaNoValida) {
            inputHora.value = ''; 
            if (!alertaExistente || alertaExistente.textContent !== mensajeError) {
                if (alertaExistente) alertaExistente.remove();
                mostrarAlerta(mensajeError, 'error', '.formulario');
            }
            if (typeof cita !== 'undefined') cita.hora = '';
        } else {
            const horaFin = calcularHoraFin(horaCita, duracionServicio);
            
            try {
                const resultado = await verificarDisponibilidad(fechaSeleccionada, horaCita, horaFin, duracionServicio);
                
                if (!resultado.disponible) {
                    inputHora.value = '';
                    mostrarAlerta(resultado.mensaje || 'Ya existe una cita en ese horario. Por favor, elige otra hora.', 'error', '.formulario');
                    if (typeof cita !== 'undefined') cita.hora = '';
                } else {

                    if (typeof cita !== 'undefined') {
                        cita.hora = horaCita;
                        cita.hora_fin = horaFin; 
                    }

                    if (alertaExistente) {
                        alertaExistente.remove();
                    }
                    
                    mostrarAlerta(`Horario disponible ✓`, 'exito', '.formulario');
                    setTimeout(() => {
                        const alertaExito = document.querySelector('.alerta.exito');
                        if (alertaExito) alertaExito.remove();
                    }, 3000);
                }
            } catch (error) {
                mostrarAlerta('Error al verificar disponibilidad. Confirma que el horario esté libre.', 'error', '.formulario');
            }
        }
    }


    function obtenerDuracionServicio() {
        
        if (window.cita && window.cita.servicios && window.cita.servicios.length > 0) {
            
            let duracionTotal = 0;
            window.cita.servicios.forEach(servicio => {

                
                if (window.todosLosServicios) {
                    const servicioCompleto = window.todosLosServicios.find(s => s.id === servicio.id);
                    
                    if (servicioCompleto && servicioCompleto.duracion) {
                        const duracion = parseInt(servicioCompleto.duracion);
                        duracionTotal += duracion;
                    }
                } else {
                    if (servicio.duracion) {
                        const duracion = parseInt(servicio.duracion);
                        duracionTotal += duracion;
                    }
                }
            });
            
            return duracionTotal > 0 ? duracionTotal : 15; 
        }
        

        const serviciosSeleccionados = document.querySelectorAll('.servicio.seleccionado');

        
        if (serviciosSeleccionados.length === 0) {
            return 15;
        }
        
        let duracionTotal = 0;
        serviciosSeleccionados.forEach(servicioDiv => {
            const duracion = parseInt(servicioDiv.dataset.duracion) || 0;
            duracionTotal += duracion;
        });
        
        return duracionTotal > 0 ? duracionTotal : 15;
    }

    function inicializarSelectHora() {
        const selectHora = document.querySelector('#hora');
        if (selectHora) {
            selectHora.addEventListener('change', function() {
                const horaSeleccionada = this.value;
                
                if (!horaSeleccionada) {
                    cita.hora = '';
                    return;
                }
                
                
                if (cita.fecha) {
                    const validacion = validarHoraContraActual(cita.fecha, horaSeleccionada);
                    if (!validacion.valido) {
                        mostrarAlerta(validacion.mensaje, 'error', '.formulario');
                        this.value = '';
                        cita.hora = '';
                        return;
                    }
                }
                
                cita.hora = horaSeleccionada;
                if (cita.hora) {
                    mostrarAlerta(`Hora seleccionada: ${cita.hora}`, 'exito', '.formulario', 2000);
                }
            });
        }
    }

async function cargarBarberos() {
    try {
        const respuesta = await fetch('/api/barberos');
        const barberos = await respuesta.json();
        mostrarBarberosVisual(barberos);
    } catch (error) {
        console.error('Error al cargar barberos:', error);
        mostrarAlerta('Error al cargar la lista de barberos', 'error', '.formulario');
    }
}

function mostrarBarberosVisual(barberos) {
    const selectorBarberos = document.querySelector('#selector-barberos');
    const inputBarberoHidden = document.querySelector('#barberoId');
    
    if (!selectorBarberos || !inputBarberoHidden) return;
    // Limpiar y crear estructura
    selectorBarberos.innerHTML = `
        <div class="selector-fechas-container">
            <button type="button" class="flecha-deslizable flecha-izquierda" id="flecha-izquierda-barberos" aria-label="Barberos anteriores">
                <span>&#9664;</span>
            </button>
            <div class="contenedor-barberos" id="contenedor-barberos"></div>
            <button type="button" class="flecha-deslizable flecha-derecha" id="flecha-derecha-barberos" aria-label="Más barberos">
                <span>&#9654;</span>
            </button>
        </div>
    `;
    
    const contenedorBarberos = selectorBarberos.querySelector('#contenedor-barberos');
    const flechaIzquierda = selectorBarberos.querySelector('#flecha-izquierda-barberos');
    const flechaDerecha = selectorBarberos.querySelector('#flecha-derecha-barberos');
    
    if (barberos && barberos.length > 0) {
        barberos.forEach(barbero => {
            const barberoOption = document.createElement('div');
            barberoOption.className = 'barbero-option';
            barberoOption.dataset.barberoId = barbero.id;
            barberoOption.dataset.barberoNombre = barbero.nombre;
            
            // Determinar estado (puedes modificar esta lógica)
            const estaDisponible = barbero.disponible !== false; // Asume disponible por defecto
            const estadoClase = estaDisponible ? 'estado-disponible' : 'estado-ocupado';
            const estadoTexto = estaDisponible ? 'Disponible' : 'Ocupado';
            
            barberoOption.innerHTML = `
                <div class="nombre-barbero">${barbero.nombre}</div>
                ${barbero.especialidad ? `<div class="especialidad-barbero">${barbero.especialidad}</div>` : ''}
                <div class="estado-barbero ${estadoClase}">${estadoTexto}</div>
            `;
            
            // Solo hacer clicable si está disponible
            if (estaDisponible) {
                barberoOption.addEventListener('click', function() {
                    const estaSeleccionado = this.classList.contains('seleccionado');
                    
                    if (estaSeleccionado) {
                        // Deseleccionar
                        this.classList.remove('seleccionado');
                        inputBarberoHidden.value = '';
                        cita.barberoId = '';
                        cita.barberoNombre = '';
                    } else {
                        // Deseleccionar todos primero
                        document.querySelectorAll('.barbero-option.seleccionado').forEach(el => {
                            el.classList.remove('seleccionado');
                        });
                        
                        // Seleccionar este barbero
                        this.classList.add('seleccionado');
                        inputBarberoHidden.value = this.dataset.barberoId;
                        cita.barberoId = this.dataset.barberoId;
                        cita.barberoNombre = this.dataset.barberoNombre;
                        
                        // Mostrar confirmación
                        mostrarAlerta(`Barbero seleccionado: ${cita.barberoNombre}`, 'exito', '.formulario', 2000);
                        
                        // Si ya hay una fecha seleccionada, cargar horarios
                        if (cita.fecha) {
                            cargarHorariosDisponibles();
                        }
                    }
                });
            } else {
                barberoOption.classList.add('deshabilitado');
                barberoOption.title = 'Barbero no disponible en este momento';
            }
            
            contenedorBarberos.appendChild(barberoOption);
        });
        
        // Si solo hay un barbero, seleccionarlo automáticamente
        if (barberos.length === 1 && barberos[0].disponible !== false) {
            setTimeout(() => {
                const primerBarbero = contenedorBarberos.querySelector('.barbero-option:not(.deshabilitado)');
                if (primerBarbero) {
                    primerBarbero.click();
                }
            }, 100);
        }
    } else {
        selectorBarberos.innerHTML = '<p class="mensaje-info">No hay barberos disponibles en este momento</p>';
    }
    
    // Configurar flechas deslizantes para barberos
    function actualizarFlechasBarberos() {
        const scrollLeft = contenedorBarberos.scrollLeft;
        const scrollWidth = contenedorBarberos.scrollWidth;
        const clientWidth = contenedorBarberos.clientWidth;
        
        // Ocultar flecha izquierda si está al inicio
        if (scrollLeft <= 10) {
            flechaIzquierda.classList.add('oculta');
        } else {
            flechaIzquierda.classList.remove('oculta');
        }
        
        // Ocultar flecha derecha si está al final
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
            flechaDerecha.classList.add('oculta');
        } else {
            flechaDerecha.classList.remove('oculta');
        }
    }
    
    function deslizarBarberos(direccion) {
        const anchoBarbero = 130; // 120px + 10px gap
        const scrollActual = contenedorBarberos.scrollLeft;
        const nuevoScroll = direccion === 'derecha' 
            ? scrollActual + (anchoBarbero * 2)
            : scrollActual - (anchoBarbero * 2);
        
        contenedorBarberos.scrollTo({
            left: nuevoScroll,
            behavior: 'smooth'
        });
        
        setTimeout(actualizarFlechasBarberos, 300);
    }
    
    flechaIzquierda.addEventListener('click', (e) => {
        e.preventDefault();
        deslizarBarberos('izquierda');
    });
    
    flechaDerecha.addEventListener('click', (e) => {
        e.preventDefault();
        deslizarBarberos('derecha');
    });
    
    contenedorBarberos.addEventListener('scroll', actualizarFlechasBarberos);
    setTimeout(actualizarFlechasBarberos, 100);
    
    // Scroll con rueda
    contenedorBarberos.addEventListener('wheel', (e) => {
        e.preventDefault();
        contenedorBarberos.scrollLeft += e.deltaY * 0.5;
        setTimeout(actualizarFlechasBarberos, 50);
    }, { passive: false });
}


async function cargarHorariosDisponibles() {
    const selectorHoras = document.querySelector('#selector-horas');
    if (!selectorHoras) return;
    
    if (!cita.fecha) {
        selectorHoras.innerHTML = '<p class="mensaje-info"> Selecciona una Fecha.</p>';
        return;
    }

    if (!cita.barberoId) {
        selectorHoras.innerHTML = '<p class="mensaje-info"> Ahora selecciona un Barbero. </p>';
        return;
    }

    // Mostrar loading
    selectorHoras.innerHTML = '<p class="mensaje-info">Cargando horarios disponibles...</p>';
    
    try {
        const duracion = calcularDuracionTotal();
        
        // Generar horarios de 10:00 a 19:30 cada 30 minutos (como en la imagen)
        const horariosManana = [
            '10:00', '10:30', '11:00', '11:30'
        ];
        
        const horariosTarde = [
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
            '18:00', '18:30', '19:00', '19:30'
        ];
        
        // Filtrar horarios que no excedan el cierre considerando la duración
        const horarioCierre = 20; // 20:00
        
        const filtrarHorarios = (horarios) => {
            return horarios.filter(horario => {
                const [hora, minutos] = horario.split(':').map(Number);
                const horaFin = new Date();
                horaFin.setHours(hora, minutos + duracion, 0, 0);
                return horaFin.getHours() < horarioCierre || 
                      (horaFin.getHours() === horarioCierre && horaFin.getMinutes() === 0);
            });
        };
        
        const mananaFiltrados = filtrarHorarios(horariosManana);
        const tardeFiltrados = filtrarHorarios(horariosTarde);

        // Obtener fecha y hora actual en Venezuela (UTC-4)
        const ahora = new Date();
        const opciones = { timeZone: 'America/Caracas' };
        const ahoraVenezuela = new Date(ahora.toLocaleString('en-US', opciones));
        const fechaActualStr = ahoraVenezuela.toISOString().slice(0, 10); // YYYY-MM-DD

        // Si la fecha seleccionada es hoy, filtrar horarios pasados
        function horarioNoPasado(horario) {
            if (cita.fecha !== fechaActualStr) return true;
            const [h, m] = horario.split(':').map(Number);
            const horaTurno = new Date(ahoraVenezuela.getFullYear(), ahoraVenezuela.getMonth(), ahoraVenezuela.getDate(), h, m);
            // Mostrar solo horarios estrictamente después de la hora actual
            return horaTurno.getTime() > ahoraVenezuela.getTime();
        }

        const mananaFiltradosFinal = mananaFiltrados.filter(horarioNoPasado);
        const tardeFiltradosFinal = tardeFiltrados.filter(horarioNoPasado);

        // Verificar disponibilidad para cada horario
        const verificarDisponibilidadPromesas = [
            ...mananaFiltradosFinal.map(horario => verificarDisponibilidadIndividual(
                cita.fecha, horario, duracion, cita.barberoId, false
            ).then(disponible => ({ horario, disponible, grupo: 'manana' }))),
            ...tardeFiltradosFinal.map(horario => verificarDisponibilidadIndividual(
                cita.fecha, horario, duracion, cita.barberoId, false
            ).then(disponible => ({ horario, disponible, grupo: 'tarde' })))
        ];
        
        const resultados = await Promise.all(verificarDisponibilidadPromesas);
        
        // Separar resultados por grupo
        const horariosDisponiblesManana = [];
        const horariosDisponiblesTarde = [];
        
        resultados.forEach(resultado => {
            const { horario, disponible, grupo } = resultado;
            if (disponible) {
                if (grupo === 'manana') {
                    horariosDisponiblesManana.push(horario);
                } else {
                    horariosDisponiblesTarde.push(horario);
                }
            }
        });
        
        // Construir el HTML con el nuevo diseño
        let html = '<div class="selector-horas-contenedor">';
        
        // Grupo Mañana
        if (horariosDisponiblesManana.length > 0) {
            html += '<div class="grupo-horas">';
            html += '<div class="titulo-grupo">Mañana</div>';
            html += '<div class="contenedor-horas">';
            
            horariosDisponiblesManana.forEach(horario => {
                const horaDisplay = formatearHora12h(horario);
                html += `<div class="hora-option" data-hora="${horario}">${horaDisplay}</div>`;
            });
            
            html += '</div></div>';
        }
        
        // Grupo Tarde
        if (horariosDisponiblesTarde.length > 0) {
            html += '<div class="grupo-horas">';
            html += '<div class="titulo-grupo">Tarde</div>';
            html += '<div class="contenedor-horas">';
            
            horariosDisponiblesTarde.forEach(horario => {
                const horaDisplay = formatearHora12h(horario);
                html += `<div class="hora-option" data-hora="${horario}">${horaDisplay}</div>`;
            });
            
            html += '</div></div>';
        }
        
        html += '</div>';
        
        // Si no hay horarios disponibles
        if (horariosDisponiblesManana.length === 0 && horariosDisponiblesTarde.length === 0) {
            html = '<p class="mensaje-error">No hay horarios disponibles para esta fecha</p>';
            mostrarAlerta('No hay horarios disponibles para la fecha seleccionada. Intenta con otra fecha o reduce los servicios.', 'error', '.formulario');
        }
        
        selectorHoras.innerHTML = html;
        
        // Agregar event listeners a los botones de hora
        document.querySelectorAll('.hora-option').forEach(boton => {
            boton.addEventListener('click', async function() {
                // Deseleccionar todas las horas
                document.querySelectorAll('.hora-option.seleccionada').forEach(el => {
                    el.classList.remove('seleccionada');
                });
                
                // Seleccionar esta hora
                this.classList.add('seleccionada');
                
                // Establecer valor en input hidden
                const inputHora = document.querySelector('#hora');
                inputHora.value = this.dataset.hora;
                
                // Guardar en objeto cita
                cita.hora = this.dataset.hora;
                
                // Ejecutar validaciones
                await validarHoraCita({ target: inputHora });
            });
        });
        
        // Si ya había una hora seleccionada, marcarla
        if (cita.hora) {
            const horaSeleccionada = document.querySelector(`.hora-option[data-hora="${cita.hora}"]`);
            if (horaSeleccionada) {
                horaSeleccionada.classList.add('seleccionada');
            }
        }
        
    } catch (error) {
        console.error('Error al cargar horarios:', error);
        selectorHoras.innerHTML = '<p class="mensaje-error">Error al cargar horarios</p>';
        mostrarAlerta('Error al cargar los horarios disponibles', 'error', '.formulario');
    }
}

// Función para formatear hora 24h a 12h
function formatearHora12h(hora24) {
    const [horas, minutos] = hora24.split(':').map(Number);
    const ampm = horas >= 12 ? 'pm' : 'am';
    const horas12 = horas % 12 || 12;
    return `${horas12}:${minutos.toString().padStart(2, '0')} ${ampm}`;
}


async function verificarDisponibilidadIndividual(fecha, hora, duracion, barberoId, recargarPagina = true) {


    try {
        const respuesta = await fetch('/citas/verificar-disponibilidad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fecha: fecha,
                hora: hora,
                duracion: duracion,
                barberoId: barberoId  
            })
        });

        if (!respuesta.ok) throw new Error('Error en la respuesta del servidor');

        const datos = await respuesta.json();
        
        if (!datos.disponible) {
            
            if (recargarPagina) {
                await Swal.fire({
                    icon: "error",
                    title: "Horario No Disponible",
                    text: datos.mensaje,
                    confirmButtonText: "Actualizar",
                    timer: 5000,
                    timerProgressBar: true
                });
                window.location.reload();
            }
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

    function calcularDuracionTotal() {
        if (!cita.servicios || cita.servicios.length === 0) {
            return 15; // Duración por defecto
        }
        
        return cita.servicios.reduce((total, servicio) => {
            return total + (parseInt(servicio.duracion) || 15);
        }, 0);
    }


    function validarHoraContraActual(fechaSeleccionada, horaSeleccionada) {
        // Obtener fecha y hora actual en Venezuela (UTC-4)
        const ahora = new Date();
        const opciones = { timeZone: 'America/Caracas' };
        const ahoraVenezuela = new Date(ahora.toLocaleString('en-US', opciones));
        

        const [anio, mes, dia] = fechaSeleccionada.split('-');
        const [hora, minutos] = horaSeleccionada.split(':');
        
        const fechaCita = new Date(anio, mes - 1, dia, hora, minutos);
        
        // Si la cita es para hoy, verificar que no sea en el pasado
        const hoy = new Date(ahoraVenezuela.getFullYear(), ahoraVenezuela.getMonth(), ahoraVenezuela.getDate());
        const fechaCitaSinHora = new Date(fechaCita.getFullYear(), fechaCita.getMonth(), fechaCita.getDate());
        
        if (fechaCitaSinHora.getTime() === hoy.getTime()) {
            const margenMinutos = 5; // Margen de 5 minutos
            
            const horaLimite = new Date(ahoraVenezuela.getTime() + (margenMinutos * 60 * 1000));
            
            if (fechaCita < horaLimite) {
                const horaActualStr = ahoraVenezuela.toTimeString().substring(0, 5);
                const horaLimiteStr = horaLimite.toTimeString().substring(0, 5);
                
                return {
                    valido: false,
                    mensaje: `No puedes agendar citas para hoy antes de las ${horaLimiteStr}. La hora actual es ${horaActualStr}. Se requiere un margen de ${margenMinutos} minutos.`
                };
            }
        }
        
        // Si la cita es para una fecha anterior a hoy
        if (fechaCitaSinHora < hoy) {
            return {
                valido: false,
                mensaje: 'No puedes agendar citas para fechas pasadas.'
            };
        }
        
        return { valido: true };
    }



    async function mostrarResumen() {
        const resumen = document.querySelector('.contenido-resumen');

        if (!resumen) {
            return;
        }
        
        while (resumen.firstChild) {
            resumen.removeChild(resumen.firstChild);
        }

        if (Object.values(cita).includes('') || cita.servicios.length === 0 ) {
            mostrarAlerta('Faltan datos de Servicios, Fecha, u Hora.', 'error', '.contenido-resumen',false);
            return;
        }

        try {
            // Obtener la tasa de la API
            const url = '/api/tasa';
            const resultadoTasa = await fetch(url);
            const tasas = await resultadoTasa.json();
            
            let tasaBs;
            if (Array.isArray(tasas) && tasas.length > 0) {
                // Tomar el último elemento del array
                const ultimaTasa = tasas[tasas.length - 1];
                tasaBs = parseFloat(ultimaTasa.tasaBs) || 1;
            } else if (tasas.tasaBs) {
                tasaBs = parseFloat(tasas.tasaBs) || 1;
            } else {
                tasaBs = 1;
            }

            if (isNaN(tasaBs)) {
                tasaBs = 1;
            }

            const { nombre, fecha, hora, servicios, barberoId } = cita;
            const duracionTotal = obtenerDuracionServicio();
            
            const [horas, minutos] = hora.split(':').map(Number);
            const hoy = new Date();
            hoy.setHours(horas, minutos, 0, 0);
            hoy.setMinutes(hoy.getMinutes() + duracionTotal);
            const hora_fin = hoy.toTimeString().slice(0, 5);

            // Obtener nombre del barbero seleccionado
            const nombreBarbero = cita.barberoNombre || 'No seleccionado';

            const headingServicios = document.createElement('H3');
            headingServicios.textContent = 'Servicios';
            resumen.appendChild(headingServicios);

            servicios.forEach(servicio => {
                const { precio, nombre, duracion } = servicio;

                const contenedorServicio = document.createElement('DIV');
                contenedorServicio.classList.add('contenedor-servicio');

                const textoServicio = document.createElement('p');
                textoServicio.textContent = nombre;

                const precioServicio = document.createElement('P');
                precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

                // Mostrar duración individual de cada servicio
                const duracionServicio = document.createElement('P');
                duracionServicio.innerHTML = `<span>Duración:</span> ${duracion} minutos`;

                const barberoCita = document.createElement('P');
            barberoCita.innerHTML = `<span>Barbero:</span> ${nombreBarbero}`;


                contenedorServicio.appendChild(textoServicio);
                contenedorServicio.appendChild(precioServicio);
                contenedorServicio.appendChild(duracionServicio);
                contenedorServicio.appendChild(barberoCita); 

                resumen.appendChild(contenedorServicio); 
            });

            const headingCita = document.createElement('H3');
            headingCita.textContent = 'Resumen de la Cita';
            resumen.appendChild(headingCita);

            const nombreCliente = document.createElement('P');
            nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`; 


            const fechaObj = new Date(fecha);
            const mes = fechaObj.getMonth();
            const dia = fechaObj.getDate() + 2;
            const year = fechaObj.getFullYear();

            const fechaUTC = new Date (Date.UTC(year, mes, dia));
            const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const fechaFormateada = fechaUTC.toLocaleDateString('es-VE', opciones);    

            const fechaCita = document.createElement('P');
            fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

            const horarioCita = document.createElement('P');
            horarioCita.innerHTML = `<span>Horario:</span> ${hora} - ${hora_fin}`;


            const totalDolares = servicios.reduce((total, servicio) => total + parseFloat(servicio.precio), 0);
            const totalBolivares = totalDolares * tasaBs;

            const totalDolaresParrafo = document.createElement('P');
            totalDolaresParrafo.innerHTML = `<span>Total:</span> $${totalDolares.toFixed(2)}`;
            
            const totalBolivaresParrafo = document.createElement('P');
            totalBolivaresParrafo.innerHTML = `<span>Total Bs:</span> ${totalBolivares.toFixed()} bs`;

            const botonReservar = document.createElement('BUTTON');
            botonReservar.classList.add('boton');
            botonReservar.textContent = 'Reservar Cita';
            botonReservar.onclick = reservarCita;

            resumen.appendChild(nombreCliente);
            resumen.appendChild(fechaCita);
            resumen.appendChild(horarioCita);
            resumen.appendChild(totalDolaresParrafo);
            resumen.appendChild(totalBolivaresParrafo);
            resumen.appendChild(botonReservar);

        } catch (error) {
            console.error('Error al obtener la tasa:', error);
            mostrarAlerta('Error al obtener la tasa de cambio', 'error', '.contenido-resumen', false);
        }
    }


async function reservarCita() {
    if (!cita.barberoId || !cita.fecha || !cita.hora || cita.servicios.length === 0) {
        mostrarAlerta('Por favor completa todos los campos', 'error', '.contenido-resumen');
        return;
    }

    const { id, fecha, hora, servicios, barberoId } = cita;
    const idServicios = servicios.map( servicio => servicio.id );
    
    const duracionTotal = obtenerDuracionServicio();
    
    const [horas, minutos,] = hora.split(':').map(Number);
    const totalMinutosInicio = horas * 60 + minutos;
    const totalMinutosFin = totalMinutosInicio + duracionTotal;
    
    const horasFin = Math.floor(totalMinutosFin / 60);
    const minutosFin = totalMinutosFin % 60;
    
    const hora_fin = `${horasFin.toString().padStart(2, '0')}:${minutosFin.toString().padStart(2, '0')}:00`;

    try {
        const disponible = await verificarDisponibilidadIndividual(
            fecha, 
            hora, 
            duracionTotal, 
            barberoId,
            true 
        );
        
        if (!disponible) {
            return; 
        }
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        mostrarAlerta('Error al verificar disponibilidad', 'error', '.contenido-resumen');
        return;
    }

    // Si está disponible, procedemos con la reserva
    const datos = new FormData();
    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);
    datos.append('barberoId', barberoId); 

    try {
        const url = '/api/citas';
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();

        if (resultado.resultado) {

            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita ha sido creada exitósamente",
                button: "OK",
            }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            });
        }
        
    } catch (error) {
        console.error('Error al reservar cita:', error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message || "Algo salió mal. Por favor, intentalo más tarde",
        });
    }
}



