# Plataforma de Eventos e Inscripciones

Proyecto desarrollado para la materia **Backend II** utilizando **Node.js, Express y MongoDB**.

## Descripción

Esta aplicación permite gestionar una plataforma de eventos e inscripciones.

En esta etapa del proyecto se implementó un sistema completo de **autenticación y autorización** utilizando **Passport.js**, **JWT** y **cookies HTTP Only**.

La autenticación fue centralizada mediante estrategias de Passport para registro, login y validación del usuario actual. Además, se incorporó un sistema de autorización basado en roles (`user`, `organizer` y `admin`) para proteger rutas y controlar el acceso a distintas funcionalidades de la plataforma.

La estructura del proyecto quedó preparada para incorporar futuros proveedores de autenticación externos, como **Google** o **GitHub**, sin modificar la configuración principal de la aplicación.

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

Durante el registro público, todos los usuarios se crean automáticamente con el rol **user**.

Los roles **organizer** y **admin** únicamente pueden asignarse desde la base de datos o mediante procesos administrativos.

---

# Matriz de permisos

| Acción                        | user | organizer | admin |
| ----------------------------- | ---- | --------- | ----- |
| Consultar eventos             | ✅   | ✅         | ✅     |
| Crear eventos                 | ❌   | ✅         | ✅     |
| Modificar eventos propios     | ❌   | ✅         | ✅     |
| Modificar cualquier evento    | ❌   | ❌         | ✅     |
| Acceder a ruta administrativa | ❌   | ❌         | ✅     |

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
* La contraseña se almacena utilizando **bcrypt**.
* El registro público no permite crear usuarios con rol `organizer` o `admin`.
* La respuesta nunca devuelve la contraseña del usuario.

---

## Autenticación con Passport.js

La autenticación fue centralizada en:

```text
src/config/passport.config.js
```

### Estrategia register

Se encarga de:

* Crear usuarios.
* Aplicar hash a la contraseña.
* Controlar usuarios duplicados.
* Devolver el usuario autenticado mediante `req.user`.

### Estrategia login

Se encarga de:

* Buscar usuarios por email.
* Validar credenciales.
* Rechazar credenciales inválidas con un mensaje genérico.

Luego de una autenticación exitosa, el controller:

* Genera el JWT.
* Crea la cookie `currentUser`.
* Devuelve la información pública del usuario.

### Estrategia current

Se encarga de:

* Leer el JWT desde la cookie `currentUser`.
* Validar la firma del token.
* Dejar el payload disponible en `req.user`.

---

# Endpoints disponibles

## Registrar usuario

**POST**

```text
/api/sessions/register
```

### Body esperado

```json
{
  "first_name": "Aylen",
  "last_name": "Gomez",
  "email": "aylen@gmail.com",
  "password": "123456"
}
```

### Respuesta exitosa

```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "first_name": "Aylen",
    "last_name": "Gomez",
    "email": "aylen@gmail.com",
    "role": "user"
  }
}
```

---

## Login de usuario

**POST**

```text
/api/sessions/login
```

### Body esperado

```json
{
  "email": "aylen@gmail.com",
  "password": "123456"
}
```

### Respuesta exitosa

```json
{
  "message": "Login exitoso",
  "user": {
    "id": "usuario_id",
    "email": "aylen@gmail.com",
    "role": "user"
  }
}
```

Al iniciar sesión correctamente se genera un JWT firmado con `JWT_SECRET` y se almacena en una cookie llamada `currentUser`.

Configuración de la cookie:

* `httpOnly: true`
* `sameSite: "lax"`
* `maxAge: 3600000`
* `secure` únicamente en producción

### Error

```json
{
  "error": "Credenciales inválidas"
}
```

---

## Usuario autenticado

**GET**

```text
/api/sessions/current
```

Requiere una cookie JWT válida.

### Respuesta exitosa

```json
{
  "id": "usuario_id",
  "email": "aylen@gmail.com",
  "role": "user"
}
```

La contraseña nunca es enviada en la respuesta.

---

## Logout

**POST**

```text
/api/sessions/logout
```

Elimina la cookie `currentUser`.

### Respuesta

```json
{
  "message": "Logout exitoso"
}
```

Esta ruta no requiere Passport.

---

## Crear evento

**POST**

```text
/api/events
```

Acceso permitido únicamente para:

* `organizer`
* `admin`

### Respuesta exitosa

```json
{
  "message": "Evento creado correctamente"
}
```

---

## Modificar evento

**PUT**

```text
/api/events/:id
```

* Un `organizer` solo puede modificar eventos propios.
* Un `admin` puede modificar cualquier evento.

### Respuesta exitosa

```json
{
  "message": "Evento actualizado correctamente"
}
```

---

## Ruta administrativa

**GET**

```text
/api/events/users
```

Acceso exclusivo para usuarios con rol `admin`.

---

# Códigos de respuesta

## 401 Unauthorized

Se devuelve cuando el usuario no posee una sesión válida o no envía la cookie JWT.

Ejemplos:

* Acceder a `/api/sessions/current` sin iniciar sesión.
* Acceder a rutas protegidas sin cookie válida.

## 403 Forbidden

Se devuelve cuando el usuario está autenticado correctamente pero su rol no posee permisos para realizar la acción solicitada.

Ejemplos:

* Un usuario con rol `user` intentando crear un evento.
* Un `organizer` intentando modificar un evento de otro `organizer`.
* Un `organizer` intentando acceder a una ruta exclusiva de `admin`.

---

# Arquitectura

El proyecto está organizado utilizando arquitectura en capas.

Estructura principal:

* Routes
* Controllers
* Services
* Repositories
* Models
* Middlewares
* Utils
* Config

La lógica de autenticación se encuentra centralizada en Passport dentro de `src/config/passport.config.js`.

La lógica de negocio permanece separada en servicios y repositorios.

La generación y validación de JWT, junto con el hash de contraseñas, se encuentran implementados en helpers reutilizables dentro de `utils`.

---

# Seguridad implementada

* Hash de contraseñas utilizando bcrypt.
* Autenticación mediante JWT.
* Cookies HTTP Only.
* Estrategias Passport Local para registro y login.
* Estrategia Passport JWT para validar sesiones.
* Sistema de autorización basado en roles.
* Validación de propiedad de recursos para eventos.
* Variables sensibles almacenadas mediante variables de entorno.
* No se exponen contraseñas ni información sensible en las respuestas.
* Las credenciales inválidas devuelven mensajes genéricos.

---

# Variables de entorno

El proyecto utiliza un archivo `.env` para almacenar configuraciones privadas.

El archivo `.env` **no debe subirse al repositorio**.

El archivo `.env.example` contiene las variables necesarias:

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


