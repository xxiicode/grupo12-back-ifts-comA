# Express MVC Project

Un proyecto Node.js usando Express con arquitectura MVC para trabajo universitario.

## 🚀 Características

- **Express 5.1.0** - Framework web moderno y rápido
- **Pug 3.0.3** - Motor de plantillas limpio y eficiente
- **Arquitectura MVC** - Separación clara de responsabilidades
- **Programación Asíncrona** - Mejores prácticas con async/await
- **Nodemon 3.1.10** - Servidor de desarrollo con recarga automática

## 📁 Estructura del Proyecto

```
├── app.js                 # Punto de entrada principal
├── package.json           # Dependencias y scripts
├── routes/               # Definiciones de rutas
│   └── index.js
├── controllers/          # Lógica de controladores
│   └── homeController.js
├── models/              # Modelos de datos
│   └── UserModel.js
├── views/               # Plantillas Pug
│   ├── layout.pug
│   ├── index.pug
│   └── error.pug
├── public/              # Archivos estáticos
│   └── css/
│       └── style.css
├── middleware/          # Middleware personalizado
│   └── index.js
└── .vscode/            # Configuración de VS Code
    └── tasks.json
```

## ⚡ Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000` con recarga automática.

### 3. Producción

```bash
npm start
```

## 🛠️ Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor de desarrollo con nodemon
- `npm test` - Ejecuta las pruebas (por implementar)

## 🏗️ Arquitectura MVC

### Models (Modelos)

- Contienen la lógica de datos y reglas de negocio
- Ejemplo: `UserModel.js` - Operaciones CRUD asíncronas

### Views (Vistas)

- Plantillas Pug para la presentación
- Layout base y vistas específicas
- Estilos CSS responsivos

### Controllers (Controladores)

- Manejan las solicitudes HTTP
- Conectan modelos y vistas
- Implementan lógica asíncrona con async/await

## 🔧 Características Asíncronas

El proyecto implementa buenas prácticas asíncronas:

- **Async/Await** en controladores
- **Promise-based** models
- **Error handling** con try/catch
- **Middleware** para manejo de errores

## 🎯 Desarrollo en VS Code

### Tareas disponibles (Ctrl+Shift+P → "Tasks: Run Task"):

- `Start Development Server` - Inicia con nodemon
- `Start Production Server` - Inicia en modo producción
- `Install Dependencies` - Reinstala dependencias

### Debug:

- Usa F5 para debuggear con breakpoints
- Configuraciones disponibles en `.vscode/launch.json`

## 📚 Próximos Pasos

1. **Base de Datos**: Integrar MongoDB o PostgreSQL
2. **Autenticación**: Implementar sistema de usuarios
3. **API REST**: Crear endpoints RESTful
4. **Testing**: Agregar pruebas unitarias con Jest
5. **Validación**: Implementar validación de datos

## 🤝 Contribución

Este es un proyecto educativo. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

ISC License - Proyecto educativo para la facultad.

---

**Desarrollado con ❤️ para aprender Express.js y arquitectura MVC**
