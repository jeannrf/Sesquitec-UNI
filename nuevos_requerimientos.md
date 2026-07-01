# Nuevos Requerimientos y Plan de Acción — Sesquicentenario UNI 150 Años

Este documento recopila las decisiones acordadas en la última reunión sobre el desarrollo de la web del Sesquicentenario de la UNI, realiza una evaluación del estado actual de las funcionalidades del prototipo frente a los requerimientos, y detalla el plan de acción técnico para su ejecución.

---

## I. RESUMEN DE LA REUNIÓN (NUEVOS REQUERIMIENTOS)

En la última sesión se definieron cambios concretos de contenido, estructura y lógica de negocio:

### 1. Estructura y Navegación
* **Reemplazo en Menú:** Eliminar la opción "Cena de Gala" y reemplazarla por **"Encuentro Internacional"**.
* **Agrupación de Fases:** Bajo el menú "Encuentro Internacional" se deben agrupar visualmente tres fases:
  1. *Encuentro Internacional (Conferencias)* (Fecha provisional: 7 al 11 de septiembre).
  2. *Feria Tecnológica Internacional*.
  3. *Cena de Reconocimiento* (Fecha provisional: 12 de septiembre).
* **Ocultación Temporal:** Ocultar en el menú de navegación general del Header las opciones de funcionalidades que aún no estén desarrolladas (ej. pasarela de pagos si se pospone).

### 2. Contenido del Home (Página Principal)
* **Calendario Oficial:** Incluir en el calendario actividades institucionales, conferencias y talleres. Los meses de **Mayo, Junio y Julio** deben mostrar las actividades oficiales ya transcurridas o programadas.
* **Banners Informativos:** Añadir franjas informativas inmediatamente después de la sección "Eventos Destacados" correspondientes a:
  * "150 Años"
  * "La propuesta de la UNI / Libro de Oro"
* **Banners de Septiembre:** Actualizar las 3 imágenes promocionales del carrusel o de la parte derecha del home para reflejar las actividades importantes de Septiembre.

### 3. Interacción con Eventos en la UI
* **Eventos Destacados:** Visualización interactiva con *hover* para mostrar información rápida.
* **Detalle del Evento ("Ver Evento"):** Habilitar una página/ventana modal de detalle que muestre:
  * Descripción ampliada, ubicación (auditorio), etiquetas temáticas (sostenibilidad, tecnología, etc.).
  * Recursos multimedia (videos embebidos de YouTube, enlaces a redes sociales).
  * Filtro por mes para eventos pasados (*recap*) y próximos.
* **Inscripción Rápida:** Botón para inscribirse directamente desde la tarjeta del evento en el cronograma.

### 4. Inscripciones y Modelo de Registro
* **Registro por Delegación:** Para la Feria y el Encuentro Internacional, las universidades socias enviarán listas oficiales de delegados (se procesará por carga masiva o manual en base de datos).
* **Inscripción Libre:** Registro directo en web habilitado a partir de **Agosto** solo para salas/auditorios con disponibilidad de aforo.
* **Sin Validación Manual:** El registro de usuarios comunes será libre (se genera la entrada QR de inmediato sin pasar por aprobación manual), excepto para la Cena de Gala donde se puedan requerir controles de invitación específicos.
* **Aforos:** Validar límites de aforo en las salas de manera estricta (ej. Teatro UNI ~960 personas).

### 5. Certificados y Gestión Documental
* **Validación Pública Simplificada:** Cualquier usuario externo debe poder buscar en la web pública introduciendo el **DNI** del participante para encontrar y descargar el PDF asociado, sin requerir iniciar sesión o validaciones adicionales.
* **Eliminación de Carga Manual de Horas:** Se descarta el campo para digitar horas académicas en la carga de certificados; estas horas irán impresas en el propio diseño del PDF del certificado.
* **Carga Masiva de Certificados:** Flujo administrativo para subir una carpeta con archivos PDF donde cada archivo esté nombrado con el DNI del participante (ej: `72341567.pdf`). El sistema indexará la ubicación de estos archivos y los asociará al evento respectivo.

### 6. Roles y Perfiles de Usuario
* **Mi Perfil:** Agregar sección "Mis Eventos" (para guardar interés o marcar eventos favoritos) al perfil de usuario junto con su historial de eventos inscritos, certificados y entradas.
* **Restricción de Edición:** Configurar desde el panel administrativo una fecha límite tras la cual los participantes no podrán modificar sus datos de inscripción a ponencias.
* **Rol de Staff (Voluntarios):** Crear el rol `STAFF`/`VOLUNTARIO` y habilitar en su interfaz de cuenta móvil la opción **"Escanear QR"** para el control de accesos a auditorios.

---

## II. DIAGNÓSTICO DEL PROTOTIPO (ESTADO DE FUNCIONALIDADES)

Tras revisar el código base actual, se determinan los siguientes avances y brechas:

| Módulo / Funcionalidad | Estado Actual en Código | Observaciones / Acción Requerida |
| :--- | :---: | :--- |
| **Menú y Navegación** | ⚠️ Parcial | Modificar [Header.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/components/layout/Header.jsx) para reemplazar "Cena de Gala" por "Encuentro Internacional" y enlazar/agrupar las subfases. Ocultar opciones incompletas. |
| **Visualización en Home** | ⚠️ Parcial | Se requiere insertar las nuevas franjas ("150 años", "Libro de Oro") y actualizar los banners y las actividades de septiembre en [Home.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/pages/Home.jsx). |
| **Hover y "Ver Evento"** | 🟢 Completado | Las tarjetas de eventos ya poseen efecto hover con información expandida y botones para Ver Evento/Ver Recap. |
| **Filtro de Cronograma por Mes** | 🟢 Completado | El cronograma incluye un selector dinámico para filtrar por mes. Solo requiere poblar Mayo, Junio y Julio con actividades oficiales. |
| **Buscador Público de Certificados** | 🟢 Completado | Implementado en [Certificados.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/pages/Certificados.jsx) mediante búsqueda directa por DNI en la base de datos de certificados. |
| **Carga Masiva de Certificados (Admin)** | ⚠️ Parcial | La UI de [Admin.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/pages/Admin.jsx) cuenta con una zona de arrastrar archivos y cola simulada. Falta integrar la subida física del archivo y eliminar la solicitud de horas. |
| **Descarga de Certificado** | ⚠️ Mock | La descarga simula generar un vector SVG. Se debe mapear para descargar el archivo PDF real o el enlace correspondiente según el DNI. |
| **Rol de Staff y Escáner QR** | ⚠️ Mock / Incompleto | El escáner QR de asistencia está en [Admin.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/pages/Admin.jsx), pero no está disponible para usuarios con rol de `STAFF` en su vista móvil. |
| **Base de Datos e Integración** | 🔴 Pendiente | Todo corre sobre `localStorage` a través del servicio [db.js](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/services/db.js). Se debe preparar la migración a MySQL / REST API para cuando OTI brinde accesos. |
| **Restricción de Modificación** | 🔴 Pendiente | Falta la lógica de bloqueo de edición por fecha límite de inscripción en el perfil del usuario. |

---

## III. ESPECIFICACIÓN DE BASE DE DATOS (REUNIÓN CON OTI)

Para la coordinación con OTI y el despliegue rápido de pruebas en Supabase, se ha creado la especificación de la base de datos en PostgreSQL en el archivo [schema.sql](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/schema.sql).

Este archivo incluye la definición de tablas, restricciones de chequeo (`CHECK constraints`), índices de rendimiento e integridad referencial (`ON DELETE CASCADE` / `ON DELETE SET NULL`).

---

## IV. PLAN DE EJECUCIÓN (PASO A PASO)

Proponemos la siguiente secuencia de desarrollo para implementar y validar los cambios solicitados:

### Fase 1: Cambios Estructurales y de UI (Front-End)
1. **Header ([Header.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/components/layout/Header.jsx)):**
   * Reemplazar el enlace del menú "Cena de Gala" por "Encuentro Internacional".
   * Agregar un menú desplegable (*dropdown*) o una estructura en la sección que agrupe las tres subfases (Encuentro Internacional - Conferencias, Feria Tecnológica, Cena de Reconocimiento).
   * Ocultar del menú aquellas secciones no prioritarias o no habilitadas.
2. **Home Page ([Home.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/pages/Home.jsx)):**
   * Incorporar la franja informativa "150 Años" y la franja "La propuesta de la UNI / Libro de Oro" después de "Eventos Destacados".
   * Actualizar las tres imágenes en la parte derecha de la cabecera para promover los eventos claves de septiembre.
3. **Poblar Calendario ([db.js](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/services/db.js)):**
   * Agregar actividades oficiales para los meses de Mayo, Junio y Julio de modo que el calendario mensual no luzca vacío.

### Fase 2: Certificados y Descargas
1. **Publicación y Búsqueda ([Certificados.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/pages/Certificados.jsx)):**
   * Comprobar que cualquier usuario puede realizar la búsqueda y descarga del certificado por DNI sin restricciones.
   * Cambiar la lógica del botón "Descargar" para que apunte al PDF real (o simule la descarga de un archivo `.pdf` con nombre `[DNI].pdf`).
2. **Carga Administrativa ([Admin.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/pages/Admin.jsx)):**
   * Quitar el campo de digitación manual de "Horas Curriculares" en la interfaz de certificados, ya que esa información estará contenida de forma nativa en el PDF.
   * Implementar la cola del cargador masivo de PDFs asociándolos por nombre de archivo (el nombre del archivo es el DNI).

### Fase 3: Roles, Seguridad y Perfiles
1. **Rol de Staff / Control QR ([Dashboard.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/pages/Dashboard.jsx) & [Admin.jsx](file:///c:/Users/JEANPIER/Desktop/Sesquitec-UNI/src/pages/Admin.jsx)):**
   * Habilitar la pestaña de "Escáner QR" en la vista móvil del Dashboard si el usuario tiene rol de `STAFF` o `VOLUNTARIO`.
   * Integrar la lógica para registrar marcas de Entrada/Salida en tiempo real y actualizar el estado a "Asistió".
2. **Restricción de Edición:**
   * Validar contra la fecha límite (`max_edit_date`) del evento antes de permitir al usuario editar o eliminar sus conferencias inscritas en el Dashboard.

### Fase 4: Integración Técnica y Despliegue
1. **Reunión con OTI:**
   * Entregar el diseño de base de datos relacional y definir endpoints.
   * Modificar el archivo `services/db.js` para migrar la lectura de `localStorage` a llamadas de API (Axios/Fetch) una vez configurado el backend de OTI.
2. **Despliegue de Pruebas:**
   * Subir la versión actual con el dominio `.edu.pe` facilitado para que el equipo organizador pueda evaluar visualmente y modificar imágenes.
