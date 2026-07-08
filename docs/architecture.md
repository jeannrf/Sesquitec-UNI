# Arquitectura del Sistema - Sesquitec-UNI

Este documento describe la arquitectura de software y flujo de datos de la plataforma **Sesquitec-UNI** para la gestión del Sesquicentenario UNI 2026.

## Vista General

La plataforma está construida bajo una arquitectura de **Single Page Application (SPA)** en el Frontend, integrada con un backend serverless provisto por **Supabase** y persistencia híbrida en el cliente.

```
       +--------------------------------------------+
       |               Frontend (SPA)               |
       |  React + Vite + TailwindCSS + Lucide Icons |
       +--------------------------------------------+
                             |
             +---------------+---------------+
             |                               |
             v                               v
+-------------------------+     +-------------------------+
|      localStorage       |     |  Supabase Client SDK    |
| (Persistencia Local de  |     | (Sincronización Asínc. |
|  Estados y Fallback)    |     |   Bidireccional en BD)  |
+-------------------------+     +-------------------------+
                                             |
                                             v
                                +-------------------------+
                                |  PostgreSQL Database    |
                                |  (Alojada en Supabase)  |
                                +-------------------------+
```

---

## Componentes de la Arquitectura

### 1. Capa de Presentación (Frontend)
- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/) como empaquetador para una compilación ultra rápida.
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) integrado a nivel de compilador Vite para máxima optimización de CSS.
- **Iconos**: [Lucide React](https://lucide.dev/) para iconos vectoriales limpios y escalables.
- **Enrutamiento**: `react-router-dom` para navegación fluida del lado del cliente.

### 2. Capa de Servicios y Estado
- **Base de Datos Local (`src/services/db.js`)**:
  - Actúa como la fuente de verdad primaria en el cliente.
  - Almacena eventos, ponencias, inscripciones, certificados y registros de escaneo QR.
  - Ofrece un mecanismo de **resiliencia y offline fallback** usando `localStorage` en caso de que los servicios cloud de Supabase no estén disponibles.
- **Sincronización con Supabase (`src/services/supabaseClient.js`)**:
  - Cuando la conexión y las credenciales de Supabase están configuradas en las variables de entorno (`.env`), el servicio `db.js` replica de forma asíncrona las transacciones críticas en la base de datos cloud de PostgreSQL en Supabase.
  - Las funciones críticas de escritura (como la inscripción a eventos `registerUserToEvent` y su cancelación `unregisterUserFromEvent`) intentan registrar el estado en el servidor de forma no bloqueante.

---

## Flujo de Datos para Inscripción a Eventos

1. El usuario hace clic en **"Más información"** o **"Inscribirse"**.
2. El sistema valida si el usuario tiene una sesión activa mediante el `AuthContext`.
3. Se invoca el método `registerUserToEvent(userEmail, eventId)` en `db.js`.
4. **Fase Local**:
   - Se reduce el aforo disponible localmente.
   - Se genera un objeto `ticket` único en formato JSON.
   - Se guarda el ticket en el perfil del usuario dentro de `localStorage`.
5. **Fase Cloud**:
   - Si `supabaseClient` está inicializado, realiza un `INSERT` asíncrono en la tabla `inscripciones` de PostgreSQL.
   - En caso de fallo o desconexión, la aplicación sigue funcionando localmente sin interrumpir la experiencia de usuario.
