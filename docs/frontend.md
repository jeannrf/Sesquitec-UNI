# Estructura del Frontend y Vistas - Sesquitec-UNI

Este documento detalla las vistas (páginas), la estructura de rutas y la gestión de estados globales del Frontend de la aplicación.

## Estructura de Páginas y Roles

La plataforma divide las páginas en rutas públicas (acceso general) y privadas (usuarios registrados, staff o administradores).

### 1. Vistas Públicas
- **Inicio (`Home.jsx`)**:
  - Slider/Carrusel en el Hero con imágenes en bucle infinito del evento.
  - Indicadores estadísticos del Sesquicentenario.
  - Sección del "Libro de Oro" con 3 tarjetas informativas y interactivas ("Primera Versión", "Segunda Versión" y "Presentación Final") y botones para solicitar más información.
- **Eventos (`Cronograma.jsx`)**:
  - Cronograma completo de las actividades del año.
  - Filtros interactivos por búsqueda de texto, categoría, costo, estado (próximos/pasados) y **mes de manera inteligente** (se autoselecciona el mes del sistema en el que nos encontramos por defecto para mejorar la UX).
  - Modal detallado de cada ponencia y un reproductor de recapitulación (YouTube iframe) para eventos ya culminados.
- **Encuentro Internacional (`EncuentroInternacional.jsx`)**:
  - Landing del evento central con pestañas ("Conferencias", "Feria", "Cena") provistas de indicadores de borde rojo (línea roja).
  - Card grande con diseño responsivo a dos columnas que cambia dinámicamente según la pestaña seleccionada y permite la inscripción directa en el evento.
  - Ponentes confirmados de universidades prestigiosas internacionales.
- **Certificados (`Certificados.jsx`)**:
  - Permite a los usuarios y público general buscar certificados digitales emitidos ingresando el número de DNI del titular.
  - Los certificados válidos muestran opciones de descarga en PDF.
- **Validar Certificado (`Validar.jsx`)**:
  - Formulario de validación de firma para que terceros comprueben la autenticidad de un certificado ingresando su código de validación único.

### 2. Vistas de Autenticación
- **Iniciar Sesión (`IniciarSesion.jsx`)**:
  - Formulario de acceso con correo y contraseña.
- **Registrarse (`Registrarse.jsx`)**:
  - Formulario de creación de cuenta que valida la longitud del DNI (8 dígitos), contraseñas coincidentes y restringe accesos de Staff o Administradores mediante verificación segura.

### 3. Vistas Privadas
- **Mi Panel / Dashboard (`Dashboard.jsx`)**:
  - Área exclusiva para el usuario logueado.
  - Permite visualizar las entradas QR activas, editar el perfil personal y consultar el historial de eventos asistidos.
- **Consola de Administración / Staff (`Admin.jsx`)**:
  - Panel para usuarios con rol `ADMIN` o `STAFF`.
  - Permite escanear códigos QR de los tickets utilizando la cámara del dispositivo en tiempo real.
  - Provee métricas rápidas de aforo y listas de asistencia exportables por evento.

---

## Gestión de Estados Globales (React Context)

### 1. `AuthContext`
Maneja el estado de la sesión activa en el cliente:
- `user`: Almacena el objeto del usuario actual (nombres, DNI, correo, rol, tickets).
- `login(email, password)`: Valida credenciales contra `db.js` y actualiza la sesión.
- `logout()`: Elimina el estado en memoria y redirige a la raíz.
- `registerForEvent(event)`: Agrega una nueva credencial (ticket QR) al perfil del usuario actual.

### 2. `AlertContext`
Controla el despliegue de ventanas emergentes informativas en la parte superior derecha de la pantalla (alerts de éxito, advertencia, error o información) con transiciones suaves en CSS.
