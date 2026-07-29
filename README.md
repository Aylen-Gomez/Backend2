# Plataforma de Eventos e Inscripciones

Proyecto desarrollado para la materia **Backend II** utilizando **Node.js, Express y MongoDB**.

## Descripción

Esta aplicación permite gestionar una plataforma de eventos e inscripciones.

En esta etapa del proyecto se implementó un sistema completo de autenticación y autorización utilizando **Passport.js**, **JWT** y **cookies HTTP Only**, junto con la entidad principal del sistema: **Eventos**.

La aplicación permite registrar usuarios, iniciar sesión, gestionar eventos según el rol del usuario y aplicar reglas de negocio para controlar la creación, modificación y publicación de eventos.

Además, se incorporó un sistema de autorización basado en roles (`user`, `organizer` y `admin`), filtros avanzados, paginación y ordenamiento para el listado de eventos.

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

| Acción | user | organizer | admin |
| ------- | ---- | --------- | ----- |
| Consultar eventos | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Cambiar estado de eventos propios | ❌ | ✅ | ✅ |
| Acceder a ruta administrativa | ❌ | ❌ | ✅ |

---

# Funcionalidades implementadas

## Registro seguro de usuarios

El registro se realiza mediante la estrategia **register** de Passport.

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

## Autenticación con Passport.js

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

---

# Gestión de eventos

Se implementó la entidad **Event** con los siguientes campos:

* title
* description
* category
* date
* location
* capacity
* price
* status
* organizer

El campo **organizer** almacena una referencia (`ObjectId`) al usuario creador del evento.

Los estados permitidos son:

* draft
* published
* cancelled
* finished

---

# Validaciones de negocio

Las validaciones fueron implementadas en la capa **Services**.

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

Genera un JWT y crea una cookie HTTP Only.

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

## Listar eventos

**GET**

```text
/api/events
```

Ruta pública.

Permite utilizar:

### Filtros

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

La respuesta devuelve:

* data
* page
* limit
* total
* totalPages

---

## Obtener un evento

**GET**

```text
/api/events/:id
```

Ruta pública.

Devuelve la información completa de un evento.

---

## Crear evento

**POST**

```text
/api/events
```

Acceso:

* organizer
* admin

El organizador se asigna automáticamente utilizando el usuario autenticado.

---

## Modificar evento

**PUT**

```text
/api/events/:id
```

Permisos:

* organizer únicamente sobre eventos propios.
* admin sobre cualquier evento.

---

## Cambiar estado del evento

**PATCH**

```text
/api/events/:id/status
```

Permite modificar el estado de un evento respetando las reglas de negocio.

---

## Ruta administrativa

**GET**

```text
/api/events/users
```

Acceso exclusivo para usuarios con rol **admin**.

---

# Códigos de respuesta

## 401 Unauthorized

Se devuelve cuando el usuario no posee una sesión válida.

Ejemplos:

* Acceder a rutas protegidas sin iniciar sesión.
* Cookie JWT inexistente o inválida.

---

## 403 Forbidden

Se devuelve cuando el usuario está autenticado pero no posee permisos suficientes.

Ejemplos:

* Un user intentando crear eventos.
* Un organizer intentando modificar un evento ajeno.
* Un organizer intentando acceder a una ruta exclusiva para admin.

---

# Arquitectura

El proyecto utiliza arquitectura en capas.

Estructura principal:

* Routes
* Controllers
* Services
* Repositories
* Models
* Middlewares
* Utils
* Config

La lógica de negocio se implementa en **Services**.

El acceso a datos se realiza mediante **Repositories**.

Los **Controllers** únicamente gestionan las peticiones y respuestas HTTP.

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

---

# Variables de entorno

El proyecto utiliza un archivo `.env`.

El archivo **no debe subirse al repositorio**.

Archivo `.env.example`:

```env
PORT=8080
MONGO_URI=tu_cadena_de_conexion
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

---

# Autor

**Aylen Gomez**


