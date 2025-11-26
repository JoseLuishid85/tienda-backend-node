# Implementación de WebSocket con Socket.IO

## Resumen

Este documento describe cómo se ha implementado Socket.IO en el backend y cómo conectarse desde el frontend del panel de administración para recibir notificaciones en tiempo real de nuevas ventas.

## Backend - Configuración Completada

### 1. Instalación
Socket.IO ya está instalado en el proyecto:
```bash
npm install socket.io
```

### 2. Configuración del Servidor
El servidor Socket.IO está configurado en `config/socket.js` y se inicializa en `app.js`.

### 3. Eventos Disponibles

#### Evento: `nueva-venta`
Se emite automáticamente cuando un cliente crea una nueva venta.

**Payload enviado:**
```javascript
{
  venta: {
    id: 1,
    nventa: "V000001",
    forma_pago: "transferencia",
    subtotal: 100.00,
    envio: 10.00,
    total: 110.00,
    estado: "Pendiente",
    cliente: { /* datos del cliente */ },
    direccion: { /* datos de dirección */ },
    banco: { /* datos del banco */ },
    detalles: [
      {
        cantidad: 2,
        precio_unidad: 50.00,
        producto: { /* datos del producto */ },
        variedad: { /* datos de la variedad si aplica */ }
      }
    ]
  },
  mensaje: "Nueva venta V000001 realizada"
}
```

## Frontend - Implementación en Panel de Administración

### 1. Instalación en el Frontend

Primero, instala socket.io-client en tu proyecto frontend:

```bash
npm install socket.io-client
```

### 2. Conexión al Servidor

#### Opción A: Vue 3 (Composition API)

```javascript
// En tu componente de ventas o en un composable
import { onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

export default {
  setup() {
    let socket = null;

    onMounted(() => {
      // Conectar al servidor Socket.IO
      socket = io('http://localhost:4000', {
        transports: ['websocket', 'polling']
      });

      // Evento de conexión exitosa
      socket.on('connect', () => {
        console.log('Conectado a Socket.IO:', socket.id);

        // Unirse a la sala del panel de administración
        socket.emit('join-admin-panel');
      });

      // Escuchar nuevas ventas
      socket.on('nueva-venta', (data) => {
        console.log('Nueva venta recibida:', data);

        // Aquí puedes:
        // 1. Mostrar una notificación
        // 2. Actualizar la lista de ventas
        // 3. Reproducir un sonido
        // 4. Mostrar un toast/alerta

        // Ejemplo: Mostrar notificación
        alert(`${data.mensaje}\nTotal: $${data.venta.total}`);

        // Ejemplo: Actualizar lista de ventas
        // refrescarListaVentas();
      });

      // Manejar errores
      socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error);
      });

      socket.on('disconnect', () => {
        console.log('Desconectado de Socket.IO');
      });
    });

    onUnmounted(() => {
      // Desconectar cuando el componente se desmonte
      if (socket) {
        socket.disconnect();
      }
    });

    return {
      // tus datos y métodos
    };
  }
};
```

#### Opción B: Vue 2 (Options API)

```javascript
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      ventas: []
    };
  },

  mounted() {
    // Conectar al servidor Socket.IO
    this.socket = io('http://localhost:4000', {
      transports: ['websocket', 'polling']
    });

    // Evento de conexión exitosa
    this.socket.on('connect', () => {
      console.log('Conectado a Socket.IO:', this.socket.id);
      this.socket.emit('join-admin-panel');
    });

    // Escuchar nuevas ventas
    this.socket.on('nueva-venta', (data) => {
      console.log('Nueva venta recibida:', data);

      // Agregar la venta al inicio de la lista
      this.ventas.unshift(data.venta);

      // Mostrar notificación
      this.$notify({
        title: 'Nueva Venta',
        message: data.mensaje,
        type: 'success'
      });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });
  },

  beforeDestroy() {
    // Desconectar cuando el componente se destruya
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
```

#### Opción C: Vanilla JavaScript

```javascript
// Importar Socket.IO client
import { io } from 'socket.io-client';

// Conectar al servidor
const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling']
});

// Conexión exitosa
socket.on('connect', () => {
  console.log('Conectado:', socket.id);
  socket.emit('join-admin-panel');
});

// Escuchar nuevas ventas
socket.on('nueva-venta', (data) => {
  console.log('Nueva venta:', data);

  // Mostrar notificación en la interfaz
  mostrarNotificacion(data);

  // Actualizar la tabla de ventas
  agregarVentaATabla(data.venta);
});

function mostrarNotificacion(data) {
  // Crear elemento de notificación
  const notif = document.createElement('div');
  notif.className = 'notificacion-venta';
  notif.innerHTML = `
    <h3>Nueva Venta</h3>
    <p>${data.mensaje}</p>
    <p>Total: $${data.venta.total}</p>
  `;
  document.body.appendChild(notif);

  // Remover después de 5 segundos
  setTimeout(() => notif.remove(), 5000);
}

function agregarVentaATabla(venta) {
  // Lógica para agregar la venta a la tabla
  const tabla = document.getElementById('tabla-ventas');
  const fila = tabla.insertRow(0);
  // ... agregar celdas con datos de la venta
}
```

### 3. Ejemplo Completo con Notificaciones Toast

Si usas una librería de notificaciones como `vue-toastification`:

```javascript
import { useToast } from 'vue-toastification';
import { io } from 'socket.io-client';

export default {
  setup() {
    const toast = useToast();
    let socket = null;

    onMounted(() => {
      socket = io('http://localhost:4000');

      socket.on('connect', () => {
        socket.emit('join-admin-panel');
      });

      socket.on('nueva-venta', (data) => {
        // Notificación visual
        toast.success(data.mensaje, {
          position: 'top-right',
          timeout: 5000,
          closeOnClick: true,
          pauseOnHover: true
        });

        // Opcional: Reproducir sonido
        const audio = new Audio('/notification-sound.mp3');
        audio.play();

        // Refrescar datos
        refrescarVentas();
      });
    });

    onUnmounted(() => {
      if (socket) socket.disconnect();
    });
  }
};
```

### 4. Configuración de Producción

Cuando despliegues a producción, actualiza la URL del servidor:

```javascript
// Desarrollo
const socket = io('http://localhost:4000');

// Producción
const socket = io('https://tu-dominio.com', {
  path: '/socket.io'
});

// O usa variable de entorno
const socket = io(process.env.VUE_APP_SOCKET_URL || 'http://localhost:4000');
```

También actualiza el CORS en el backend (`config/socket.js`):

```javascript
cors: {
  origin: "https://tu-panel-admin.com", // URL específica de tu frontend
  methods: ["GET", "POST"]
}
```

## Próximas Mejoras Sugeridas

1. **Autenticación de Socket.IO**: Validar el token JWT antes de permitir la conexión
2. **Salas por roles**: Crear salas diferentes para admin, vendedores, etc.
3. **Más eventos**: Agregar eventos para actualización de estado de ventas, nuevos productos, etc.
4. **Reconexión automática**: Socket.IO ya lo hace, pero puedes personalizar el comportamiento
5. **Persistencia de notificaciones**: Guardar notificaciones no leídas en la base de datos

## Pruebas

Para probar la implementación:

1. Inicia el servidor backend: `npm start`
2. Abre el panel de administración en tu navegador
3. Desde otra ventana/dispositivo, crea una venta como cliente
4. Deberías ver la notificación en tiempo real en el panel de administración

## Solución de Problemas

### El evento no se recibe en el frontend

1. Verifica que el servidor esté corriendo
2. Revisa la consola del navegador para errores de conexión
3. Asegúrate de que el CORS esté correctamente configurado
4. Verifica que estés escuchando el evento con el nombre correcto: `nueva-venta`

### Error de CORS

Si ves errores de CORS, verifica la configuración en `config/socket.js` y ajusta el `origin`.

### Conexión cae frecuentemente

Configura los parámetros de reconexión:

```javascript
const socket = io('http://localhost:4000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});
```
