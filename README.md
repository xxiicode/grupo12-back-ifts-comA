# grupo12 -back-ifts-comA

# Proyecto Backend - Grupo 12

Este es el proyecto base para comenzar con nuestro backend usando **Node.js** y **Express**.  
Ya está configurado un servidor simple que responde en la ruta principal (`/`).

##  Funcionalidades actuales
-  Módulo de Eventos:
  - Listar, crear y eliminar eventos
  - Interfaz web con vistas Pug
  - API REST para pruebas con Thunder Client
-  Próximos módulos:
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


##  Cómo ejecutar el proyecto

1. Clonar el repositorio
   ```bash
   git clone <URL-del-repo>
   cd grupo12-back-ifts-comA

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
