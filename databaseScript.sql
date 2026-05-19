-- 1. TABLAS INDEPENDIENTES (Nivel 1)
CREATE TABLE document_types (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE universities (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    acronym TEXT,
    address TEXT,
    cell_phone TEXT,
    city TEXT,
    country TEXT,
    institutional_mail TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE modalities (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE time_modalities (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. TABLAS CON DEPENDENCIAS SIMPLES (Nivel 2)
CREATE TABLE faculties (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    universities_id BIGINT REFERENCES universities(id)
);

CREATE TABLE businesses (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_name TEXT NOT NULL,
    nit TEXT UNIQUE,
    address TEXT,
    cell_phone TEXT,
    mail TEXT,
    city TEXT,
    sector TEXT,
    website TEXT,
    document_types_id BIGINT REFERENCES document_types(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE teachers (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    second_last_name TEXT,
    document_number TEXT UNIQUE,
    mail TEXT UNIQUE,
    cell_phone TEXT,
    speciality TEXT,
    address TEXT,
    document_types_id BIGINT REFERENCES document_types(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    universities_id BIGINT REFERENCES universities(id),
    admin BOOLEAN DEFAULT FALSE,
    password TEXT NOT NULL
);

-- 3. TABLAS CON DEPENDENCIAS INTERMEDIAS (Nivel 3)
CREATE TABLE careers (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    career_code TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    faculties_id BIGINT REFERENCES faculties(id)
);

CREATE TABLE supervisors (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    second_last_name TEXT,
    document_number TEXT UNIQUE,
    mail TEXT UNIQUE,
    cell_phone TEXT,
    position TEXT,
    document_types_id BIGINT REFERENCES document_types(id),
    businesses_id BIGINT REFERENCES businesses(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    password TEXT NOT NULL
);

CREATE TABLE vacants (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    publication_date DATE,
    closing_date DATE,
    businesses_id BIGINT REFERENCES businesses(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    modality_id BIGINT REFERENCES modalities(id),
    time_modality_id BIGINT REFERENCES time_modalities(id)
);

-- 4. TABLAS DE USUARIOS FINALES Y OPERATIVAS (Nivel 4)
CREATE TABLE students (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    second_last_name TEXT,
    document_number TEXT UNIQUE,
    mail TEXT UNIQUE,
    cell_phone TEXT,
    semester INTEGER, -- int4 en diagrama
    address TEXT,
    careers_id BIGINT REFERENCES careers(id),
    document_types_id BIGINT REFERENCES document_types(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    password TEXT NOT NULL
);

-- 5. NÚCLEO DEL SISTEMA: PRÁCTICAS
CREATE TABLE practices (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    start_date DATE,
    end_date DATE,
    description TEXT,
    practice_hours INTEGER,
    supervisors_id BIGINT REFERENCES supervisors(id),
    vacants_id BIGINT REFERENCES vacants(id),
    students_id BIGINT REFERENCES students(id),
    teachers_id BIGINT REFERENCES teachers(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 6. TABLAS DE SEGUIMIENTO Y EVALUACIÓN (Nivel final)
CREATE TABLE evaluations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    evaluation_date DATE,
    rating TEXT,
    comment TEXT,
    practices_id BIGINT REFERENCES practices(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE follow_ups (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    follow_up_date DATE,
    description TEXT,
    progress INTEGER, -- int4
    comment TEXT,
    practices_id BIGINT REFERENCES practices(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Tabla adicional visible en el diagrama (earrings / pendientes)
CREATE TABLE earrings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    students_id BIGINT REFERENCES students(id)
);