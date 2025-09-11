# grupo13-back-ifts-comA

# Proyecto Backend - Grupo 13

Este es el proyecto base para comenzar con nuestro backend usando **Node.js** y **Express**.  
Ya está configurado un servidor simple que responde en la ruta principal (`/`).

## Estructura de carpetas

- **config/** → Archivos de configuración (ej: conexión a la base de datos, variables de entorno).
- **controllers/** → Funciones que manejan la lógica de cada recurso (ej: eventos).
- **models/** → Definición de los modelos/tablas de la base de datos (ej: Evento).
- **routes/** → Definición de las rutas de la aplicación y su conexión con los controladores.
- **middlewares/** → (Opcional) Validaciones, autenticación, etc.
- **views/** → (Opcional) Plantillas si el proyecto llega a usar vistas.

- **app.js** → Configuración principal de Express (middlewares, rutas, etc.).
- **server.js** → Archivo de arranque del servidor.

## Cómo iniciar el servidor

1. Instalar dependencias:
   ```bash
   npm install
   ```

## Iniciar el servidor con nodemon:

```
npm run dev (recomendado)
```
