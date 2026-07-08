# Backend y Servicios Serverless - Sesquitec-UNI

Este documento describe la infraestructura del Backend, el acceso a servicios en la nube y los endpoints automáticos de la plataforma **Sesquitec-UNI**.

## Arquitectura Serverless con Supabase

La aplicación no requiere de un servidor backend tradicional (Node.js/Express, Python/Django, etc.). En su lugar, utiliza un modelo **Serverless/BaaS (Backend as a Service)** provisto por **Supabase**, el cual se comunica directamente desde el cliente React mediante la SDK de JavaScript (`@supabase/supabase-js`).

```
+------------------+                    +------------------+
|   React Client   | <================> |  Supabase Cloud  |
|  (SDK JS/HTTPS)  |                    | (Auth + REST API)|
+------------------+                    +------------------+
                                                 ||
                                                 \/
                                        +------------------+
                                        | PostgreSQL DB    |
                                        | (Tablas + RLS)   |
                                        +------------------+
```

---

## 1. Servicio de Base de Datos y APIs Autogeneradas

Supabase expone automáticamente una API RESTful segura sobre el esquema de PostgreSQL mediante **PostgREST**. Los endpoints principales y su correspondencia son:

* **Usuarios**: `POST /rest/v1/usuarios` (Registro y gestión de datos de perfil).
* **Eventos**: `GET /rest/v1/eventos` (Lectura de cronograma y aforo).
* **Inscripciones / Tickets**:
  * `POST /rest/v1/inscripciones` (Inscribir un usuario generando su ticket QR).
  * `DELETE /rest/v1/inscripciones?user_dni=eq.XXXX&event_id=eq.YYYY` (Cancelar inscripción).
* **Certificados**: `GET /rest/v1/certificados?dni=eq.XXXX` (Consulta de certificados por DNI).
* **Logs de QR**: `POST /rest/v1/qr_logs` (Registro de escaneos de asistencia).

---

## 2. Autenticación (Auth Services)

El sistema de autenticación se gestiona a través del módulo de autenticación de Supabase (o de forma simulada en local storage en caso de estar en modo offline):
- **Registro de Usuarios**: Creación de credenciales seguras.
- **Inicio de Sesión**: Generación de tokens JWT para validar el acceso en el cliente.
- **Roles y Permisos**:
  - `USER`: Egresados, estudiantes y público general.
  - `STAFF`: Personal autorizado para escanear QRs y registrar asistencia en `Admin.jsx`.
  - `ADMIN`: Administradores con acceso a todas las métricas y edición del sistema.

---

## 3. Seguridad y Políticas de Acceso (RLS)

Para proteger la base de datos de accesos indebidos desde el cliente, se recomienda activar **Row Level Security (RLS)** en Supabase:

- **Tabla `usuarios`**:
  - Lectura/Escritura: Solo permitida al propio usuario autenticado (`auth.uid() = id`).
- **Tabla `eventos`**:
  - Lectura: Pública para todos los visitantes del sitio.
  - Escritura: Restringida exclusivamente a usuarios con rol `ADMIN`.
- **Tabla `inscripciones`**:
  - Lectura/Escritura: El usuario puede ver y crear sus propias inscripciones. El `STAFF` y `ADMIN` pueden leer todas para control de accesos.
- **Tabla `certificados`**:
  - Lectura: Pública (requiere ingresar el DNI del titular).
  - Escritura: Restringida a procesos de administración (`ADMIN`).
