# grupo12-back-ifts-comA

# Proyecto Backend - Grupo 12

Este es el proyecto backend para la gestión de eventos usando **Node.js** y **Express** con arquitectura **MVC + Services**.  
El sistema permite administrar eventos, clientes, proveedores e invitados con una API REST y vistas web.

---

## 🚀 Funcionalidades Actuales

### ✅ Módulo de Eventos

- Listar, crear, editar y eliminar eventos
- Ver eventos con información del cliente asociado
- Interfaz web con vistas Pug
- API REST completa para integración con otras aplicaciones
- Validaciones de datos obligatorios

### ✅ Módulo de Clientes

- CRUD completo de clientes (Crear, Leer, Actualizar, Eliminar)
- Validación de dependencias (no se puede eliminar un cliente con eventos activos)
- API REST disponible
- Validaciones de email y campos requeridos

### 🔜 Próximos Módulos

- Proveedores
- Invitados
- Autenticación de usuarios

---

## 📁 Estructura del Proyecto

```
grupo12-back-ifts-comA/
│
├── .env                      # Variables de entorno (puerto, configuraciones)
├── .gitignore               # Archivos ignorados por Git
├── server.js                # Punto de entrada - Inicia el servidor
├── app.js                   # Configuración de Express (middlewares, rutas)
├── package.json             # Dependencias y scripts del proyecto
│
├── config/                  # Configuraciones globales
│   └── (futuro: db.js, constants.js)
│
├── routes/                  # Definición de rutas (endpoints)
│   ├── clientes.js         # Rutas API para clientes
│   └── eventos.js          # Rutas API y web para eventos
│
├── controllers/            # Lógica de controladores (manejo de req/res)
│   ├── clientesController.js
│   └── eventosController.js
│
├── services/               # Lógica de negocio y acceso a datos
│   ├── clientesService.js
│   └── eventosService.js
│
├── models/                 # Modelos de datos (clases/estructuras)
│   ├── Cliente.js
│   └── Evento.js
│
├── views/                  # Plantillas Pug (interfaz web)
│   ├── layout.pug         # Plantilla base
│   ├── index.pug          # Página principal
│   ├── eventos.pug        # Lista de eventos
│   └── editarEvento.pug   # Formulario de edición
│
├── public/                 # Archivos estáticos
│   └── styles.css         # Estilos CSS
│
├── data/                   # "Base de datos" (archivos JSON)
│   ├── clientes.json
│   └── eventos.json
│
└── utils/                  # Utilidades y helpers (futuro)
```

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express 5.1.0** - Framework web
- **Pug 3.0.3** - Motor de plantillas
- **dotenv 17.2.3** - Variables de entorno
- **method-override 3.0.0** - Soporte para PUT/DELETE en formularios
- **Nodemon 3.1.10** - Recarga automática en desarrollo

---

## ⚡ Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone <URL-del-repo>
cd grupo12-back-ifts-comA
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

El archivo `.env` ya está configurado con:

```env
NODE_ENV=development
PORT=3000
HOST=localhost
DATA_PATH=./data
```

### 4. Iniciar el servidor

**Modo desarrollo (recomendado):**

```bash
npm run dev
```

**Modo producción:**

```bash
npm start
```

### 5. Abrir en el navegador

```
http://localhost:3000/
```

---

## 📍 Endpoints de la API

### Eventos

| Método | Endpoint                | Descripción                 |
| ------ | ----------------------- | --------------------------- |
| GET    | `/eventos/api`          | Obtener todos los eventos   |
| GET    | `/eventos/api/:id`      | Obtener un evento por ID    |
| POST   | `/eventos/api`          | Crear nuevo evento          |
| PUT    | `/eventos/api/:id`      | Actualizar evento           |
| DELETE | `/eventos/api/:id`      | Eliminar evento             |
| GET    | `/eventos/api/:id/full` | Evento con cliente incluido |

### Clientes

| Método | Endpoint            | Descripción                |
| ------ | ------------------- | -------------------------- |
| GET    | `/clientes/api`     | Obtener todos los clientes |
| GET    | `/clientes/api/:id` | Obtener un cliente por ID  |
| POST   | `/clientes/api`     | Crear nuevo cliente        |
| PUT    | `/clientes/api/:id` | Actualizar cliente         |
| DELETE | `/clientes/api/:id` | Eliminar cliente           |

### Vistas Web

| Ruta                  | Descripción              |
| --------------------- | ------------------------ |
| `/`                   | Página principal         |
| `/eventos`            | Lista de eventos (tabla) |
| `/eventos/editar/:id` | Formulario de edición    |

---

## 🔄 Actualizaciones Recientes

### Mejoras Implementadas

- **Migración a ES Modules**: Se actualizó el proyecto para usar ES Modules (`import/export`) en lugar de CommonJS (`require`)
- **Refactorización de Rutas**: Se ajustaron las rutas para que la lógica se maneje principalmente en los controllers, siguiendo mejores prácticas de arquitectura MVC
- **Implementación de Services**: Se crearon services para separar la lógica de negocio de los controllers, mejorando la organización del código
- **Nuevas Dependencias**:
  - **dotenv**: Para manejo de variables de entorno
  - **method-override**: Para soporte de métodos HTTP PUT y DELETE en formularios
- **Reorganización del Código**: Se ordenaron y estructuraron mejor los archivos y carpetas basándose en lo visto en clase

Estos cambios mejoran la mantenibilidad, escalabilidad y siguen las mejores prácticas de desarrollo con Node.js y Express.

---

## 🏗️ Arquitectura y Flujo de la Aplicación

### Flujo de una Petición HTTP

```
1. Cliente (Browser/Thunder Client)
   ↓ hace petición HTTP
2. Routes (routes/)
   ↓ define endpoint y delega
3. Controller (controllers/)
   ↓ valida req, maneja res
4. Service (services/)
   ↓ ejecuta lógica de negocio
5. Model (models/)
   ↓ estructura de datos
6. Data (data/)
   ↓ persistencia JSON
```

### 📂 Explicación Detallada de Carpetas y Archivos

---

#### **📁 Raíz del Proyecto**

**`server.js`**

- **Función**: Punto de entrada de la aplicación
- **Responsabilidad**:
  - Carga las variables de entorno con `dotenv`
  - Importa la configuración de Express desde `app.js`
  - Inicia el servidor en el puerto especificado
  - Muestra mensaje en consola cuando el servidor está listo

**`app.js`**

- **Función**: Configuración principal de Express
- **Responsabilidad**:
  - Configura el motor de plantillas Pug
  - Registra middlewares globales (JSON, urlencoded, archivos estáticos)
  - Importa y monta las rutas de la aplicación
  - Define rutas base (`/`, `/eventos`, `/clientes`)
  - Exporta la app para ser usada por `server.js`

**`.env`**

- **Función**: Variables de entorno
- **Contenido**:
  - `PORT`: Puerto del servidor (3000)
  - `NODE_ENV`: Entorno de ejecución (development/production)
  - `HOST`: Host del servidor (localhost)
  - `DATA_PATH`: Ruta a la carpeta de datos

**`package.json`**

- **Función**: Configuración del proyecto Node.js
- **Contenido**:
  - Dependencias del proyecto
  - Scripts de ejecución (`start`, `dev`)
  - Metadata del proyecto

---

#### **📁 routes/** - Definición de Rutas

**Función**: Define los endpoints de la API y vistas web. Son archivos **MUY SIMPLES** que solo mapean URLs a funciones del controller.

**`clientes.js`**

```javascript
router.get("/api", ctrl.getAllClientes); // GET /clientes/api
router.post("/api", ctrl.createCliente); // POST /clientes/api
router.put("/api/:id", ctrl.updateCliente); // PUT /clientes/api/:id
router.delete("/api/:id", ctrl.removeCliente); // DELETE /clientes/api/:id
```

- Define rutas API para operaciones CRUD de clientes
- Delega toda la lógica al controller

**`eventos.js`**

```javascript
// Rutas API
router.get("/api", ctrl.getAllEventos);
router.post("/api", ctrl.createEvento);
// ... más rutas

// Rutas Web (vistas)
router.get("/", ctrl.listarEventos); // Vista lista
router.get("/editar/:id", ctrl.mostrarFormularioEdicion);
```

- Define rutas API y rutas web (vistas)
- Separa endpoints JSON de endpoints que renderizan HTML

---

#### **📁 controllers/** - Controladores HTTP

**Función**: Manejan las peticiones HTTP (request/response). Son el **puente entre las rutas y los services**.

**Responsabilidades:**

- ✅ Recibir `req` (request) y `res` (response)
- ✅ Validar datos de entrada
- ✅ Llamar a los services apropiados
- ✅ Manejar errores con try/catch
- ✅ Formatear y enviar respuestas HTTP (JSON o HTML)
- ✅ Establecer códigos de estado (200, 201, 400, 404, 500)

**`clientesController.js`**

```javascript
async function createCliente(req, res) {
  try {
    // 1. Validar entrada
    if (!nombre || !email) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // 2. Llamar al service
    const nuevo = await clientesService.crear(datos);

    // 3. Responder
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**`eventosController.js`**

- Maneja tanto endpoints API (JSON) como vistas web (HTML)
- Para API: responde con `res.json()`
- Para vistas: renderiza con `res.render('template', datos)`

---

#### **📁 services/** - Lógica de Negocio

**Función**: Contienen la **lógica de negocio pura** y acceso a datos. Son el **cerebro de la aplicación**.

**Responsabilidades:**

- ✅ Operaciones CRUD (Create, Read, Update, Delete)
- ✅ Leer/escribir en archivos JSON (base de datos)
- ✅ Validaciones de negocio complejas
- ✅ Procesamiento y transformación de datos
- ✅ Reglas de negocio (ej: "no eliminar cliente con eventos activos")

**`clientesService.js`**

```javascript
async function obtenerTodos() {
  return await readDB(); // Lee clientes.json
}

async function crear(datosCliente) {
  const clientes = await readDB();
  const nuevoCliente = {
    id: generarNuevoId(),
    ...datosCliente,
  };
  clientes.push(nuevoCliente);
  await writeDB(clientes); // Guarda en JSON
  return nuevoCliente;
}

async function tieneEventosActivos(clienteId) {
  // Lógica de negocio: validar dependencias
  const eventos = await eventosService.obtenerTodos();
  return eventos.some((e) => e.clienteId === clienteId);
}
```

**`eventosService.js`**

- Similar a clientesService
- Funciones adicionales como `obtenerConCliente()` para incluir datos relacionados
- Maneja la lógica de asociación entre eventos y clientes

**¿Por qué separar Services de Controllers?**

- **Reutilización**: Un service puede ser llamado desde múltiples controllers
- **Testeo**: Se puede testear la lógica de negocio sin HTTP
- **Mantenimiento**: Cambios en lógica no afectan las rutas ni controllers

---

#### **📁 models/** - Modelos de Datos

**Función**: Definen la **estructura de datos** de las entidades del sistema.

**`Cliente.js`**

```javascript
class Cliente {
  constructor(id, nombre, email, telefono) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
  }
}
```

- Define qué campos tiene un cliente
- Sirve como "contrato" de datos
- Facilita la creación de objetos consistentes

**`Evento.js`**

```javascript
class Evento {
  constructor(id, nombre, fecha, lugar, presupuesto, estado, clienteId) {
    this.id = id;
    this.nombre = nombre;
    this.fecha = fecha;
    this.lugar = lugar;
    this.presupuesto = presupuesto;
    this.estado = estado;
    this.clienteId = clienteId; // Relación con Cliente
  }
}
```

- Define la estructura de un evento
- Incluye relación con clientes mediante `clienteId`

---

#### **📁 views/** - Plantillas Pug

**Función**: Plantillas HTML para la interfaz web del sistema.

**`layout.pug`**

- Plantilla base que define la estructura común (header, footer, estilos)
- Todas las demás vistas heredan de esta

**`index.pug`**

- Página principal de bienvenida
- Muestra menú de navegación

**`eventos.pug`**

- Lista todos los eventos en una tabla
- Muestra información del cliente asociado
- Botones para crear, editar y eliminar

**`editarEvento.pug`**

- Formulario para editar un evento existente
- Dropdown para seleccionar cliente
- Campos pre-cargados con datos actuales

---

#### **📁 data/** - Persistencia de Datos

**Función**: Almacenamiento de datos en formato JSON (simula una base de datos).

**`clientes.json`**

```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "123456789"
  }
]
```

**`eventos.json`**

```json
[
  {
    "id": 1,
    "nombre": "Boda de María",
    "fecha": "2025-12-15",
    "lugar": "Salón Central",
    "presupuesto": 50000,
    "estado": "confirmado",
    "clienteId": 1
  }
]
```

**Nota**: En producción esto se reemplazaría por una base de datos real (MongoDB)

---

#### **📁 public/** - Archivos Estáticos

**Función**: Archivos que se sirven directamente al navegador.

**`styles.css`**

- Estilos CSS para las vistas web
- Tablas, formularios, botones, etc.

---

#### **📁 config/** - Configuraciones (Futuro)

**Función**: Archivos de configuración globales.

**Archivos futuros:**

- `db.js`: Configuración de base de datos
- `constants.js`: Constantes globales (códigos de estado, mensajes)

---

## 🎯 Ventajas de esta Arquitectura

✅ **Separación de responsabilidades** - Cada capa tiene una función clara  
✅ **Código mantenible** - Fácil encontrar y modificar funcionalidades  
✅ **Escalable** - Se pueden agregar nuevos módulos fácilmente  
✅ **Testeable** - Cada capa se puede probar independientemente  
✅ **Reutilizable** - Los services pueden usarse desde múltiples lugares  
✅ **Profesional** - Sigue estándares de la industria

---

## 📚 Próximos Pasos

1. ✅ **Validaciones avanzadas** - Middleware de validación
2. ✅ **Base de datos real** - Migrar a MongoDB
3. ✅ **Autenticación** - Sistema de login y permisos
4. ✅ **Testing** - Pruebas unitarias y de integración
5. ✅ **Deploy** - Subir a producción (Heroku, Railway, Vercel)

---

## 👥 Equipo

**Grupo 12 - IFTS**  
Proyecto de Comunicación A

---

## 📄 Licencia

ISC License - Proyecto educativo para la facultad.
