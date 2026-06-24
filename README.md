# Sesquitec-UNI
> **Plataforma Web del Sesquicentenario de la Universidad Nacional de Ingeniería**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)

---

## Introducción y Propósito

**Sesquitec-UNI** es la plataforma digital oficial diseñada para transformar y centralizar la gestión de eventos académicos e institucionales de la Comisión del Sesquicentenario de la Universidad Nacional de Ingeniería (UNI).

Este sistema resuelve la sobrecarga operativa de asistencia manual, reduce los riesgos de falsificación de documentos mediante un validador digital de firmas, optimiza la emisión de certificados y facilita la captación de egresados a través de un canal seguro de pagos para eventos exclusivos. Todo esto integrado bajo una misma plataforma que servirá como memoria histórica y legado del Sesquicentenario de la universidad.

---

## Stack Tecnológico Final (De punta a punta)

El proyecto está construido sobre un ecosistema moderno, escalable y robusto utilizando **TypeScript** como lenguaje unificado:

| Tecnología | Rol en el Sistema | ¿Qué hace? |
| :--- | :--- | :--- |
| **TypeScript (TS)** | Lenguaje Base | Es el lenguaje de programación seguro que se usa en todo el proyecto (tanto en el Front como en el Back) para evitar errores de código y asegurar que los futuros estudiantes entiendan el sistema. |
| **Next.js (React)** | Frontend (La Cara Visible) | Se encarga de construir las pantallas interactivas (cronograma, buscador de certificados, carrito de compras) y de que la página cargue de forma ultra rápida gracias al renderizado desde el servidor (SSR/ISR). |
| **Tailwind CSS** | Diseño Visual | Permite diseñar pantallas modernas, fluidas y adaptables (Responsive Design) para dispositivos móviles, optimizando la experiencia en la lectura de códigos QR. |
| **NestJS / Next.js API Routes** | Backend (Lógica y APIs) | Procesa las marcas de asistencia, gestiona la lógica del carrito de compras de egresados, valida los códigos QR y administra la seguridad de los accesos. |
| **PostgreSQL** | Base de Datos | Motor de base de datos relacional (exigido por la OTI) donde se guardan de forma segura los alumnos, ponencias, asistencias, compras y rutas de los certificados. |
| **Prisma ORM** | Puente Base de Datos - Código | Conecta de forma automática la base de datos PostgreSQL con tu código en TypeScript, avisando al programador si hay algún cambio o error de tipo en las tablas. |

---

## Alcance del Sistema (Módulos Principales)

El sistema se estructura en 5 módulos clave orientados a satisfacer los requisitos del negocio:

### 1. Registro, Asistencia y Gestión de Perfiles
* **Inscripción Multi-Ponencia:** Permite registrarse a un evento principal y seleccionar múltiples conferencias en un solo formulario (*checklist*).
* **Acceso y Perfil de Usuario:** Autenticación básica mediante DNI y correo electrónico. Permite la edición de ponencias elegidas mediante un código de seguridad.
* **Control de Asistencia QR Dual:** Generación automática de QR para el asistente. Escaneo de entrada y salida mediante dispositivos móviles para calcular las horas de permanencia.

### 2. Módulo de Certificados y Validación Oficial
* **Carga Masiva (Admin):** Panel de administración para subir archivos PDF de certificados indexados de manera automática mediante el DNI del alumno.
* **Buscador Público:** Consulta de certificados emitidos introduciendo el DNI.
* **Validación QR:** Cada certificado cuenta con un código QR que redirige a un validador oficial en la web para verificar la legitimidad ante terceros.

### 3. Pasarela de Pagos (Egresados)
* **Venta de Entradas:** Módulo y carrito de compras para la Cena de Gala de Egresados.
* **Registro de Invitados:** Formulario dinámico para registrar datos y nombres de acompañantes.
* **Integración de Pagos:** Conexión segura con pasarelas locales para el procesamiento de pagos mediante Yape, Plin y tarjetas bancarias.

### 4. Cronograma y Repositorio de Legado
* **Estados Dinámicos:** Los eventos cambian dinámicamente de un estado **Pre-Evento** (Inscripción, ubicación con Google Maps) a un estado **Post-Evento** (Informes descargables, galerías de fotos y videos incrustados de YouTube).
* **Agenda Organizada:** Estructurada cronológicamente mes a mes.

---

## Guía de Inicio Rápido

### Requisitos Previos
* **Node.js** (versión v18 o superior)
* **PostgreSQL** (instancia local o en la nube)
* **NPM / PNPM / Yarn**

### 1. Clonación e Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Sesquitec-UNI.git
cd Sesquitec-UNI

# Instalar dependencias
npm install
```

### 2. Variables de Envono
Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente plantilla:

```env
# Configuración de Base de Datos (PostgreSQL)
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/sesquitec_db?schema=public"

# Configuración del Backend/API
PORT=3000
JWT_SECRET="tu_clave_secreta_super_segura"

# APIs de Terceros
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu_google_maps_api_key"
YOUTUBE_API_KEY="tu_youtube_api_key"

# Credenciales de Pasarela de Pagos (Sandbox / Producción)
PAYMENT_GATEWAY_KEY="tu_llave_de_pasarela"
```

### 3. Configuración de Base de Datos y Prisma ORM
Ejecuta los siguientes comandos para inicializar y migrar la base de datos:

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar las migraciones iniciales para estructurar las tablas
npx prisma migrate dev --name init

# (Opcional) Ejecutar datos semilla (seed) para pruebas
npm run seed
```

### 4. Ejecución en Entorno de Desarrollo
```bash
# Iniciar frontend y backend
npm run dev
```

La plataforma estará disponible por defecto en `http://localhost:3000`.

---

## Estructura del Proyecto Propuesta (Monorepo o Híbrido)

```text
Sesquitec-UNI/
├── apps/
│   ├── web/                 # Aplicación Next.js (Frontend, Vistas, SSR)
│   └── api/                 # API NestJS (Lógica del negocio, Accesos, Pagos)
├── packages/
│   ├── database/            # Configuración de Prisma (schema.prisma y migraciones)
│   └── ts-config/           # Configuración compartida de TypeScript
├── requerimientos.md        # Documento base de especificación de requerimientos
├── README.md                # Guía y descripción general del proyecto
└── .env.example             # Plantilla de variables de entorno
```

---

## Soporte y Continuidad (UNICODE)
De acuerdo con el requerimiento **RN-04 (Sostenibilidad del ecosistema tecnológico)**, el desarrollo de esta plataforma está liderado por la organización estudiantil **UNICODE** en colaboración con la Oficina de Tecnología de la Información (OTI). El proyecto está estructurado bajo altos estándares de calidad de software y documentación rigurosa para asegurar que las próximas generaciones de estudiantes puedan continuar brindando mantenimiento y actualizaciones al sistema.
