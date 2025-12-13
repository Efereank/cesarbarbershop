// build/js/socket-client.js
class ClienteWebSocketBarbero {
    constructor(barberoId) {
        this.barberoId = barberoId;
        this.socket = null;
        this.conectado = false;
        this.audioContext = null;
        
        // Bind de métodos para mantener el contexto
        this.mostrarNotificacion = this.mostrarNotificacion.bind(this);
        this.reproducirSonido = this.reproducirSonido.bind(this);
        this.mostrarAlerta = this.mostrarAlerta.bind(this);
        
        this.inicializar();
        this.prepararAudioContext();
    }

    prepararAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('🔇 Audio no disponible');
        }
    }

    inicializar() {
        this.socket = io('http://localhost:3001');
        
        this.socket.on('connect', () => {
            this.conectado = true;
            this.socket.emit('barbero-conectado', this.barberoId);
        });

        // Usar arrow function o el método bindeado
        this.socket.on('nueva-cita', (data) => {
            this.mostrarNotificacion(data);
        });
    }

    mostrarNotificacion(data) {
        this.mostrarAlerta(data);
        this.reproducirSonido();
    }

    reproducirSonido() {
        // Solución simple y confiable
        try {
            const audio = new Audio();
            audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
            audio.volume = 0.1;
            audio.play().catch(e => console.log('🔇 Audio bloqueado'));
        } catch (error) {
            console.log('🔇 Audio no disponible');
        }
    }

mostrarAlerta(data) {
    const alerta = document.createElement('div');
    alerta.className = 'alerta-notificacion exito';
    
    alerta.innerHTML = `
        <div class="contenido-notificacion">
            <strong> Nueva Cita</strong>
            <p>${data.mensaje}</p>
            <small>${new Date().toLocaleTimeString()}</small>
        </div>
        <div class="botones-notificacion">
            <button class="recargar-pagina" onclick="location.reload()">↻ Recargar</button>
        </div>
    `;

    document.body.appendChild(alerta);

    setTimeout(() => {
        if (alerta.parentNode) alerta.remove();
    }, 9000);
}

}

// Inicializar
if (window.location.pathname === '/barbero') {
    const barberoId = document.querySelector('[data-barbero-id]')?.dataset.barberoId;
    if (barberoId && !window.clienteWebSocket) {
        window.clienteWebSocket = new ClienteWebSocketBarbero(barberoId);
    }
}