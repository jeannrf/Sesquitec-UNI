# Documento de Requerimientos - Página Sesquitec

## I. INTRODUCCIÓN

### 1.1 Propósito
El propósito de este software es transformar la plataforma web actual de la Comisión del Sesquicentenario de la Universidad Nacional de Ingeniería (UNI) en un sistema dinámico, interactivo y centralizado. El sistema tiene como objetivo:
* **Automatizar el control de asistencia y la gestión de perfiles** para los eventos académicos institucionales de la universidad.
* **Optimizar el proceso de emisión, búsqueda y validación** de certificados digitales firmados por el Rector.
* **Proveer una pasarela de pagos privada y segura** para eventos exclusivos dirigidos a egresados.

Este software resuelve la excesiva carga operativa, la falta de auditoría en los informes de asistencia manuales provistos por las facultades y el riesgo de falsificación de documentos, integrando todo el flujo en una única plataforma que sirva además como memoria histórica y legado de la universidad.

### 1.2 Alcance

#### Qué va a hacer el sistema:
1. **Gestión de Inscripción y Perfiles:** Permitirá el registro web de usuarios a múltiples ponencias de un evento principal a través de casillas de verificación en un único formulario.
2. **Control de Asistencia Digitalizado:** Generará códigos QR únicos vinculados al DNI del participante para registrar y validar de forma exacta la entrada y la salida a los auditorios, calculando de forma automática las horas extracurriculares.
3. **Módulo Autónomo de Certificados:** Permitirá la carga masiva de carpetas con archivos PDF indexados por DNI, facilitará un motor de búsqueda público para descarga de los alumnos y habilitará un validador externo de autenticidad mediante la lectura de códigos QR impresos en los certificados.
4. **Pasarela de Pagos Privada:** Habilitará un carrito de compras dinámico para la venta de entradas a la Cena de Gala de Egresados, permitiendo registrar acompañantes y procesar transacciones bancarias directas mediante Yape, Plin y tarjetas.
5. **Cronograma y Repositorio de Legado:** Estructurará un catálogo de eventos mes a mes, el cual cambiará dinámicamente de un estado de *"Pre-Evento"* (inscripciones y mapas) a un estado de *"Post-Evento"* (enlaces a informes, fotos y videos integrados desde YouTube) al finalizar cada actividad.

#### Qué NO va a hacer el sistema (Out of Scope):
* **No es un sistema de streaming de video:** La plataforma no transmitirá ponencias en vivo; los videos de los eventos se almacenarán y reproducirán embebidos exclusivamente a través de la API externa de YouTube.
* **No es un sistema de almacenamiento masivo de archivos multimedia:** Las fotografías y los informes finales de los eventos no se alojarán directamente en el servidor web de la aplicación; el sistema solo guardará los enlaces (links) hacia repositorios o nubes externas de almacenamiento.
* **No sincronizará ni cobrará trámites académicos de la UNI:** El módulo de pagos es estrictamente privado y exclusivo para el evento de la Cena de Gala de Egresados; no procesará deudas, matrículas ni certificados regulares de la universidad.
* **No reemplazará las plataformas de inscripción ya existentes en otras agrupaciones:** Si un evento específico utiliza herramientas externas (ej. Google Forms, Luma o plataformas propias), el sistema no migrará esos datos, sino que actuará como un directorio centralizado redirigiendo al usuario mediante un enlace externo.

---

## II. DESCRIPCIÓN GENERAL

### 2.1 Perspectiva del Producto
El sistema de la Página del Sesquicentenario está concebido inicialmente como una solución web autónoma que operará sobre la infraestructura de servidores proporcionada por la OTI. Sin embargo, para su correcto funcionamiento en producción, requiere integrarse de manera estrecha con un entorno de base de datos relacional suministrado por dicha oficina. 

Adicionalmente, el producto interactúa directamente con APIs y servicios de terceros, incluyendo:
* **API de Google Maps** para el renderizado de ubicaciones de auditorios.
* **API de reproducción de YouTube** para los videos de legado.
* **Scripts/APIs financieras** de entidades bancarias privadas para el procesamiento seguro de pagos.

### 2.2 Funciones del Producto
A alto nivel, las capacidades principales del sistema se resumen en cuatro pilares:
* **Centralización y Difusión:** Presentación interactiva y mensual de la agenda cultural, científica y académica de la universidad.
* **Automatización Operativa:** Gestión del ciclo completo de eventos (inscripción, control de asistencia dual con QR y cálculo de horas de permanencia).
* **Gestión Documental Confiable:** Almacenamiento indexado por DNI y motor de búsqueda pública para la consulta y descarga de certificados válidos.
* **Recaudación Segura:** Carrito de compras y pasarela electrónica para la venta controlada de entradas y registro de invitados.

### 2.3 Características de los Usuarios
* **Asistente (Estudiante / Público General):** Usuario final que ingresa a la web para consultar el cronograma, inscribirse a las ponencias, presentar su código QR de acceso, y buscar/descargar sus certificados introduciendo su DNI.
* **Egresado:** Perfil de usuario orientado a la interacción con el módulo de pagos, compra de entradas y registro de datos de sus respectivos acompañantes.
* **Operador de Accesos (Staff / Agrupaciones):** Usuario que, mediante un dispositivo móvil, tiene permisos exclusivos para escanear los códigos QR de los asistentes registrando las marcas de entrada y salida en tiempo real.
* **Administrador del Sistema (Comisión Organizadora / OTI):** Rol con privilegios globales para actualizar los contenidos del cronograma, mutar eventos a estado *"Post-Evento"*, y realizar la carga masiva de carpetas de certificados en formato PDF.

---

## III. REQUERIMIENTOS DEL NEGOCIO (RN)

Definen los objetivos estratégicos, beneficios esperados y el valor que la plataforma aporta a la Comisión Organizadora y a la universidad.

* **RN-01: Centralización del legado institucional.** El sistema debe unificar la información, informes, fotos y videos de todas las actividades y agrupaciones en un único canal oficial, sirviendo como memoria histórica centralizada para futuras generaciones.
* **RN-02: Automatización y reducción de carga operativa.** El sistema debe eliminar el proceso manual actual de recepción de informes de asistencia de las facultades, sustituyéndolo por un control digital (QR) para mitigar errores humanos y la falsificación de asistencias.
* **RN-03: Validación e incremento del valor del certificado.** La plataforma debe dotar de legitimidad a los certificados emitidos mediante un sistema de validación pública (QR institucional), garantizando a empresas externas que las horas extracurriculares registradas son verídicas y auditadas.
* **RN-04: Sostenibilidad del ecosistema tecnológico.** El desarrollo debe ser liderado por una organización estudiantil interna (UNICODE) con una estructura que asegure el mantenimiento, soporte y transferencia de conocimiento entre generaciones de estudiantes, evitando la dependencia de terceros que luego abandonen el proyecto.
* **RN-05: Captación y vinculación de egresados.** El sistema debe facilitar el retorno y participación de los egresados en las actividades del Sesquicentenario (a través de eventos exclusivos como la Cena de Gala), sirviendo como un canal formal de comunicación e integración con la universidad.

---

## IV. REQUISITOS FUNCIONALES (RF)

Definen qué debe hacer el sistema (las acciones, procesos y características que interactúan con el usuario).

### Módulo 1: Registro, Asistencia y Gestión de Perfiles
* **RF-01: Formulario de inscripción a múltiples ponencias.** El sistema debe permitir a los usuarios registrarse a un evento principal (Encuentro Internacional) y, dentro del mismo formulario, seleccionar una o varias de las 10 conferencias disponibles mediante casillas de verificación (*checklist*).
* **RF-02: Autenticación y creación de perfiles.** El sistema debe manejar cuentas o perfiles para cada asistente (basados en su correo electrónico y DNI) para registrar su historial de eventos.
* **RF-03: Generación automática de código QR.** Tras un registro exitoso, el sistema debe generar de forma automática un código QR único vinculado al DNI del participante y enviarlo a su correo.
* **RF-04: Modificación de registro de ponencias.** El usuario debe poder reingresar al formulario de inscripción utilizando su DNI y un código de seguridad (o clave) para visualizar sus opciones previamente elegidas y modificar o añadir nuevas conferencias.
* **RF-05: Control de asistencia dual (Entrada/Salida).** El sistema debe permitir al administrador escanear el QR del asistente tanto al ingresar como al retirarse de cada conferencia.
* **RF-06: Cálculo automático de horas.** El sistema debe computar el tiempo real de permanencia de cada asistente (restando la hora de salida de la hora de entrada) para validar los requisitos de las horas extracurriculares.

### Módulo 2: Certificados y Validación Oficial
* **RF-07: Carga masiva de certificados (Administrador).** El sistema debe proveer un panel administrativo donde el usuario autorizado pueda subir carpetas organizadas por eventos conteniendo archivos PDF (certificados firmados).
* **RF-08: Asociación automática por DNI.** El sistema debe indexar los archivos PDF de los certificados reconociendo el número de DNI que llevará cada archivo como nombre.
* **RF-09: Buscador de certificados para el usuario.** La web debe incluir un motor de búsqueda público donde los asistentes, al ingresar su DNI, puedan listar, visualizar y descargar todos sus certificados emitidos.
* **RF-10: Validación de autenticidad mediante código QR.** Cada certificado (físico o digital) debe incluir un código QR que, al ser escaneado por terceros (empresas o instituciones), apunte a una sección de la web oficial que verifique la legitimidad del documento.

### Módulo 3: Pasarela de Pagos (Egresados)
* **RF-11: Selección de cantidad de entradas.** El sistema debe permitir a los egresados elegir la cantidad de entradas que desean adquirir para la Cena de Gala en un carrito de compras.
* **RF-12: Registro de datos de acompañantes.** Al comprar más de una entrada, el sistema debe solicitar los nombres exactos y datos de los acompañantes.
* **RF-13: Integración de pasarela de pago privada.** El sistema debe procesar transacciones monetarias de forma integrada y privada (con redirección bancaria) aceptando métodos de pago locales como Yape, Plin y tarjetas de crédito/débito.

### Módulo 4: Gestión de Contenido Dinámico (Cronograma y Legado)
* **RF-14: Visualización de cronograma por meses.** La interfaz principal debe estructurar y listar todos los eventos de la UNI de manera ordenada, separados mes a mes.
* **RF-15: Ficha informativa de Pre-Evento.** Cada evento en el cronograma debe contar con una sección expandible (*"Ver más"*) que muestre el logo, descripción, lugar, mapa interactivo (Google Maps), fecha, hora y el botón de inscripción.
* **RF-16: Actualización automática a Post-Evento.** Una vez finalizado el evento, la misma ficha debe ocultar el registro y habilitar un apartado con los resultados: enlaces a informes, galerías de fotos y videos integrados directamente desde YouTube.

---

## V. REQUISITOS NO FUNCIONALES (RNF)

Definen cómo debe comportarse el sistema (propiedades de calidad, restricciones técnicas y rendimiento).

### 1. Rendimiento y Escalabilidad
* **RNF-01: Capacidad de carga simultánea.** El sistema debe estar optimizado para soportar picos de alta concurrencia, estimando el registro e interacción simultánea de miles de usuarios (por ejemplo, hasta 9,000 asistentes potenciales considerando la capacidad del teatro).
* **RNF-02: Concurrencia en base de datos.** La base de datos provista por OTI debe ser capaz de procesar múltiples lecturas y escrituras por segundo en los momentos de escaneo masivo de QR (entrada y salida de eventos).

### 2. Seguridad y Privacidad
* **RNF-03: Restricción de modificación de asistencia.** El sistema debe asegurar que ningún usuario pueda modificar los registros de asistencia de otra persona; la edición de datos de inscripción debe estar protegida bajo un código de seguridad único por DNI.
* **RNF-04: Canales de pago seguros.** El módulo de pago no debe almacenar datos sensibles de tarjetas de crédito o débito en los servidores de la web; todo el procesamiento debe delegarse de forma segura mediante los scripts o APIs de la entidad bancaria elegida.
* **RNF-05: Roles y Accesos.** Debe existir una separación estricta de privilegios entre el usuario común (asistente/egresado) y el panel de administración (OTI / Comisión Organizadora) para la carga de certificados y gestión de eventos.

### 3. Usabilidad y Compatibilidad
* **RNF-06: Diseño adaptable (Responsive Design).** La interfaz de la plataforma debe ser 100% compatible con dispositivos móviles, dado que los usuarios y administradores escanearán y presentarán los códigos QR desde sus teléfonos celulares.
* **RNF-07: Centralización de la información.** La arquitectura del sistema debe estar unificada en un solo dominio principal (Web del Sesquicentenario), permitiendo que, aunque los eventos usen plataformas externas (como Forms o Luma), la experiencia e información de contacto se centralicen en un solo lugar.

### 4. Robustez y Mantenimiento
* **RNF-08: Transferencia de tecnología y continuidad.** El código y la infraestructura deben estar documentados y estructurados bajo buenas prácticas de ingeniería de software, permitiendo que futuras generaciones de estudiantes (Software Week / UNICODE) puedan dar soporte y actualizar la plataforma de manera continua.

---

## VI. REQUERIMIENTOS DE TRANSICIÓN (RT)

Detallan los pasos, datos y capacitaciones necesarias para implementar el nuevo sistema de forma fluida, asegurando el cambio del proceso manual al automatizado.

### 1. Migración y Carga de Datos Iniciales
* **RT-01: Migración del histórico de certificados.** Se debe diseñar un script o procedimiento de carga masiva para subir e indexar los PDFs de los certificados firmados por el Rector correspondientes al primer semestre, asociándolos correctamente a los DNI de los estudiantes en la nueva base de datos.
* **RT-02: Configuración de la infraestructura de OTI.** Se requiere que la Oficina de Tecnología de la Información (OTI) habilite formalmente el entorno de base de datos y los accesos necesarios al servidor web antes del despliegue en producción.
* **RT-03: Integración de credenciales bancarias.** Para habilitar la ruleta/pasarela de pagos, se debe realizar la transición y pruebas en el entorno de *sandbox* (pruebas) con las credenciales provistas por la entidad bancaria elegida antes de pasar al entorno real de producción.

### 2. Capacitación y Despliegue Operativo
* **RT-04: Capacitación al personal de control de accesos.** Se debe elaborar un manual de usuario y realizar jornadas de capacitación cortas para el personal o los miembros de las agrupaciones encargadas de escanear los códigos QR (Entrada/Salida) en el Teatro de la UNI y los auditorios.
* **RT-05: Manual de administración de contenidos.** El equipo de desarrollo debe entregar un manual de usuario para los administradores de la Comisión, enseñando cómo subir nuevos eventos al cronograma, actualizar el estado a "Post-Evento" (fotos/videos) y realizar la carga masiva de PDFs.
* **RT-06: Despliegue en paralelo (Plan de contingencia).** Durante el primer evento masivo que utilice el sistema, se mantendrá un registro físico de contingencia o un Forms de respaldo por si ocurre alguna caída en la conectividad del servidor durante el escaneo de los QR.


