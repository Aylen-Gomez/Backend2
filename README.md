# Plataforma de Eventos e Inscripciones

Proyecto desarrollado para la materia **Backend II** utilizando **Node.js, Express y MongoDB**.

## Descripción

Esta aplicación permite gestionar una plataforma de eventos e inscripciones. En esta etapa del proyecto se implementó el registro seguro de usuarios, aplicando buenas prácticas de arquitectura en capas y almacenamiento seguro de contraseñas.

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB
* Mongoose
* bcrypt
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
```

4. Iniciar el servidor:

```bash
npm start
```

## Endpoint disponible

### Registrar usuario

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

### Validaciones implementadas

* Todos los campos son obligatorios.
* El email debe tener un formato válido.
* La contraseña debe tener al menos 6 caracteres.
* El email se normaliza antes de guardarse (trim y minúsculas).
* No se permiten usuarios con el mismo email.
* La contraseña se almacena utilizando bcrypt.
* La respuesta del endpoint nunca devuelve la contraseña.

## Arquitectura

El proyecto está organizado utilizando arquitectura en capas.

* Routes
* Controllers
* Services
* Repositories
* Models

Además, la lógica para el hash de contraseñas se encuentra separada en un helper reutilizable.

## Variables de entorno

El proyecto utiliza un archivo `.env` para almacenar la configuración del servidor y la conexión con MongoDB.

El archivo `.env` no debe subirse al repositorio.

## Autor

Aylen Gomez
