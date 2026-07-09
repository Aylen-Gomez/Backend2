# Plataforma de Eventos e Inscripciones

Proyecto desarrollado para la materia **Backend II** utilizando **Node.js, Express y MongoDB**.

## Descripción

Esta aplicación permite gestionar una plataforma de eventos e inscripciones. En esta etapa del proyecto se implementó un sistema de usuarios con registro seguro, autenticación mediante JWT, cookies HTTP Only y rutas protegidas utilizando middleware de autenticación.

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB
* Mongoose
* bcrypt
* jsonwebtoken
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
MONGO_URI=tu_cadena_de_conexion
PORT=8080
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

4. Iniciar el servidor:

```bash
npm start
```

## Funcionalidades implementadas

### Registro seguro de usuarios

Permite crear nuevos usuarios validando la información recibida y almacenando la contraseña de forma segura utilizando bcrypt.

Validaciones implementadas:

* Todos los campos son obligatorios.
* El email debe tener un formato válido.
* La contraseña debe tener una longitud mínima de 6 caracteres.
* El email se normaliza antes de guardarse utilizando trim y lowercase.
* No se permiten usuarios registrados con el mismo email.
* La contraseña nunca se guarda en texto plano.
* La respuesta del endpoint nunca devuelve la contraseña.

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

Al iniciar sesión correctamente se genera un JWT y se almacena en una cookie llamada `currentUser` utilizando configuración HTTP Only.

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

Esta ruta requiere una cookie válida de autenticación.

### Respuesta exitosa

```json
{
  "id": "usuario_id",
  "email": "aylen@gmail.com",
  "role": "user"
}
```

La contraseña del usuario nunca es enviada en la respuesta.

---

## Logout

**POST**

```text
/api/sessions/logout
```

Elimina la cookie de autenticación del usuario.

### Respuesta

```json
{
  "message": "Logout exitoso"
}
```

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

La lógica de negocio se encuentra separada de las rutas, utilizando servicios y repositorios para la comunicación con la base de datos.

La lógica de hash de contraseñas y generación/verificación de JWT se encuentra separada en helpers reutilizables dentro de `utils`.

---

# Seguridad implementada

* Hash de contraseñas utilizando bcrypt.
* Autenticación mediante JWT.
* Token almacenado en cookie HTTP Only.
* Middleware para validar usuarios autenticados.
* Variables sensibles almacenadas mediante variables de entorno.
* No se expone información sensible del usuario en las respuestas.

---

# Variables de entorno

El proyecto utiliza un archivo `.env` para almacenar configuraciones privadas como conexión a MongoDB y claves utilizadas para JWT.

El archivo `.env` no debe subirse al repositorio.

El archivo `.env.example` contiene las variables necesarias para configurar el proyecto:

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
