// socket-server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

// 🔧 CONFIGURAR CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}));

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Almacenar conexiones de barberos
const barberosConectados = new Map();

io.on('connection', (socket) => {
    console.log('🔌 Usuario conectado:', socket.id);

    // Cuando un barbero se conecta
    socket.on('barbero-conectado', (barberoId) => {
        barberosConectados.set(barberoId, socket.id);
        console.log(`💈 Barbero ${barberoId} conectado (Socket: ${socket.id})`);
        
        // Confirmar conexión al barbero
        socket.emit('conexion-establecida', {
            barberoId: barberoId,
            mensaje: 'Conexión establecida correctamente'
        });
    });

    socket.on('disconnect', () => {
        console.log('🔌 Usuario desconectado:', socket.id);
        
        for (let [barberoId, socketId] of barberosConectados.entries()) {
            if (socketId === socket.id) {
                barberosConectados.delete(barberoId);
                //console.log(`💈 Barbero ${barberoId} desconectado`);
                break;
            }
        }
    });
});

// Endpoint para notificar desde PHP - CON MANEJO CORS MANUAL
app.post('/notificar-barbero', (req, res) => {
    // Headers CORS manuales
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    const { barberoId, fecha, hora, servicios } = req.body;
    
    console.log('📨 Notificación recibida para barbero:', barberoId);
    
    const socketId = barberosConectados.get(barberoId?.toString());
    
    if (socketId) {
        // Barbero CONECTADO - notificación en tiempo real
        io.to(socketId).emit('nueva-cita', {
            barberoId: barberoId,
            fecha: fecha,
            hora: hora,
            servicios: servicios,
            mensaje: `Nueva cita reservada para <strong>${fecha}</strong> a las <strong>${hora}</strong>`,
            timestamp: new Date().toISOString()
        });
        
        console.log(`✅ Notificación enviada a barbero ${barberoId} (en línea)`);
        res.json({ 
            success: true, 
            message: 'Notificación enviada',
            online: true 
        });
        
    } else {
        // Barbero DESCONECTADO - informar que no está conectado
        console.log(`📝 Barbero ${barberoId} no conectado`);
        res.json({ 
            success: false, 
            message: 'Barbero no conectado', 
            online: false,
            notification: {
                barberoId: barberoId,
                fecha: fecha,
                hora: hora,
                servicios: servicios,
                mensaje: `Tienes una nueva cita pendiente para ${fecha} a las ${hora}`
            }
        });
    }
});

// Manejar preflight OPTIONS
app.options('/notificar-barbero', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        barberosConectados: Array.from(barberosConectados.keys()),
        totalConexiones: barberosConectados.size
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Servidor Socket.io ejecutándose en puerto ${PORT}`);
    console.log(`📊 Endpoint salud: http://localhost:${PORT}/health`);
    console.log(`🔧 CORS configurado para: http://localhost:3000`);
});