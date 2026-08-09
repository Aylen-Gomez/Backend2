# Plataforma de Eventos e Inscripciones

Proyecto desarrollado para la materia **Backend II** utilizando **Node.js, Express y MongoDB**.

## Descripción

Esta aplicación permite gestionar una plataforma de eventos e inscripciones.

El proyecto cuenta con un sistema de autenticación y autorización utilizando **Passport.js, JWT y cookies HTTP Only**, junto con la gestión de eventos, usuarios y tickets/inscripciones.

La aplicación permite registrar usuarios, iniciar sesión, gestionar eventos según el rol del usuario, publicar y cancelar eventos, realizar inscripciones, controlar los cupos disponibles, cancelar tickets y enviar emails de confirmación mediante **Nodemailer**.

Además, se incorporó un sistema de autorización basado en roles (`user`, `organizer` y `admin`), filtros, paginación y ordenamiento para los eventos.

---

# Tecnologías utilizadas

* Node.js
* Express
* MongoDB
* Mongoose
* bcrypt
* jsonwebtoken
* Passport.js
* passport-local
* passport-jwt
* cookie-parser
* dotenv
* Nodemailer

---

# Instalación

1. Clonar el repositorio.

2. Instalar las dependencias:

```bash
npm install
```

3. Crear un archivo `.env` tomando como referencia el archivo `.env.example`.

Ejemplo:

```env
PORT=8080
MONGO_URI=tu_cadena_de_conexion
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
NODE_ENV=development

MAIL_HOST=tu_servidor_smtp
MAIL_PORT=587
MAIL_USER=tu_email
MAIL_PASS=tu_password_o_app_password
MAIL_FROM=tu_email
```

4. Iniciar el servidor:

```bash
npm start
```

---

# Roles implementados

El sistema cuenta con tres tipos de usuarios:

* `user`
* `organizer`
* `admin`

Durante el registro público todos los usuarios se crean automáticamente con el rol **user**.

Los roles **organizer** y **admin** únicamente pueden asignarse desde la base de datos o mediante procesos administrativos.

---

# Matriz de permisos

| Acción                                | user | organizer | admin |
| ------------------------------------- | ---- | --------- | ----- |
| Consultar eventos                     | ✅    | ✅         | ✅     |
| Crear eventos                         | ❌    | ✅         | ✅     |
| Modificar eventos propios             | ❌    | ✅         | ✅     |
| Modificar cualquier evento            | ❌    | ❌         | ✅     |
| Cambiar estado de eventos propios     | ❌    | ✅         | ✅     |
| Inscribirse a eventos                 | ✅    | ✅         | ✅     |
| Consultar mis tickets                 | ✅    | ✅         | ✅     |
| Cancelar ticket propio                | ✅    | ✅         | ✅     |
| Cancelar cualquier ticket             | ❌    | ❌         | ✅     |
| Consultar tickets de un evento propio | ❌    | ✅         | ✅     |
| Consultar tickets de cualquier evento | ❌    | ❌         | ✅     |
| Acceder a ruta administrativa         | ❌    | ❌         | ✅     |

---

# Funcionalidades implementadas

## Registro seguro de usuarios

El registro se realiza mediante Passport.

Validaciones implementadas:

* Todos los campos son obligatorios.
* El email debe tener un formato válido.
* La contraseña debe tener una longitud mínima de 6 caracteres.
* El email se normaliza utilizando `trim()` y `toLowerCase()`.
* No se permiten usuarios duplicados.
* La contraseña se almacena utilizando bcrypt.
* El registro público no permite crear usuarios con rol `organizer` o `admin`.
* La respuesta nunca devuelve la contraseña del usuario.

---

# Autenticación con Passport.js

La autenticación fue centralizada en:

```text
src/config/passport.config.js
```

### Estrategia register

* Crea usuarios.
* Aplica hash a la contraseña.
* Controla usuarios duplicados.

### Estrategia login

* Busca usuarios por email.
* Valida credenciales.
* Genera un JWT.
* Crea la cookie `currentUser`.

### Estrategia current

* Lee el JWT desde la cookie.
* Valida la firma.
* Deja el usuario autenticado disponible en `req.user`.

El JWT se almacena en una cookie **HTTP Only**, por lo que las rutas protegidas utilizan la cookie de autenticación.

---

# Gestión de eventos

Se implementó la entidad **Event** con los siguientes campos:

* `title`
* `description`
* `category`
* `date`
* `location`
* `capacity`
* `price`
* `status`
* `organizer`

El campo `organizer` almacena una referencia (`ObjectId`) al usuario creador del evento.

Los estados permitidos son:

* `draft`
* `published`
* `cancelled`
* `finished`

Los eventos deben encontrarse en estado `published` para permitir nuevas inscripciones.

---

# Validaciones de eventos

Las validaciones se implementan en la capa **Services**.

Reglas implementadas:

* No se pueden crear eventos con fecha pasada.
* La capacidad debe ser mayor a 0.
* El precio no puede ser negativo.
* Solo se permiten estados válidos.
* No se pueden modificar eventos cancelados.
* No se pueden publicar eventos finalizados o cancelados.
* El organizador se asigna automáticamente desde el usuario autenticado.
* Un organizer solo puede modificar sus propios eventos.
* Un admin puede modificar cualquier evento.

---

# Listado de eventos

El endpoint permite consultar eventos utilizando filtros, paginación y ordenamiento.

### Filtros disponibles

```text
?status=published
```

```text
?category=workshop
```

```text
?location=Mar del Plata
```

```text
?dateFrom=2026-09-01&dateTo=2026-09-30
```

Los filtros pueden combinarse entre sí.

### Paginación

```text
?page=1&limit=10
```

### Ordenamiento

```text
?sort=date
```

La respuesta incluye:

* `data`
* `page`
* `limit`
* `total`
* `totalPages`

---

# Sistema de Tickets e Inscripciones

Se implementó la entidad **Ticket**, que relaciona un usuario con un evento mediante referencias de MongoDB.

El ticket contiene:

* `user`
* `event`
* `status`
* `quantity`
* `reservationCode`
* `createdAt`
* `cancelledAt`

Las referencias a usuario y evento se almacenan mediante `ObjectId`, sin guardar objetos completos embebidos.

---

# Estados de los Tickets

Los tickets pueden tener los siguientes estados:

* `confirmed`
* `pending`
* `cancelled`

Cuando una inscripción se realiza correctamente, el ticket se crea inicialmente con estado:

```text
confirmed
```

Al cancelar una inscripción, el estado cambia a:

```text
cancelled
```

El ticket no se elimina de la base de datos.

Además, se registra la fecha de cancelación mediante:

```text
cancelledAt
```

---

# Inscripción a un evento

Para realizar una inscripción es necesario estar autenticado.

Endpoint:

**POST**

```text
/api/events/:eid/tickets
```

Body:

```json
{
  "quantity": 1
}
```

Al crear el ticket se genera automáticamente un código único de reserva utilizando:

```text
crypto.randomUUID()
```

Ejemplo:

```text
3772c8af-46d4-4998-bc80-a5cf9642d1b2
```

---

# Validaciones de inscripción

Las validaciones de inscripción se encuentran en la capa **Services**.

Antes de crear un ticket se verifica:

* Que el evento exista.
* Que el evento esté en estado `published`.
* Que el evento no esté cancelado.
* Que el evento no haya finalizado.
* Que `quantity` sea mayor a 0.
* Que haya suficiente capacidad disponible.
* Que el usuario no tenga una inscripción activa previa para el mismo evento.

Si el usuario ya posee un ticket activo para ese evento, no se permite crear una segunda inscripción.

---

# Control de cupos

La capacidad disponible se controla utilizando la cantidad de entradas reservadas por los tickets activos.

Los tickets con estado:

```text
cancelled
```

no ocupan cupo.

El sistema calcula la cantidad reservada y verifica:

```text
reserved + quantity <= event.capacity
```

Si no existen suficientes cupos disponibles, la inscripción es rechazada.

---

# Cancelación de tickets

Las inscripciones pueden cancelarse sin eliminar el documento de la base de datos.

Endpoint:

**PATCH**

```text
/api/tickets/:tid/cancel
```

Al cancelar:

```text
status = cancelled
```

y se registra:

```text
cancelledAt = fecha de cancelación
```

El sistema valida:

* Que el ticket exista.
* Que no esté cancelado previamente.
* Que el usuario sea dueño del ticket.
* Que el usuario tenga rol `admin`, en caso de cancelar un ticket perteneciente a otra persona.

Al quedar el ticket en estado `cancelled`, deja automáticamente de ocupar cupo para el evento.

---

# Mis Tickets

Los usuarios autenticados pueden consultar sus propias inscripciones.

Endpoint:

**GET**

```text
/api/tickets/my-tickets
```

La consulta devuelve únicamente los tickets pertenecientes al usuario autenticado.

Los datos del evento se obtienen mediante `populate`, incluyendo:

* `title`
* `date`
* `location`

No se exponen datos sensibles de otros usuarios.

---

# Tickets de un evento

Los organizadores pueden consultar los tickets correspondientes a sus propios eventos.

Los administradores pueden consultar los tickets de cualquier evento.

Endpoint:

**GET**

```text
/api/events/:eid/tickets
```

Permisos:

* `organizer`: únicamente eventos propios.
* `admin`: cualquier evento.
* `user`: no tiene acceso.

El sistema valida que el evento exista y que el organizador autenticado sea propietario del evento.

---

# Notificaciones por Email

Al confirmar una inscripción se envía automáticamente un email al usuario mediante **Nodemailer**.

El email contiene información relacionada con la inscripción, incluyendo:

* Confirmación de la inscripción.
* Nombre del evento.
* Cantidad de entradas.
* Código de reserva.

Ejemplo de asunto:

```text
Inscripción confirmada
```

El envío utiliza variables de entorno y no contiene credenciales hardcodeadas en el código.

---

# Configuración de Nodemailer

Las credenciales del servidor de correo se almacenan mediante variables de entorno.

Variables utilizadas:

```env
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

Estas variables deben configurarse en `.env`.

El archivo `.env` **no debe subirse al repositorio**.

El proyecto incluye un archivo `.env.example` para indicar las variables necesarias sin exponer credenciales reales.

---

# Endpoints disponibles

## Registrar usuario

**POST**

```text
/api/sessions/register
```

---

## Login

**POST**

```text
/api/sessions/login
```

Genera un JWT y crea la cookie HTTP Only `currentUser`.

---

## Usuario autenticado

**GET**

```text
/api/sessions/current
```

Requiere autenticación.

---

## Logout

**POST**

```text
/api/sessions/logout
```

Elimina la cookie de autenticación.

---

# Eventos

## Listar eventos

**GET**

```text
/api/events
```

Ruta pública.

Permite filtros, paginación y ordenamiento.

---

## Obtener un evento

**GET**

```text
/api/events/:id
```

Ruta pública.

---

## Crear evento

**POST**

```text
/api/events
```

Acceso:

* `organizer`
* `admin`

---

## Modificar evento

**PUT**

```text
/api/events/:id
```

Permisos:

* `organizer`: únicamente eventos propios.
* `admin`: cualquier evento.

---

## Cambiar estado del evento

**PATCH**

```text
/api/events/:id/status
```

Permite modificar el estado del evento respetando las reglas de negocio.

---

# Tickets

## Crear inscripción

**POST**

```text
/api/events/:eid/tickets
```

Acceso:

* Usuario autenticado.

Body:

```json
{
  "quantity": 1
}
```

---

## Consultar mis tickets

**GET**

```text
/api/tickets/my-tickets
```

Acceso:

* Usuario autenticado.

Devuelve únicamente los tickets del usuario autenticado.

---

## Consultar tickets de un evento

**GET**

```text
/api/events/:eid/tickets
```

Acceso:

* `organizer`: únicamente eventos propios.
* `admin`: cualquier evento.

---

## Cancelar ticket

**PATCH**

```text
/api/tickets/:tid/cancel
```

Acceso:

* Dueño del ticket.
* `admin`.

---

# Ruta administrativa

**GET**

```text
/api/events/users
```

Acceso exclusivo para usuarios con rol:

```text
admin
```

---

# Códigos de respuesta

## 200 OK

La operación fue realizada correctamente.

---

## 201 Created

Se utiliza cuando se crea correctamente un recurso, por ejemplo:

* usuario
* evento
* ticket

---

## 400 Bad Request

Se utiliza cuando existen errores de validación o reglas de negocio.

Ejemplos:

* Cantidad inválida.
* Evento no publicado.
* Evento cancelado.
* Evento finalizado.
* No hay cupos disponibles.
* Usuario ya inscripto.

---

## 401 Unauthorized

Se devuelve cuando el usuario no posee una sesión válida.

Ejemplos:

* Acceder a rutas protegidas sin iniciar sesión.
* Cookie JWT inexistente o inválida.

---

## 403 Forbidden

Se devuelve cuando el usuario está autenticado pero no posee permisos suficientes.

Ejemplos:

* Un `user` intentando crear eventos.
* Un `organizer` intentando modificar un evento ajeno.
* Un usuario intentando cancelar un ticket ajeno.
* Un `user` intentando consultar los tickets de un evento.
* Un `organizer` intentando consultar los tickets de un evento que no le pertenece.
* Acceder a una ruta exclusiva para `admin`.

---

## 404 Not Found

Se devuelve cuando el recurso solicitado no existe.

Ejemplos:

* Evento inexistente.
* Ticket inexistente.

---

# Arquitectura

El proyecto utiliza arquitectura en capas.

Estructura principal:

```text
src/
├── config/
├── controllers/
├── dao/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
└── app.js
```

Flujo general:

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

La lógica de negocio se implementa principalmente en **Services**.

El acceso a datos se realiza mediante **Repositories** y **DAO**.

Los **Controllers** gestionan las peticiones y respuestas HTTP.

---

# Seguridad implementada

* Hash de contraseñas utilizando bcrypt.
* Autenticación mediante JWT.
* Cookies HTTP Only.
* Passport Local.
* Passport JWT.
* Autorización basada en roles.
* Validación de propiedad de recursos.
* Validaciones de negocio en la capa Services.
* Variables sensibles mediante `.env`.
* No se exponen contraseñas ni información sensible.
* No se almacenan credenciales de email directamente en el código.
* Los tickets utilizan referencias a usuarios y eventos en lugar de objetos embebidos.

---

# Variables de entorno

El proyecto utiliza un archivo `.env`.

El archivo `.env` **no debe subirse al repositorio**.

Archivo `.env.example`:

```env
PORT=8080
MONGO_URI=tu_cadena_de_conexion
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
NODE_ENV=development

MAIL_HOST=tu_servidor_smtp
MAIL_PORT=587
MAIL_USER=tu_email
MAIL_PASS=tu_password_o_app_password
MAIL_FROM=tu_email
```

No se deben incluir credenciales reales en este archivo.

---

# Casos de prueba de la Pre-entrega 7

Antes de la entrega se deben verificar los siguientes escenarios:

1. Inscripción exitosa y recepción del email de confirmación.
2. Inscripción sin sesión → `401 Unauthorized`.
3. Inscripción a evento inexistente → `404 Not Found`.
4. Inscripción a evento cancelado o finalizado → error de negocio.
5. Inscripción sin cupos suficientes → error de negocio.
6. Inscripción duplicada activa → error de negocio.
7. Cancelación propia → el ticket queda `cancelled` y el cupo vuelve a estar disponible.
8. Usuario intentando cancelar un ticket ajeno → `403 Forbidden`.
9. Usuario común intentando consultar tickets de un evento → `403 Forbidden`.
10. Organizer intentando consultar tickets de un evento ajeno → `403 Forbidden`.

---

# Entrega

El repositorio debe incluir:

* `package.json`
* `.gitignore`
* `.env.example`
* `README.md`

No se deben subir:

* `.env`
* `node_modules`
* Contraseñas
* Credenciales de servicios externos
* Información sensible

---

# Autor

**Aylen Gomez**


