# Plataforma de Eventos e Inscripciones

Proyecto desarrollado para la materia **Backend II**, utilizando **Node.js, Express y MongoDB**.

La aplicación permite gestionar eventos, usuarios e inscripciones mediante un sistema de autenticación con **Passport.js, JWT y cookies HTTP Only**, incorporando además autorización basada en roles, control de cupos, tickets, filtros, paginación, ordenamiento y envío de emails de confirmación.

---

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB
* Mongoose
* Passport.js
* passport-local
* passport-jwt
* JWT
* bcrypt
* cookie-parser
* dotenv
* Nodemailer

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd backend2
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Ejemplo:

```env
MONGO_URL=tu_cadena_de_conexion
PORT=8080

JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h

NODE_ENV=development

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_email
MAIL_PASS=tu_password_de_aplicacion
MAIL_FROM=tu_email
```

El archivo `.env` contiene información sensible y no debe subirse al repositorio.

### 4. Iniciar el servidor

Modo normal:

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

El servidor utiliza el puerto configurado en `PORT` o, en caso de no estar definido, el puerto `8080`.

---

# Arquitectura

El proyecto utiliza una arquitectura en capas para separar responsabilidades y mantener el código organizado y desacoplado.

La estructura principal es:

```text
src/
├── config/
├── controllers/
├── dao/
├── dto/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js
```

El flujo general de una petición es:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
DAO
   ↓
Models
   ↓
MongoDB
```

Los DTO se utilizan para controlar la información que se devuelve al cliente.

---

## Responsabilidad de cada capa

### Controllers

Los Controllers se encargan de manejar las peticiones HTTP.

Sus principales responsabilidades son:

* Obtener información de `body`, `params` y `query`.
* Obtener el usuario autenticado cuando corresponde.
* Llamar al Service correspondiente.
* Construir la respuesta HTTP.
* Manejar la respuesta al cliente.

Los Controllers no acceden directamente a los modelos de Mongoose ni contienen la lógica principal de negocio.

### Services

Los Services contienen la lógica de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

* Validar reglas de negocio.
* Controlar los estados de los eventos.
* Validar disponibilidad de cupos.
* Evitar inscripciones duplicadas.
* Validar permisos sobre recursos.
* Gestionar la cancelación de tickets.
* Coordinar el envío de emails.
* Utilizar los Repositories para acceder a los datos.

### Repositories

Los Repositories funcionan como una capa intermedia entre los Services y los DAO.

El proyecto cuenta con:

* `UserRepository`
* `EventRepository`
* `TicketRepository`

Los Repositories exponen operaciones relacionadas con las necesidades de cada entidad y delegan el acceso a datos en los DAO.

### DAO

Los DAO son responsables del acceso directo a MongoDB mediante Mongoose.

El proyecto cuenta con:

* `UserDAO`
* `EventDAO`
* `TicketDAO`

Los modelos de Mongoose son utilizados directamente desde esta capa.

### DTO

Los DTO permiten controlar qué información se expone en las respuestas de la API.

El proyecto utiliza:

* `UserDTO`
* `EventDTO`
* `TicketDTO`

Entre otras cosas, permiten evitar la exposición de información sensible como las contraseñas.

---

# Roles

El sistema cuenta con tres roles:

* `user`
* `organizer`
* `admin`

Los usuarios registrados públicamente reciben automáticamente el rol `user`.

Los roles `organizer` y `admin` no pueden ser asignados mediante el registro público y deben establecerse mediante procesos administrativos o directamente en la base de datos.

---

# Matriz de permisos

| Acción                                | user | organizer | admin |
| ------------------------------------- | :--: | :-------: | :---: |
| Consultar eventos                     |   ✅  |     ✅     |   ✅   |
| Crear eventos                         |   ❌  |     ✅     |   ✅   |
| Modificar eventos propios             |   ❌  |     ✅     |   ✅   |
| Modificar cualquier evento            |   ❌  |     ❌     |   ✅   |
| Cambiar estado de eventos propios     |   ❌  |     ✅     |   ✅   |
| Inscribirse a eventos                 |   ✅  |     ✅     |   ✅   |
| Consultar mis tickets                 |   ✅  |     ✅     |   ✅   |
| Cancelar ticket propio                |   ✅  |     ✅     |   ✅   |
| Cancelar ticket ajeno                 |   ❌  |     ❌     |   ✅   |
| Consultar tickets de un evento propio |   ❌  |     ✅     |   ✅   |
| Consultar tickets de cualquier evento |   ❌  |     ❌     |   ✅   |
| Consultar usuarios                    |   ❌  |     ❌     |   ✅   |

---

# Autenticación

La autenticación se implementa utilizando **Passport.js**, JWT y cookies HTTP Only.

La configuración principal se encuentra en:

```text
src/config/passport.config.js
```

Se utilizan estrategias para:

### Registro

* Crear nuevos usuarios.
* Normalizar el email.
* Verificar que no exista otro usuario con el mismo email.
* Hashear la contraseña mediante bcrypt.
* Crear el usuario con rol `user`.

### Login

* Buscar el usuario mediante su email.
* Validar la contraseña utilizando bcrypt.
* Generar un JWT.
* Guardar el JWT en la cookie `currentUser`.

### Current

La estrategia `current`:

* Obtiene el JWT desde la cookie.
* Valida el token.
* Identifica al usuario autenticado.
* Deja disponible la información del usuario mediante `req.user`.

Las rutas protegidas utilizan:

```javascript
passport.authenticate("current", { session: false })
```

---

# Registro de usuarios

### Endpoint

```http
POST /api/sessions/register
```

El registro contempla las siguientes validaciones:

* Campos obligatorios.
* Formato válido de email.
* Contraseña con una longitud mínima de 6 caracteres.
* Normalización del email mediante `trim()` y `toLowerCase()`.
* Control de usuarios duplicados.
* Hash de contraseña mediante bcrypt.
* Asignación automática del rol `user`.

La contraseña nunca se devuelve en las respuestas mediante los DTO correspondientes.

---

# Eventos

La entidad `Event` contiene información relacionada con los eventos disponibles en la plataforma.

Campos principales:

* `title`
* `description`
* `category`
* `date`
* `location`
* `capacity`
* `price`
* `status`
* `organizer`

El campo `organizer` almacena una referencia `ObjectId` al usuario responsable del evento.

### Estados disponibles

* `draft`
* `published`
* `cancelled`
* `finished`

Solo los eventos en estado `published` permiten nuevas inscripciones.

---

# Validaciones de eventos

Las reglas de negocio se encuentran principalmente en la capa Services.

Se valida que:

* La fecha del evento no sea anterior a la fecha actual.
* La capacidad sea mayor a `0`.
* El precio no sea negativo.
* El estado pertenezca a los estados permitidos.
* Los eventos cancelados no puedan modificarse.
* Los eventos finalizados o cancelados no puedan volver a publicarse.
* El organizador sea asignado a partir del usuario autenticado.
* Un `organizer` solamente pueda modificar sus propios eventos.
* Un `admin` pueda modificar cualquier evento.

---

# Listado de eventos

Los eventos pueden consultarse mediante filtros, paginación y ordenamiento.

### Endpoint

```http
GET /api/events
```

La ruta es pública.

### Filtros

Por estado:

```text
/api/events?status=published
```

Por categoría:

```text
/api/events?category=workshop
```

Por ubicación:

```text
/api/events?location=Mar del Plata
```

Por rango de fechas:

```text
/api/events?dateFrom=2026-09-01&dateTo=2026-09-30
```

Los filtros pueden combinarse.

### Paginación

```text
/api/events?page=1&limit=10
```

### Ordenamiento

```text
/api/events?sort=date
```

La respuesta incluye información relacionada con:

* Eventos obtenidos.
* Página actual.
* Límite de resultados.
* Cantidad total.
* Cantidad total de páginas.

---

# Sistema de tickets e inscripciones

La entidad `Ticket` representa la inscripción de un usuario a un evento.

Contiene información como:

* `user`
* `event`
* `status`
* `quantity`
* `reservationCode`
* `createdAt`
* `cancelledAt`

Las relaciones con usuarios y eventos se almacenan mediante referencias `ObjectId`.

---

# Estados de los tickets

Los tickets pueden encontrarse en los siguientes estados:

* `confirmed`
* `pending`
* `cancelled`

Cuando una inscripción se realiza correctamente, el ticket se crea con estado:

```text
confirmed
```

Al cancelar una inscripción:

```text
status = cancelled
```

Además, se registra la fecha de cancelación mediante:

```text
cancelledAt
```

El documento no se elimina de la base de datos.

---

# Inscripción a un evento

Para inscribirse es necesario estar autenticado.

### Endpoint

```http
POST /api/events/:eid/tickets
```

### Body

```json
{
    "quantity": 1
}
```

Al realizar la inscripción se genera automáticamente un código de reserva único utilizando:

```javascript
crypto.randomUUID()
```

---

# Validaciones de inscripción

Antes de crear un ticket se verifica:

* Que el evento exista.
* Que el evento se encuentre publicado.
* Que el evento no esté cancelado.
* Que el evento no haya finalizado.
* Que la cantidad solicitada sea mayor a `0`.
* Que exista capacidad disponible.
* Que el usuario no tenga una inscripción activa previa para el mismo evento.

Si el usuario ya posee una inscripción activa para el evento, se rechaza la operación.

---

# Control de cupos

La capacidad se controla utilizando la cantidad de entradas correspondientes a los tickets activos.

Los tickets cancelados dejan de ocupar cupo.

La validación se realiza conceptualmente mediante:

```text
reserved + quantity <= event.capacity
```

De esta manera, no es posible superar la capacidad máxima configurada para el evento.

---

# Cancelación de tickets

Los tickets pueden cancelarse sin eliminarse de la base de datos.

### Endpoint

```http
PATCH /api/tickets/:tid/cancel
```

Al cancelar un ticket:

```text
status = cancelled
```

y se registra:

```text
cancelledAt = fecha de cancelación
```

Se verifica:

* Que el ticket exista.
* Que no esté cancelado previamente.
* Que el usuario sea propietario del ticket.
* Que el usuario tenga rol `admin` cuando intenta cancelar un ticket perteneciente a otra persona.

Una vez cancelado, el ticket deja de ocupar capacidad del evento.

---

# Mis tickets

Los usuarios autenticados pueden consultar sus propias inscripciones.

### Endpoint

```http
GET /api/tickets/my-tickets
```

La consulta devuelve únicamente los tickets pertenecientes al usuario autenticado.

Los datos relacionados con el evento pueden obtenerse mediante `populate`.

La información sensible del usuario relacionado es filtrada mediante `TicketDTO`.

---

# Tickets de un evento

Los organizadores y administradores pueden consultar los tickets correspondientes a un evento.

### Endpoint

```http
GET /api/events/:eid/tickets
```

Permisos:

* `organizer`: únicamente eventos propios.
* `admin`: cualquier evento.
* `user`: no tiene acceso.

Antes de devolver los tickets se verifica la existencia del evento y los permisos del usuario autenticado.

---

# Notificaciones por email

Cuando se confirma una inscripción, el sistema puede enviar un email de confirmación utilizando **Nodemailer**.

El email contiene información relacionada con la inscripción, como:

* Confirmación de la inscripción.
* Nombre del evento.
* Cantidad de entradas.
* Código de reserva.

El envío se configura mediante variables de entorno.

Las credenciales del servicio de correo no se encuentran almacenadas directamente en el código.

---

# Endpoints

## Sesiones

### Registrar usuario

```http
POST /api/sessions/register
```

### Login

```http
POST /api/sessions/login
```

Genera el JWT y establece la cookie de autenticación `currentUser`.

### Usuario autenticado

```http
GET /api/sessions/current
```

Requiere autenticación.

### Logout

```http
POST /api/sessions/logout
```

Elimina la cookie de autenticación.

---

## Eventos

### Listar eventos

```http
GET /api/events
```

Ruta pública.

Permite filtros, paginación y ordenamiento.

### Obtener evento

```http
GET /api/events/:id
```

Ruta pública.

### Crear evento

```http
POST /api/events
```

Acceso:

* `organizer`
* `admin`

### Modificar evento

```http
PUT /api/events/:id
```

Permisos:

* `organizer`: únicamente eventos propios.
* `admin`: cualquier evento.

### Cambiar estado del evento

```http
PATCH /api/events/:id/status
```

Permisos:

* `organizer`: únicamente eventos propios.
* `admin`: cualquier evento.

---

## Tickets

### Crear inscripción

```http
POST /api/events/:eid/tickets
```

Requiere autenticación.

Body:

```json
{
    "quantity": 1
}
```

### Consultar mis tickets

```http
GET /api/tickets/my-tickets
```

Requiere autenticación.

### Consultar tickets de un evento

```http
GET /api/events/:eid/tickets
```

Permisos:

* `organizer`: evento propio.
* `admin`: cualquier evento.

### Cancelar ticket

```http
PATCH /api/tickets/:tid/cancel
```

Permisos:

* Propietario del ticket.
* `admin`.

---

# Ruta administrativa

Existe una ruta exclusiva para usuarios con rol `admin`.

### Consultar usuarios

```http
GET /api/events/users
```

Requiere autenticación y rol:

```text
admin
```

---

# Manejo de errores

La aplicación cuenta con un middleware centralizado para el manejo de errores:

```text
src/middlewares/error.middleware.js
```

Los errores pueden utilizar diferentes códigos HTTP según la situación.

### 200 — OK

La operación se realizó correctamente.

### 201 — Created

Se utiliza para la creación exitosa de recursos como:

* Usuarios.
* Eventos.
* Tickets.

### 400 — Bad Request

Se utiliza para datos inválidos o reglas de negocio incumplidas.

Ejemplos:

* Cantidad inválida.
* Capacidad inválida.
* Precio negativo.
* Evento no publicado.
* Evento cancelado.
* Evento finalizado.
* Estado inválido.
* Intento de publicar un evento que no puede ser publicado.

### 401 — Unauthorized

Se produce cuando se intenta acceder a una ruta protegida sin una autenticación válida.

### 403 — Forbidden

El usuario está autenticado, pero no posee los permisos necesarios.

Ejemplos:

* Un `user` intentando crear un evento.
* Un `organizer` intentando modificar un evento ajeno.
* Un usuario intentando consultar los tickets de un evento.
* Un `organizer` intentando consultar los tickets de un evento que no le pertenece.
* Acceder a una ruta exclusiva para `admin`.

### 404 — Not Found

El recurso solicitado no existe.

Ejemplos:

* Evento inexistente.
* Ticket inexistente.

### 409 — Conflict

Se utiliza para conflictos relacionados con el estado actual de un recurso, por ejemplo, cuando un usuario intenta realizar una segunda inscripción activa al mismo evento, siempre que esta situación sea gestionada por el controlador correspondiente.

### 500 — Internal Server Error

Se utiliza para errores internos inesperados.

El middleware centralizado toma el código disponible en `statusCode` o `status` y, en caso de no existir, utiliza `500`.

---

# Seguridad

El proyecto incorpora diferentes mecanismos de seguridad:

* Hash de contraseñas mediante bcrypt.
* Autenticación mediante JWT.
* Cookies HTTP Only.
* Passport Local.
* Passport JWT.
* Autorización basada en roles.
* Validación de propiedad de recursos.
* Validaciones de negocio en la capa Services.
* Variables sensibles mediante `.env`.
* Exclusión de `.env` mediante `.gitignore`.
* DTOs para controlar la información expuesta.
* Referencias `ObjectId` para las relaciones entre entidades.
* Credenciales de email almacenadas mediante variables de entorno.

---

# Variables de entorno

El proyecto utiliza las siguientes variables:

```env
MONGO_URL=
PORT=8080

JWT_SECRET=
JWT_EXPIRES_IN=1h

NODE_ENV=development

MAIL_HOST=
MAIL_PORT=587
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

El archivo `.env` no debe subirse al repositorio.

El proyecto incluye `.env.example` con la estructura necesaria para configurar el entorno sin incluir credenciales reales.

---

# Scripts disponibles

En `package.json` se encuentran los siguientes scripts:

### Iniciar el servidor

```bash
npm start
```

### Iniciar en modo desarrollo

```bash
npm run dev
```

El modo desarrollo utiliza `node --watch` para reiniciar automáticamente el servidor cuando se detectan cambios.

---

# Estructura de carpetas

```text
backend2/
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── env.js
│   │   └── passport.config.js
│   │
│   ├── controllers/
│   │
│   ├── dao/
│   │
│   ├── dto/
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │
│   ├── repositories/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── utils/
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# Pruebas realizadas

Durante el desarrollo se verificaron diferentes funcionalidades de la aplicación:

1. Registro de usuario.
2. Validación de usuarios duplicados.
3. Hash de contraseñas mediante bcrypt.
4. Login con credenciales válidas.
5. Generación de JWT.
6. Creación de cookie de autenticación.
7. Acceso a rutas protegidas.
8. Control de permisos mediante roles.
9. Creación de eventos.
10. Modificación de eventos.
11. Publicación de eventos.
12. Validación de estados de eventos.
13. Inscripción a eventos.
14. Control de cupos.
15. Prevención de inscripciones duplicadas.
16. Consulta de tickets propios.
17. Consulta de tickets de eventos según permisos.
18. Cancelación de tickets.
19. Conservación del ticket cancelado en la base de datos.
20. Registro de `cancelledAt`.
21. Uso de `populate` para obtener información relacionada.
22. Filtrado de información sensible mediante DTO.
23. Envío de emails de confirmación.
24. Manejo centralizado de errores.
25. Respuestas con códigos HTTP correspondientes.

---

# .gitignore

El proyecto excluye archivos y carpetas que no deben formar parte del repositorio.

```gitignore
node_modules/
.env
```

El archivo `.env` se mantiene fuera del repositorio para evitar exponer credenciales y datos sensibles.

---

# Entrega

El repositorio debe contener:

* `package.json`
* `package-lock.json`
* `.gitignore`
* `.env.example`
* `README.md`
* Código fuente dentro de `src/`

No deben subirse:

* `.env`
* `node_modules/`
* Contraseñas reales.
* Claves JWT reales.
* Credenciales de servicios externos.
* Información sensible.

---

# Autor

**Aylen Gomez**
