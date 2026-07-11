# Plataforma de Eventos e Inscripciones

Proyecto desarrollado para la materia **Backend II** utilizando **Node.js, Express y MongoDB**.

## Descripción

Esta aplicación permite gestionar una plataforma de eventos e inscripciones.

En esta etapa del proyecto se implementó un sistema de autenticación utilizando **Passport.js**, integrando estrategias de registro, login y validación de usuario actual mediante JWT almacenado en cookies HTTP Only.

La autenticación fue organizada mediante estrategias centralizadas, dejando preparada la estructura para incorporar futuros proveedores externos como Google o GitHub sin modificar la lógica principal de la aplicación.

## Tecnologías utilizadas

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

## Instalación

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

# Funcionalidades implementadas

## Registro seguro de usuarios

Permite crear nuevos usuarios mediante una estrategia de Passport llamada `register`.

Validaciones implementadas:

* Todos los campos son obligatorios.
* El email debe tener un formato válido.
* La contraseña debe tener una longitud mínima de 6 caracteres.
* El email se normaliza antes de guardarse utilizando trim y lowercase.
* No se permiten usuarios registrados con el mismo email.
* La contraseña se almacena utilizando bcrypt.
* La respuesta nunca devuelve la contraseña del usuario.

---

## Autenticación con Passport.js

La autenticación fue refactorizada utilizando estrategias centralizadas dentro de:

```
src/config/passport.config.js
```

Estrategias implementadas:

### register

Se encarga de:

* Validar y crear usuarios.
* Aplicar hash a la contraseña.
* Controlar usuarios duplicados.
* Devolver el usuario autenticado a través de `req.user`.

### login

Se encarga de:

* Buscar usuarios por email.
* Comparar contraseñas mediante bcrypt.
* Rechazar credenciales inválidas con un mensaje genérico.

Luego de una autenticación exitosa, el controller genera el JWT y crea la cookie de autenticación.

### current

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

Configuración de cookie:

* httpOnly: true
* sameSite: lax
* maxAge: 3600000
* secure únicamente en producción

En caso de error:

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

Esta ruta utiliza la estrategia `current` de Passport y requiere una cookie JWT válida.

### Respuesta exitosa

```json
{
  "id": "usuario_id",
  "email": "aylen@gmail.com",
  "role": "user"
}
```

Nunca se devuelve la contraseña del usuario.

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

# Arquitectura

El proyecto está organizado utilizando arquitectura en capas, separando responsabilidades entre cada módulo.

Estructura principal:

* Routes
* Controllers
* Services
* Repositories
* Models
* Middlewares
* Utils
* Config

La lógica de autenticación se encuentra centralizada en Passport dentro de `config/passport.config.js`.

La lógica de negocio permanece separada en servicios y repositorios.

La generación y validación de JWT, junto con el hash de contraseñas, se encuentran separados en helpers reutilizables dentro de `utils`.

---

# Seguridad implementada

* Hash de contraseñas utilizando bcrypt.
* Autenticación mediante JWT.
* Token almacenado en cookie HTTP Only.
* Estrategias de Passport para registro, login y usuario autenticado.
* Variables sensibles almacenadas mediante variables de entorno.
* No se expone información sensible del usuario en las respuestas.
* Credenciales inválidas devuelven mensajes genéricos.

---

# Variables de entorno

El proyecto utiliza un archivo `.env` para almacenar configuraciones privadas.

El archivo `.env` no debe subirse al repositorio.

El archivo `.env.example` contiene las variables necesarias:

```env
PORT=8080
MONGO_URI=tu_cadena_de_conexion
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

---

## Autor

Aylen Gomez

