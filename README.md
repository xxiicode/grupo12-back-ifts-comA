# Proyecto Backend - Grupo 12 -IFTS

Eventify es un backend completo para la gestión profesional de eventos, desarrollado con **Node.js**, **Express**, **MongoDB Atlas**, **Mongoose**, **JWT**, **WebSockets** y **PUG**.  
Incluye autenticación, permisos por rol, gestión completa de eventos, invitados, presupuesto y chat en tiempo real.

---

#  Deploy en Render

###  Backend + Panel Web:  
https://g12-axora-webservice.onrender.com/

---

#  Funcionalidades Principales

##  Autenticación y Seguridad
- Login con **JSON Web Tokens**
- Token almacenado en **cookie HTTP Only**
- Middleware `verificarToken`
- Middleware `autorizarRoles`
- Permisos según rol:
  - **admin** – acceso total
  - **coordinador** – gestiona eventos
  - **asistente** – participa en eventos asignados
  - **cliente** – solo visualiza sus eventos
---

##  Gestión Completa de Eventos
Cada evento posee:
- Cliente asignado
- Coordinador
- Asistentes (1 a 10)
- Lista de **invitados**
- Lista de **gastos**
- Presupuesto general
- Fecha, lugar y descripción
- Chat en tiempo real exclusivo del evento

---

##  Chat en Tiempo Real (WebSockets)
- Implementado con **Socket.io**
- Cada evento tiene su **propia sala**
- Historial persistente en MongoDB
- Mensajes con autor, rol y timestamp
- Envío y recepción instantánea sin refrescar la página

---

# 🛠️ Tecnologías Utilizadas

- **Node.js 20+**
- **Express 5.1**
- **MongoDB Atlas**
- **Mongoose 8.19**
- **JWT + Cookies HTTP Only**
- **bcrypt**
- **dotenv**
- **PUG**
- **Socket.io**
- **bootstrap**

---

# 🧩 Modelos del Sistema

## Usuario
- username  
- passwordHash  
- nombre  
- rol (admin, coordinador, asistente, cliente)  
- dni, email, teléfono  

## Evento
- nombre, fecha, lugar, descripción  
- clienteId, coordinadorId  
- asistentesIds[]  
- invitados[] (subdocumento)  
- gastos[] (subdocumento)  
- timestamps  

## Mensaje
- eventoId  
- usuarioId  
- usuarioNombre  
- rol  
- contenido  
- createdAt (automático)  

---

#  Estructura del Proyecto

```
├── .env                         # Variables de entorno (puerto, configuraciones)
├── .gitignore
├── app.js                       # Configuración de Express (middlewares, rutas)
├── config
│   └── db.js                    # Conexión a MongoDB Atlas
├── controllers                  # Lógica de controladores (manejo de req/res)
│   ├── authController.js
│   ├── chatController.js
│   ├── eventosController.js
│   └── usuariosController.js
├── crearUsuariosDemo.js
├── jest.config.js
├── middlewares
│   ├── authMiddleware.js
│   └── rolMiddleware.js
├── models                      # Modelos de datos (Mongoose Schemas)
│   ├── Evento.js
│   ├── Mensaje.js
│   └── Usuario.js
├── package-lock.json
├── package.json                # Dependencias y scripts del proyecto
├── README.md
├── routes                      # Definición de rutas (endpoints)
│   ├── auth.js
│   ├── chat.js
│   ├── eventos.js
│   ├── usuarios.js
│   └── usuariosAdmin.js
├── server.js                   # Punto de entrada - Inicia el servidor
├── services                    # Lógica de negocio y acceso a datos
│   └── eventosService.js
├── tests                       # Pruebas unitarias con Jest y Supertest
│   ├── auth.test.js
│   ├── eventos.test.js
│   ├── invitados.test.js
│   ├── perm-eventos.test.js
│   ├── presupuesto.test.js
│   ├── socket.test.js
│   └── utils
│       ├── test-db.js
│       └── test-helpers.js
└── views                      # Plantillas Pug (interfaz web)
    ├── .gitkeep
    ├── chatEvento.pug
    ├── clientes.pug
    ├── crearEvento.pug
    ├── editarCliente.pug
    ├── editarEvento.pug
    ├── editarUsuario.pug
    ├── error.pug
    ├── eventos.pug
    ├── index.pug
    ├── invitados.pug
    ├── layout.pug
    ├── login.pug
    ├── presupuesto.pug
    ├── register.pug
    └── usuarios.pug
```

---

##  Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/xxiicode/grupo12-back-ifts-comA
cd grupo12-back-ifts-comA
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear o editar el archivo `.env` en la raíz del proyecto:

-Pedir usuario y contraseña a los miembros del equipo-

```env
PORT=3000
MONGO_URI=mongodb+srv://tu-usuario:tu-password@cluster0.xxxxx.mongodb.net/tu-base-de-datos
```

### 4. Iniciar el servidor

**Modo desarrollo:**

```bash
npm run dev
```

### 5. Abrir en el navegador

```
http://localhost:3000/
```

---

##  Endpoints de la API

## Auth API
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST   | `/auth/api/login` | Iniciar sesion |

--------------------------------------------

## Usuarios
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET    | `/usuarios/api` | Listar usuarios |
| POST   | `/usuarios/api` | Crear usuario |
| PUT    | `/usuarios/api/:id` | Actualizar usuario |
| DELETE | `/usuarios/api/:id` | Eliminar usuario |

--------------------------------------------

## Eventos
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET    | `/eventos/api` | Listar todos los eventos |
| GET    | `/eventos/api/:id` | Obtener evento por ID |
| POST   | `/eventos/api` | Crear evento |
| PUT    | `/eventos/api/:id` | Actualizar evento |
| DELETE | `/eventos/api/:id` | Eliminar evento |
| GET    | `/eventos/api/:id/full` | Obtener evento con cliente y permisos por rol |

--------------------------------------------

## Invitados (subdocumentos del evento)
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST   | `/eventos/api/:id/invitados` | Agregar invitado |
| PUT    | `/eventos/api/:id/invitados/:idInv` | Actualizar invitado |
| DELETE | `/eventos/api/:id/invitados/:idInv` | Eliminar invitado |

--------------------------------------------

## Gastos y presupuesto
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST   | `/eventos/api/:id/gastos` | Agregar gasto |
| DELETE | `/eventos/api/:id/gastos/:idGasto` | Eliminar gasto |

--------------------------------------------

## Chat (historial y mensajes)
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET    | `/chat/api/mensajes/:eventoId` | Obtener historial de mensajes |
| POST   | `/chat/api/mensajes` | Registrar mensaje (usado por WebSocket) |

--------------------------------------------

# Actualizaciones recientes

- Migracion completa a MongoDB Atlas usando la variable de entorno MONGO_URI.
- Nueva implementacion de WebSockets para chat en tiempo real usando Socket.io.
- Salas independientes por cada evento.
- Guardado de mensajes en la base de datos.
- Reorganizacion de rutas API en /routes/auth.js, /routes/eventos.js, /routes/usuarios.js y /routes/chat.js.
- Mejoras de seguridad: JWT en cookie HTTP Only, middlewares verificarToken y autorizarRoles.
- Validacion por evento: clientes, coordinadores y asistentes solo acceden a lo que corresponde.
- Modelos actualizados: Evento con invitados[], gastos[], asistentesIds[], coordinadorId y clienteId.
- Modelo Mensaje actualizado: guarda usuarioNombre, rol y timestamp.
- Deploy en Render.com en la URL https://g12-axora-webservice.onrender.com/

---

##  Arquitectura y Flujo de la Aplicación

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
   ↓ Mongoose Schema
6. MongoDB Atlas
   ↓ persistencia en la nube
```

## 👥 Equipo

**Grupo 12 - IFTS**  
Proyecto de Comunicación A

---

## 📄 Licencia

ISC License - Proyecto educativo para la facultad.
