# grupo12-back-ifts-comA

# Proyecto Backend - Grupo 12

Este es el proyecto backend para la gestión de eventos usando **Node.js** y **Express** con arquitectura **MVC**.  
El sistema permite administrar eventos, clientes, y en un futuro, proveedores e invitados con una API REST y vistas web.

---

## 🚀 Funcionalidades Actuales

### ✅ Módulo de Eventos

- Listar, crear, editar y eliminar eventos
- Ver eventos con información del cliente asociado
- Interfaz web con vistas Pug
- Validaciones de datos obligatorios

### ✅ Módulo de Clientes

- CRUD completo de clientes (Crear, Leer, Actualizar, Eliminar)
- Validación de dependencias (no se puede eliminar un cliente con eventos activos)
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
│   └── db.js               # Conexión a MongoDB Atlas
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
├── models/                 # Modelos de datos (Mongoose Schemas)
│   ├── Cliente.js         # Schema de Cliente para MongoDB
│   └── Evento.js          # Schema de Evento para MongoDB
│
├── views/                  # Plantillas Pug (interfaz web)
│   ├── layout.pug         # Plantilla base
│   ├── index.pug          # Página principal
│   ├── clientes.pug       # Lista de clientes
│   ├── editarCliente.pug  # Formulario edición de cliente
│   ├── eventos.pug        # Lista de eventos
│   └── editarEvento.pug   # Formulario de edición de evento
│
├── public/                 # Archivos estáticos
│   └── styles.css         # Estilos CSS
```

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución JavaScript
- **Express 5.1.0** - Framework web minimalista y rápido
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Mongoose 8.19.2** - ODM para MongoDB (Object Data Modeling)
- **Pug 3.0.3** - Motor de plantillas para vistas HTML
- **dotenv 17.2.3** - Gestión de variables de entorno
- **method-override 3.0.0** - Soporte para PUT/DELETE en formularios HTML
- **morgan 1.10.1** - Logger de peticiones HTTP
- **Nodemon 3.1.10** - Recarga automática en desarrollo
- **ES Modules** - Sintaxis moderna de JavaScript

---

## ⚡ Instalación y Uso

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

-Todavia viendo como pasarnos de manera segura la cadena de conexion de mongo atlas-

```env
PORT=3000
MONGO_URI=mongodb+srv://tu-usuario:tu-password@cluster0.xxxxx.mongodb.net/tu-base-de-datos
```

#### ¿Cómo obtener tu MONGO_URI?

1. Ir a [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crear una cuenta gratuita
3. Crear un cluster (tier gratuito disponible)
4. Click en "Connect" → "Connect your application"
5. Copiar la cadena de conexión

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

| Ruta                   | Descripción                     |
| ---------------------- | ------------------------------- |
| `/`                    | Página principal                |
| `/clientes`            | Lista de clientes (tabla)       |
| `/clientes/editar/:id` | Formulario edición de cliente   |
| `/eventos`             | Lista de eventos (tabla)        |
| `/eventos/editar/:id`  | Formulario de edición de evento |

---

## 🔄 Actualizaciones Recientes

### Mejoras Implementadas

- **Migración a MongoDB Atlas**: Se migró de archivos JSON a MongoDB Atlas
- **Migración a ES Modules**: Proyecto actualizado para usar sintaxis moderna (`import/export`) en lugar de CommonJS (`require`)
- **Arquitectura MVC + Services**: Separación completa de responsabilidades
  - **Routes**: Solo definen endpoints
  - **Controllers**: Manejan peticiones HTTP y respuestas
  - **Services**: Contienen lógica de negocio y operan con MongoDB
  - **Models**: Schemas de Mongoose con validaciones
- **Vistas completas**: Interfaces web para Clientes y Eventos con Pug
- **Validación de dependencias**: No se puede eliminar un cliente si tiene eventos asociados
- **Nuevas Dependencias**:
  - **mongoose**: ODM para MongoDB
  - **morgan**: Logger de peticiones HTTP
  - **dotenv**: Gestión de variables de entorno
  - **method-override**: Soporte PUT/DELETE en formularios HTML

Estos cambios mejoran significativamente la mantenibilidad, escalabilidad y profesionalismo del proyecto.

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
   ↓ Mongoose Schema
6. MongoDB Atlas
   ↓ persistencia en la nube
```

### 📂 Explicación Detallada de Carpetas y Archivos

---

#### **📁 Raíz del Proyecto**

**`server.js`**

- **Función**: Punto de entrada de la aplicación
- **Responsabilidad**:
  - Carga las variables de entorno con `dotenv`
  - Conecta a MongoDB Atlas usando Mongoose
  - Importa la configuración de Express desde `app.js`
  - Inicia el servidor en el puerto especificado
  - Muestra mensajes de conexión a BD y servidor

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
- **Contenido actual**:
  - `PORT`: Puerto del servidor (3000)
  - `MONGO_URI`: Cadena de conexión a MongoDB Atlas

**`package.json`**

- **Función**: Configuración del proyecto Node.js
- **Contenido importante**:
  - `"type": "module"` - Habilita ES Modules
  - Dependencias del proyecto (Express, Mongoose, Pug, etc.)
  - Scripts de ejecución (`start`, `dev`)
  - Metadata del proyecto

---

#### **📁 routes/** - Definición de Rutas

**Función**: Define los endpoints de la API y vistas web. Son archivos **MUY SIMPLES** que solo mapean URLs a funciones del controller.

#### **📁 controllers/** - Controladores HTTP

**Función**: Manejan las peticiones HTTP (request/response). Son el **puente entre las rutas y los services**.

**Responsabilidades:**

- ✅ Recibir `req` (request) y `res` (response)
- ✅ Validar datos de entrada
- ✅ Llamar a los services apropiados
- ✅ Manejar errores con try/catch
- ✅ Formatear y enviar respuestas HTTP (JSON o HTML)
- ✅ Establecer códigos de estado (200, 201, 400, 404, 500)

**`eventosController.js`**

- Maneja tanto endpoints API (JSON) como vistas web (HTML)
- Para API: responde con `res.json()`
- Para vistas: renderiza con `res.render('template', datos)`

---

#### **📁 services/** - Lógica de Negocio

**Función**: Contienen la **lógica de negocio pura** y acceso a datos mediante Mongoose. Son el **cerebro de la aplicación**.

**Responsabilidades:**

- ✅ Operaciones CRUD usando Mongoose
- ✅ Interacción directa con MongoDB
- ✅ Validaciones de negocio complejas
- ✅ Procesamiento y transformación de datos
- ✅ Reglas de negocio (ej: "no eliminar cliente con eventos activos")

---

#### **📁 models/** - Modelos de Datos (Mongoose Schemas)

**Función**: Definen la **estructura de datos** usando Schemas de Mongoose para MongoDB.

- Define el schema de Evento con validaciones
- Relación con Cliente mediante `ObjectId`
- Enum para estados permitidos
- Valores por defecto configurados

---

#### **📁 views/** - Plantillas Pug

**Función**: Plantillas HTML para la interfaz web del sistema.

**`layout.pug`**

- Plantilla base que define la estructura común (header, nav, footer, estilos)
- Menú de navegación: Inicio, Clientes, Eventos
- Todas las demás vistas heredan de esta

**`index.pug`**

- Página principal de bienvenida
- Introducción al sistema de gestión de eventos

**`clientes.pug`**

- Lista todos los clientes en una tabla
- Muestra nombre, email, teléfono
- Formulario para crear nuevo cliente
- Botones para editar y eliminar

**`editarCliente.pug`**

- Formulario para editar un cliente existente
- Campos pre-cargados con datos actuales
- Validaciones HTML5

**`eventos.pug`**

- Lista todos los eventos en una tabla
- Muestra información del cliente asociado (usando populate)
- Formulario para crear nuevo evento
- Botones para editar y eliminar

**`editarEvento.pug`**

- Formulario para editar un evento existente
- Dropdown para seleccionar cliente
- Campos pre-cargados con datos actuales

---

#### **📁 config/** - Configuraciones

**Función**: Archivos de configuración globales del proyecto.

**`db.js`**

- Configura y establece conexión a MongoDB Atlas
- Usa variable de entorno `MONGO_URI`
- Manejo de errores de conexión
- Sale de la aplicación si falla la conexión

---

## 🗄️ **Base de Datos - MongoDB Atlas**

### **¿Dónde están los datos?**

Los datos se almacenan en **MongoDB Atlas** (nube), **NO en archivos locales**.

```
☁️ MongoDB Atlas (Internet)
  └─ Cluster: cluster0
      └─ Base de datos: (según tu MONGO_URI)
          ├─ Colección: clientes
          │   ├─ { _id: ObjectId, nombre, email, telefono }
          │   ├─ { _id: ObjectId, nombre, email, telefono }
          │   └─ ...
          │
          └─ Colección: eventos
              ├─ { _id: ObjectId, nombre, fecha, lugar, presupuesto, estado, clienteId }
              ├─ { _id: ObjectId, nombre, fecha, lugar, presupuesto, estado, clienteId }
              └─ ...
```

### **Ventajas de MongoDB Atlas:**

✅ **Base de datos en la nube** - Accesible desde cualquier lugar  
✅ **Sin instalación local** - No necesitas instalar MongoDB en tu PC  
✅ **Backups automáticos** - Tus datos están seguros  
✅ **Gratis hasta 512MB** - Perfecto para desarrollo  
✅ **Escalable** - Crece con tu proyecto

### **Cómo ver tus datos:**

1. **MongoDB Compass** (GUI recomendada):

   - Descargar: https://www.mongodb.com/try/download/compass
   - Conectar con tu `MONGO_URI`
   - Explorar colecciones visualmente

2. **MongoDB Atlas Web**:
   - Ir a: https://cloud.mongodb.com/
   - Iniciar sesión
   - Database → Browse Collections

---

#### **📁 public/** - Archivos Estáticos

**Función**: Archivos que se sirven directamente al navegador.

**`styles.css`**

- Estilos CSS para las vistas web
- Tablas, formularios, botones, etc.

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

1. ⬜ **Validaciones avanzadas** - Middleware de validación con express-validator
2. ✅ **Base de datos real** - ~~Migrar a MongoDB~~ ✅ **COMPLETADO**
3. ⬜ **Autenticación** - Sistema de login con JWT y bcrypt
4. ⬜ **Autorización** - Roles de usuario (admin, cliente, operador)
5. ⬜ **Testing** - Pruebas unitarias con Jest
6. ⬜ **Deploy** - Subir a producción (Railway, Render, o Vercel)
7. ⬜ **Módulos adicionales** - Proveedores, Invitados, Presupuestos

---

## 👥 Equipo

**Grupo 12 - IFTS**  
Proyecto de Comunicación A

---

## 📄 Licencia

ISC License - Proyecto educativo para la facultad.
