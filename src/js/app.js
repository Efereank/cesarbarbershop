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
            const url = 'https://localhost:3000/api/servicios';
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
            const urlTasa = 'https://localhost:3000/api/tasa';
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
        const inputFecha = document.querySelector('#fecha');
        if (!inputFecha) return;

        // Establecer rango de fechas (hoy hasta hoy + 4 días)
        const hoy = new Date();
        const fechaMinima = hoy.toISOString().split('T')[0];
        
        const fechaMaxima = new Date();
        fechaMaxima.setDate(hoy.getDate() + 4);
        const fechaMaximaFormato = fechaMaxima.toISOString().split('T')[0];
        
        inputFecha.min = fechaMinima;
        inputFecha.max = fechaMaximaFormato;

        inputFecha.addEventListener('input', function(e){
            const dia = new Date(e.target.value).getUTCDay();
            
            if ([0].includes(dia)) {
                e.target.value = '';
                mostrarAlerta('Los domingos no están permitidos', 'error', '.formulario');
            } else { 
                cita.fecha = e.target.value;
                cargarHorariosDisponibles();
            }
        });
    }

    function seleccionarHora() {
        const inputHora = document.querySelector('#hora');
        const inputFecha = document.querySelector('#fecha'); 
        
        inputHora.addEventListener('input', validarHoraCita);
        
        inputFecha.addEventListener('input', function(e) {
            if (typeof cita !== 'undefined') {
                cita.fecha = e.target.value;
            }
            validarHoraCita(e); 
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
            mostrarBarberos(barberos);
        } catch (error) {
            console.error('Error al cargar barberos:', error);
            mostrarAlerta('Error al cargar la lista de barberos', 'error', '.formulario');
        }
    }

    function mostrarBarberos(barberos) {
        const selectBarbero = document.querySelector('#barberoId');
        if (!selectBarbero) return;
        
        selectBarbero.innerHTML = '<option value="">Selecciona un barbero</option>';
        
        if (barberos && barberos.length > 0) {
            barberos.forEach(barbero => {
                const option = document.createElement('option');
                option.value = barbero.id;
                option.textContent = `${barbero.nombre} - ${barbero.especialidad || 'Barbero'}`;
                selectBarbero.appendChild(option);
            });
            
        selectBarbero.value = "";
        cita.barberoId = '';
        selectBarbero.disabled = false;
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay barberos disponibles';
            selectBarbero.appendChild(option);
            selectBarbero.disabled = true;
        }
        
        // Event listener para cuando cambia el barbero
        selectBarbero.addEventListener('change', function() {
            cita.barberoId = this.value;
            // Si ya hay una fecha seleccionada, recargar horarios
            if (cita.fecha) {
                cargarHorariosDisponibles();
            }
        });
    }



async function cargarHorariosDisponibles() {
    const selectHora = document.querySelector('#hora');
    if (!selectHora) return;
    
    if (!cita.fecha) {
        selectHora.innerHTML = '<option value="">Selecciona una fecha primero</option>';
        selectHora.disabled = true;
        return;
    }

    if (!cita.barberoId) {
        selectHora.innerHTML = '<option value="">Selecciona un barbero primero</option>';
        selectHora.disabled = true;
        return;
    }

    // Mostrar loading
    selectHora.innerHTML = '<option value="">Cargando horarios disponibles...</option>';
    selectHora.disabled = true;
    
    try {
        const duracion = calcularDuracionTotal();
        
        // Generar horarios de 10:00 a 19:30 cada 15 minutos
        const horarios = [];
        for (let hora = 10; hora < 20; hora++) {
            for (let minuto = 0; minuto < 60; minuto += 15) {
                // Verificar que no se pase del horario de cierre considerando la duración
                const horaFin = new Date();
                horaFin.setHours(hora, minuto + duracion, 0, 0);
                const horarioCierre = new Date();
                horarioCierre.setHours(20, 0, 0, 0);
                
                if (horaFin <= horarioCierre) {
                    const horaStr = hora.toString().padStart(2, '0');
                    const minutoStr = minuto.toString().padStart(2, '0');
                    const horarioCompleto = `${horaStr}:${minutoStr}`;
                    
                    const validacionTiempo = validarHoraContraActual(cita.fecha, horarioCompleto);
                    
                    if (validacionTiempo.valido) {
                        horarios.push(horarioCompleto);
                    }
                }
            }
        }
        
        // Verificar disponibilidad para cada horario
        const horariosDisponibles = [];
        
        for (const horario of horarios) {
            const disponible = await verificarDisponibilidadIndividual(
                cita.fecha, 
                horario, 
                duracion, 
                cita.barberoId,
                false
            );
            
            if (disponible) {
                horariosDisponibles.push({
                    hora: horario,
                    display: horario,
                    disponible: true
                });
            }
        }
        
        selectHora.innerHTML = '';
        selectHora.disabled = false;
        
        if (horariosDisponibles.length > 0) {
            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecciona una hora';
            selectHora.appendChild(optionDefault);
            
            horariosDisponibles.forEach(horario => {
                const option = document.createElement('option');
                option.value = horario.hora;
                option.textContent = horario.display;
                selectHora.appendChild(option);
            });
            
            if (cita.hora) {
                const opcionExistente = Array.from(selectHora.options).find(opt => opt.value === cita.hora);
                if (opcionExistente) {
                    selectHora.value = cita.hora;
                } else {
                    cita.hora = '';
                }
            }
        } else {
            selectHora.innerHTML = '<option value="">No hay horarios disponibles para esta fecha</option>';
            selectHora.disabled = true;
            mostrarAlerta('No hay horarios disponibles para la fecha seleccionada. Intenta con otra fecha o reduce los servicios.', 'error', '.formulario');
        }
    } catch (error) {
        console.error('Error al cargar horarios:', error);
        selectHora.innerHTML = '<option value="">Error al cargar horarios</option>';
        selectHora.disabled = true;
        mostrarAlerta('Error al cargar los horarios disponibles', 'error', '.formulario');
    }
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
            const url = 'https://localhost:3000/api/tasa';
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
            const selectBarbero = document.querySelector('#barberoId');
            const nombreBarbero = selectBarbero ? selectBarbero.options[selectBarbero.selectedIndex].textContent : 'No seleccionado';

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
        const url = 'https://localhost:3000/api/citas';
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



