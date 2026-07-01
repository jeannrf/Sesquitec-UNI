-- Esquema de Base de Datos para PostgreSQL (Supabase) - Sesquicentenario UNI 150 Años

-- 1. Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    institucion VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'STAFF', 'USER')),
    verified BOOLEAN DEFAULT FALSE,
    profile_pic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Eventos
CREATE TABLE eventos (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    organizer VARCHAR(150),
    date VARCHAR(50),
    time VARCHAR(50),
    location VARCHAR(200),
    description TEXT,
    quota INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pre' CHECK (status IN ('pre', 'published', 'post')),
    is_paid BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(255),
    category VARCHAR(50),
    tags TEXT, -- Valores separados por comas
    registration_open BOOLEAN DEFAULT TRUE,
    max_edit_date TIMESTAMP WITH TIME ZONE
);

-- 3. Tabla de Ponencias / Conferencias
CREATE TABLE ponencias (
    id VARCHAR(50) PRIMARY KEY,
    event_id VARCHAR(50) REFERENCES eventos(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    speaker VARCHAR(150) NOT NULL,
    room VARCHAR(100),
    time VARCHAR(50),
    duration INT DEFAULT 60, -- en minutos
    quota INT DEFAULT 100
);

-- 4. Tabla de Inscripciones / Tickets
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    user_dni VARCHAR(8) NOT NULL REFERENCES usuarios(dni) ON DELETE CASCADE,
    event_id VARCHAR(50) NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'Registrado' CHECK (status IN ('Registrado', 'Asistió', 'Cancelado')),
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Certificados
CREATE TABLE certificados (
    id VARCHAR(50) PRIMARY KEY,
    dni VARCHAR(8) NOT NULL,
    titular VARCHAR(200) NOT NULL,
    event_id VARCHAR(50) REFERENCES eventos(id) ON DELETE SET NULL,
    fecha VARCHAR(50),
    horas INT,
    emitido VARCHAR(50),
    tipo VARCHAR(50) DEFAULT 'Participación',
    codigo_validacion VARCHAR(100) UNIQUE NOT NULL,
    pdf_url VARCHAR(255) -- Ruta al PDF o link en Supabase Storage
);

-- Índices recomendados para optimización de consultas recurrentes
CREATE INDEX idx_certificados_dni ON certificados(dni);
CREATE INDEX idx_inscripciones_user_dni ON inscripciones(user_dni);
CREATE INDEX idx_inscripciones_event_id ON inscripciones(event_id);
CREATE INDEX idx_ponencias_event_id ON ponencias(event_id);
