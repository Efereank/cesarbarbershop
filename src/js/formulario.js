document.addEventListener('DOMContentLoaded', function() {
    iniciarAppForm();
});

function iniciarAppForm() {
    // Buscar el formulario de sign-up
    const formularioSignup = document.getElementById('formulario-signup');
    
    // Si el formulario existe, inicializar las validaciones
    if (formularioSignup) {
        inicializarValidacionesSignup();
    }
    
    // Buscar y validar campos individuales en cualquier formulario
    inicializarValidacionesGlobales();
}

function inicializarValidacionesSignup() {
    const formulario = document.getElementById('formulario-signup');
    const inputNombre = document.getElementById('nombre');
    const inputApellido = document.getElementById('apellido');
    const inputTelefono = document.getElementById('telefono');
    
    // Agregar eventos de validación si los elementos existen
    if (inputNombre) {
        inputNombre.addEventListener('input', function() {
            validarCampoLetras(this, 'nombre');
        });
        
        inputNombre.addEventListener('blur', function() {
            validarCampoLetras(this, 'nombre');
        });
    }
    
    if (inputApellido) {
        inputApellido.addEventListener('input', function() {
            validarCampoLetras(this, 'apellido');
        });
        
        inputApellido.addEventListener('blur', function() {
            validarCampoLetras(this, 'apellido');
        });
    }
    
    if (inputTelefono) {
        inputTelefono.addEventListener('input', function() {
            validarTelefono(this);
        });
        
        inputTelefono.addEventListener('blur', function() {
            validarTelefono(this);
        });
    }
    
    // Agregar evento de submit al formulario
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let formularioValido = true;
        
        // Validar nombre
        if (inputNombre) {
            const nombreValido = validarCampoLetras(inputNombre, 'nombre');
            formularioValido = formularioValido && nombreValido;
        }
        
        // Validar apellido
        if (inputApellido) {
            const apellidoValido = validarCampoLetras(inputApellido, 'apellido');
            formularioValido = formularioValido && apellidoValido;
        }
        
        // Validar teléfono
        if (inputTelefono) {
            const telefonoValido = validarTelefono(inputTelefono);
            formularioValido = formularioValido && telefonoValido;
        }
        
        // Validar correo
        const inputCorreo = document.getElementById('correo');
        if (inputCorreo) {
            const correoValido = validarCorreo(inputCorreo);
            formularioValido = formularioValido && correoValido;
        }
        
        // Validar contraseña
        const inputPassword = document.getElementById('password');
        if (inputPassword) {
            const passwordValido = validarPassword(inputPassword);
            formularioValido = formularioValido && passwordValido;
        }
        
        // Si todo es válido, enviar el formulario
        if (formularioValido) {
            formulario.submit();
        } else {
            // Mostrar mensaje general de error
            mostrarMensajeError('Por favor, corrige los errores en el formulario');
        }
    });
}

function inicializarValidacionesGlobales() {
    // Buscar todos los campos de nombre en la página
    const camposNombre = document.querySelectorAll('input[type="text"][name*="nombre"], input[type="text"][id*="nombre"]');
    camposNombre.forEach(campo => {
        campo.addEventListener('input', function() {
            validarCampoLetras(this, 'nombre');
        });
    });
    
    // Buscar todos los campos de apellido
    const camposApellido = document.querySelectorAll('input[type="text"][name*="apellido"], input[type="text"][id*="apellido"]');
    camposApellido.forEach(campo => {
        campo.addEventListener('input', function() {
            validarCampoLetras(this, 'apellido');
        });
    });
    
    // Buscar todos los campos de teléfono
    const camposTelefono = document.querySelectorAll('input[type="tel"]');
    camposTelefono.forEach(campo => {
        campo.addEventListener('input', function() {
            validarTelefono(this);
        });
    });
}

// Función para validar campos que solo deben contener letras
function validarCampoLetras(input, tipo) {
    // Buscar o crear elemento de error
    let errorElement = document.getElementById('error-' + input.id);
    if (!errorElement) {
        errorElement = document.getElementById('error-' + tipo);
        if (!errorElement) {
            // Crear elemento de error si no existe
            errorElement = document.createElement('small');
            errorElement.id = 'error-' + input.id;
            errorElement.className = 'mensaje-error';
            input.parentNode.appendChild(errorElement);
        }
    }
    
    const valor = input.value;
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
    
    // Remover números y caracteres especiales
    let valorLimpio = valor.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    
    // Remover múltiples espacios consecutivos
    valorLimpio = valorLimpio.replace(/\s+/g, ' ');
    
    // Remover espacios al inicio y al final
    valorLimpio = valorLimpio.trim();
    
    // Actualizar el valor del input si cambió
    if (valor !== valorLimpio) {
        input.value = valorLimpio;
    }
    
    // Validar
    if (input.required && valorLimpio === '') {
        mostrarError(input, errorElement, `El ${tipo} es requerido`);
        return false;
    } else if (valorLimpio !== '' && !regex.test(valorLimpio)) {
        mostrarError(input, errorElement, `El ${tipo} solo puede contener letras y espacios`);
        return false;
    } else {
        ocultarError(input, errorElement);
        return true;
    }
}

// Función para validar teléfono
function validarTelefono(input) {
    // Buscar o crear elemento de error
    let errorElement = document.getElementById('error-' + input.id);
    if (!errorElement) {
        errorElement = document.getElementById('error-telefono');
        if (!errorElement) {
            // Crear elemento de error si no existe
            errorElement = document.createElement('small');
            errorElement.id = 'error-' + input.id;
            errorElement.className = 'mensaje-error';
            input.parentNode.appendChild(errorElement);
        }
    }
    
    const valor = input.value;
    const regex = /^[0-9]*$/;
    
    // Remover cualquier carácter que no sea número
    let valorLimpio = valor.replace(/[^0-9]/g, '');
    
    // Limitar a 11 dígitos
    if (valorLimpio.length > 11) {
        valorLimpio = valorLimpio.substring(0, 11);
    }
    
    // Actualizar el valor del input
    if (valor !== valorLimpio) {
        input.value = valorLimpio;
    }
    
    // Validar
    if (input.required && valorLimpio === '') {
        mostrarError(input, errorElement, 'El teléfono es requerido');
        return false;
    } else if (valorLimpio !== '' && valorLimpio.length !== 11) {
        mostrarError(input, errorElement, 'El teléfono debe tener 11 dígitos');
        return false;
    } else if (valorLimpio !== '' && !regex.test(valorLimpio)) {
        mostrarError(input, errorElement, 'Solo se permiten números');
        return false;
    } else {
        ocultarError(input, errorElement);
        return true;
    }
}

// Función para validar correo electrónico
function validarCorreo(input) {
    const valor = input.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (input.required && valor === '') {
        mostrarMensajeError('El correo electrónico es requerido');
        return false;
    } else if (valor !== '' && !regex.test(valor)) {
        mostrarMensajeError('Ingresa un correo electrónico válido');
        return false;
    }
    
    return true;
}

// Función para validar contraseña
function validarPassword(input) {
    const valor = input.value;
    
    if (input.required && valor === '') {
        mostrarMensajeError('La contraseña es requerida');
        return false;
    } else if (valor.length < 6) {
        mostrarMensajeError('La contraseña debe tener al menos 6 caracteres');
        return false;
    }
    
    return true;
}

// Funciones auxiliares para mostrar/ocultar errores
function mostrarError(input, errorElement, mensaje) {
    errorElement.textContent = mensaje;
    errorElement.style.display = 'block';
    input.classList.add('error');
    input.classList.remove('valido');
}

function ocultarError(input, errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    input.classList.remove('error');
    input.classList.add('valido');
}

function mostrarMensajeError(mensaje) {
    // Crear o usar un contenedor de mensajes global
    let mensajeContainer = document.getElementById('mensaje-error-global');
    
    if (!mensajeContainer) {
        mensajeContainer = document.createElement('div');
        mensajeContainer.id = 'mensaje-error-global';
        mensajeContainer.className = 'alerta-error';
        mensajeContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            max-width: 300px;
        `;
        document.body.appendChild(mensajeContainer);
    }
    
    mensajeContainer.textContent = mensaje;
    mensajeContainer.style.display = 'block';
    
    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        mensajeContainer.style.display = 'none';
    }, 5000);
}
