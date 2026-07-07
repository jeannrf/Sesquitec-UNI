# Esquema de Base de Datos - Sesquitec-UNI

Este documento detalla el esquema de base de datos relacional para **PostgreSQL (Supabase)** y la estructura correspondiente en el fallback de `localStorage`.

## Tablas en PostgreSQL

### 1. `usuarios`
Almacena la información de los usuarios registrados, perfiles y roles del sistema.
* `id` (SERIAL, PRIMARY KEY): Identificador autoincremental.
* `nombres` (VARCHAR(100), NOT NULL): Nombres del usuario.
* `apellidos` (VARCHAR(100), NOT NULL): Apellidos del usuario.
* `dni` (VARCHAR(8), UNIQUE, NOT NULL): Documento de identidad de 8 caracteres.
* `email` (VARCHAR(100), UNIQUE, NOT NULL): Correo electrónico del usuario.
* `telefono` (VARCHAR(15)): Número telefónico.
* `institucion` (VARCHAR(100)): Organización o facultad de procedencia.
* `password` (VARCHAR(255), NOT NULL): Contraseña encriptada.
* `role` (VARCHAR(20), DEFAULT 'USER'): Roles permitidos: `'ADMIN'`, `'STAFF'`, `'USER'`.
* `verified` (BOOLEAN, DEFAULT FALSE): Estado de verificación de la cuenta.
* `profile_pic` (TEXT): Enlace o base64 de la imagen de perfil.
* `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

### 2. `eventos`
Almacena los eventos programados para el Sesquicentenario.
* `id` (VARCHAR(50), PRIMARY KEY): Identificador único de texto (ej. `'may1'`, `'jul2'`).
* `title` (VARCHAR(200), NOT NULL): Nombre del evento.
* `organizer` (VARCHAR(150)): Comisión u organización responsable.
* `date` (VARCHAR(50)): Fecha formateada (ej. `'15 May 2026'`).
* `time` (VARCHAR(50)): Rango de horas.
* `location` (VARCHAR(200)): Ubicación física o virtual.
* `description` (TEXT): Resumen detallado de las actividades.
* `quota` (INT, DEFAULT 0): Capacidad máxima de asistentes (0 = aforo ilimitado).
* `status` (VARCHAR(20), DEFAULT 'pre'): Estados posibles: `'pre'` (próximo), `'published'` (activo), `'post'` (finalizado).
* `is_paid` (BOOLEAN, DEFAULT FALSE): Indica si el evento tiene costo.
* `image_url` (VARCHAR(255)): URL de la imagen del banner.
* `category` (VARCHAR(50)): Categoría (ej. `'Académico'`, `'Cultural'`).
* `tags` (TEXT): Palabras clave separadas por comas (ej. `'Investigación,Innovación'`).
* `registration_open` (BOOLEAN, DEFAULT TRUE): Apertura de inscripciones.
* `max_edit_date` (TIMESTAMP WITH TIME ZONE): Límite temporal para cancelaciones.

### 3. `ponencias`
Sub-eventos o conferencias específicas asociadas a un evento principal.
* `id` (VARCHAR(50), PRIMARY KEY)
* `event_id` (VARCHAR(50), REFERENCES `eventos(id)`): Relación con el evento principal.
* `title` (VARCHAR(200), NOT NULL): Título de la conferencia.
* `speaker` (VARCHAR(150), NOT NULL): Ponente asignado.
* `room` (VARCHAR(100)): Aula o auditorio específico.
* `time` (VARCHAR(50)): Horario de inicio.
* `duration` (INT, DEFAULT 60): Duración estimada en minutos.
* `quota` (INT, DEFAULT 100): Aforo máximo permitido.

### 4. `inscripciones`
Mapea la relación de usuarios inscritos a los eventos y sus pases QR.
* `id` (SERIAL, PRIMARY KEY)
* `user_dni` (VARCHAR(8), REFERENCES `usuarios(dni)`): DNI del participante.
* `event_id` (VARCHAR(50), REFERENCES `eventos(id)`): Evento al que se inscribe.
* `status` (VARCHAR(20), DEFAULT 'Registrado'): Estados: `'Registrado'`, `'Asistió'`, `'Cancelado'`.
* `qr_code` (VARCHAR(255), UNIQUE, NOT NULL): Código alfanumérico encriptado para escaneo QR.
* `registered_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

### 5. `certificados`
Certificaciones de participación emitidas tras culminar un evento.
* `id` (VARCHAR(50), PRIMARY KEY): Identificador del certificado.
* `dni` (VARCHAR(8), NOT NULL): DNI del titular beneficiado.
* `titular` (VARCHAR(200), NOT NULL): Nombres y apellidos completos.
* `event_id` (VARCHAR(50), REFERENCES `eventos(id)`): Evento asociado.
* `fecha` (VARCHAR(50)): Fecha de emisión.
* `horas` (INT): Horas lectivas acreditadas.
* `emitido` (VARCHAR(50)): Entidad emisora.
* `tipo` (VARCHAR(50), DEFAULT 'Participación'): Tipo de certificado.
* `codigo_validacion` (VARCHAR(100), UNIQUE, NOT NULL): Hash o código de verificación pública.

### 6. `qr_logs`
Bitácora de escaneos QR realizados por el personal del evento (Staff).
* `id` (VARCHAR(50), PRIMARY KEY)
* `timestamp` (VARCHAR(100), NOT NULL): Fecha y hora del registro.
* `ticket_id` (VARCHAR(50)): ID del ticket escaneado.
* `event_title` (VARCHAR(200)): Nombre del evento.
* `user_dni` (VARCHAR(8)): DNI del participante verificado.
* `user_name` (VARCHAR(200)): Nombre completo del participante.
* `status` (VARCHAR(50)): Resultado del escaneo (ej. `'Acceso Permitido'`).
* `scanned_by` (VARCHAR(100)): Email del Staff que escaneó el QR.
* `tipo` (VARCHAR(50)): Tipo de ticket.

---

## Índices de Optimización Recomendados

Para acelerar las búsquedas concurrentes en producción, se aplican los siguientes índices B-Tree en PostgreSQL:
```sql
CREATE INDEX idx_certificados_dni ON certificados(dni);
CREATE INDEX idx_inscripciones_user_dni ON inscripciones(user_dni);
CREATE INDEX idx_inscripciones_event_id ON inscripciones(event_id);
CREATE INDEX idx_ponencias_event_id ON ponencias(event_id);
CREATE INDEX idx_qr_logs_ticket_id ON qr_logs(ticket_id);
CREATE INDEX idx_qr_logs_user_dni ON qr_logs(user_dni);
```
