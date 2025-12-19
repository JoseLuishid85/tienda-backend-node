const { Server } = require('socket.io');

function setupSocketIO(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", // En producción, especifica el dominio del frontend
            methods: ["GET", "POST"]
        },
        //path: '/store/socket.io/',
    });

    // Evento de conexión
    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        // Evento cuando un cliente se une a una sala específica
        socket.on('join-admin-panel', () => {
            socket.join('admin-panel');
            console.log(`Cliente ${socket.id} se unió a la sala admin-panel`);
        });

        // Evento de desconexión
        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    // Hacer io accesible globalmente para los controladores
    global.io = io;

    return io;
}

module.exports = setupSocketIO;
