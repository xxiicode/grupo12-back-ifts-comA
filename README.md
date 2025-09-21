# grupo12 -back-ifts-comA

# Proyecto Backend - Grupo 12

Este es el proyecto base para comenzar con nuestro backend usando **Node.js** y **Express**.  
Ya está configurado un servidor simple que responde en la ruta principal (`/`).

## Funcionalidades actuales

- Módulo de Eventos:
- Listar, crear y eliminar eventos
- Interfaz web con vistas Pug
- API REST para pruebas con Thunder Client
- Próximos módulos:
- Clientes
- Proveedores
- Invitados

## Estructura de carpetas

- **config/** → Archivos de configuración (ej: conexión a la base de datos, variables de entorno).
- **controllers/** → Funciones que manejan la lógica de cada recurso (ej: eventos).
- **models/** → Definición de los modelos/tablas de la base de datos (ej: Evento).
- **routes/** → Definición de las rutas de la aplicación y su conexión con los controladores.
- **middlewares/** → (Opcional) Validaciones, autenticación, etc.
- **views/** → (Opcional) Plantillas si el proyecto llega a usar vistas.
- **public/** → Archivos estáticos (CSS, imágenes, JS)
- **data/** → Archivos JSON usados como "base de datos"

- **app.js** → Configuración principal de Express (middlewares, rutas, etc.).
- **server.js** → Archivo de arranque del servidor.

## Cómo ejecutar el proyecto

1. Clonar el repositorio
   ```bash
   git clone <URL-del-repo>
   cd grupo12-back-ifts-comA
   ```

## Cómo iniciar el servidor

1. Instalar dependencias:
   ```bash
   npm install
   ```

## Iniciar el servidor con nodemon:

```
npm run dev (recomendado)
```

## Abrir en el navegador

http://localhost:3000/

# Cambios Recientes

- **Migración a ES Modules**: Se actualizó el proyecto para usar ES Modules (`import/export`) en lugar de CommonJS (`require`)
- **Refactorización de Rutas**: Se ajustaron las rutas para que la lógica se maneje principalmente en los controllers, siguiendo mejores prácticas de arquitectura MVC
- **Implementación de Services**: Se crearon services para separar la lógica de negocio de los controllers, mejorando la organización del código
- **Nuevas Dependencias**:
  - **dotenv**: Para manejo de variables de entorno
  - **method-override**: Para soporte de métodos HTTP PUT y DELETE en formularios
- **Reorganización del Código**: Se ordenaron y estructuraron mejor los archivos y carpetas basándose en lo visto en clase
