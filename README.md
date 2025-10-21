Proyecto Backend - Grupo 12 (Comisión A)
Descripción General

Aplicación web desarrollada con Node.js, Express, Pug y MongoDB (Mongoose).
Permite gestionar clientes y eventos, realizando operaciones CRUD completas desde una interfaz web y también mediante una API REST JSON.

El proyecto fue desarrollado como segunda entrega del curso Desarrollo Web Backend - IFST 29, cumpliendo con todos los criterios solicitados en la consigna del segundo parcial.

Tecnologías utilizadas

Node.js y Express → servidor web y rutas.

MongoDB + Mongoose → base de datos NoSQL y ODM.

Pug → motor de plantillas para vistas dinámicas.

dotenv → manejo seguro de variables de entorno.

Nodemon → recarga automática en desarrollo.

Instalación y configuración
1️-Clonar el repositorio
git clone <https://github.com/xxiicode/grupo12-back-ifts-comA.git>
cd grupo12-back-ifts-comA

2-Instalar dependencias
npm install

3-Configurar variables de entorno

Crear el archivo .env en la raíz del proyecto:
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/grupo12

4-Ejecutar la aplicación
npm run dev

Luego abrir en el navegador:
http://localhost:3000

Funcionalidades principales
Gestión de Clientes

Listado de clientes.

Creación, edición y eliminación.

Formulario en interfaz web.

API REST (/clientes/api).

Gestión de Eventos

Listado de eventos.

Asignación de cliente a cada evento.

Creación, edición y eliminación.

Formulario web y endpoints API (/eventos/api).

Rutas principales
Tipo	Ruta	Descripción
GET	/	Página principal
GET	/clientes	Listar clientes
POST	/clientes	Crear cliente
GET	/clientes/editar/:id	Editar cliente
POST	/clientes/editar/:id	Guardar cambios
GET	/eventos	Listar eventos
POST	/eventos	Crear evento
GET	/eventos/editar/:id	Editar evento
POST	/eventos/editar/:id	Guardar cambios

API REST (Thunder Client / Postman)
Clientes
Método	Endpoint	Descripción
GET	/clientes/api	Lista todos los clientes
POST	/clientes/api	Crea un cliente nuevo
DELETE	/clientes/api/:id	Elimina un cliente

grupo12-back-ifts-comA/
├── controllers/
│   ├── clientesController.js
│   └── eventosController.js
├── models/
│   ├── Cliente.js
│   └── Evento.js
├── routes/
│   ├── clientes.js
│   └── eventos.js
├── views/
│   ├── index.pug
│   ├── clientes.pug
│   ├── eventos.pug
│   ├── editarCliente.pug
│   └── editarEvento.pug
├── public/
│   └── styles.css
├── server.js
├── .env
├── package.json
└── README.md

Integrantes y roles
Nombre	Rol / Responsabilidad
Martín Giménez	Integración con MongoDB, controladores, vistas y documentación.
(Completá el resto de tu grupo)	...


Bibliografía y recursos consultados
Documentación oficial de Express.js
Documentación de Mongoose
Documentación de Pug
Tutoriales y clases prácticas de IFST 29