-- Script de inicialización de base de datos para RocketDev Library Management System
-- Compatible con Oracle Database

-- Eliminar tablas existentes (en orden inverso para evitar problemas de restricciones)
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE book_loans CASCADE CONSTRAINTS PURGE';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE books CASCADE CONSTRAINTS PURGE';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE book_catalogs CASCADE CONSTRAINTS PURGE';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE students CASCADE CONSTRAINTS PURGE';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

-- Eliminar secuencias existentes
BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE student_seq';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE book_seq';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE book_catalog_seq';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE book_loan_seq';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/

-- Crear secuencias para IDs autoincrementales
CREATE SEQUENCE student_seq START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE book_seq START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE book_catalog_seq START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE book_loan_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- Crear tabla de estudiantes
CREATE TABLE students (
    id NUMBER PRIMARY KEY,
    student_number VARCHAR2(20) UNIQUE NOT NULL,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    phone VARCHAR2(20),
    department VARCHAR2(50),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Crear tabla de catálogos de libros (géneros/categorías)
CREATE TABLE book_catalogs (
    id NUMBER PRIMARY KEY,
    genre_name VARCHAR2(50) UNIQUE NOT NULL,
    description VARCHAR2(500),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- Crear tabla de libros
CREATE TABLE books (
    id NUMBER PRIMARY KEY,
    title VARCHAR2(100) NOT NULL,
    author VARCHAR2(100) NOT NULL,
    isbn VARCHAR2(20) UNIQUE NOT NULL,
    category VARCHAR2(50),
    price NUMBER(10,2),
    quantity NUMBER DEFAULT 1,
    status VARCHAR2(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BORROWED', 'MAINTENANCE')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_book_category FOREIGN KEY (category) REFERENCES book_catalogs(genre_name) ON DELETE SET NULL
);

-- Crear tabla de préstamos de libros
CREATE TABLE book_loans (
    id NUMBER PRIMARY KEY,
    book_id NUMBER NOT NULL,
    student_id NUMBER NOT NULL,
    loan_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'OVERDUE', 'RETURNED')),
    notes VARCHAR2(500),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT fk_loan_student FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Crear triggers para IDs autoincrementales
CREATE OR REPLACE TRIGGER student_id_trigger
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
    IF :new.id IS NULL THEN
        SELECT student_seq.NEXTVAL INTO :new.id FROM dual;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER book_id_trigger
BEFORE INSERT ON books
FOR EACH ROW
BEGIN
    IF :new.id IS NULL THEN
        SELECT book_seq.NEXTVAL INTO :new.id FROM dual;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER book_catalog_id_trigger
BEFORE INSERT ON book_catalogs
FOR EACH ROW
BEGIN
    IF :new.id IS NULL THEN
        SELECT book_catalog_seq.NEXTVAL INTO :new.id FROM dual;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER book_loan_id_trigger
BEFORE INSERT ON book_loans
FOR EACH ROW
BEGIN
    IF :new.id IS NULL THEN
        SELECT book_loan_seq.NEXTVAL INTO :new.id FROM dual;
    END IF;
END;
/

-- Crear triggers para actualizar timestamps
CREATE OR REPLACE TRIGGER students_update_trigger
BEFORE UPDATE ON students
FOR EACH ROW
BEGIN
    :new.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER books_update_trigger
BEFORE UPDATE ON books
FOR EACH ROW
BEGIN
    :new.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER book_catalogs_update_trigger
BEFORE UPDATE ON book_catalogs
FOR EACH ROW
BEGIN
    :new.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER book_loans_update_trigger
BEFORE UPDATE ON book_loans
FOR EACH ROW
BEGIN
    :new.updated_at := SYSTIMESTAMP;
END;
/

-- Insertar datos de ejemplo para catálogos de libros
INSERT INTO book_catalogs (genre_name, description, status) VALUES ('Ciencia Ficción', 'Libros que exploran conceptos futuristas, científicos y tecnológicos', 'ACTIVE');
INSERT INTO book_catalogs (genre_name, description, status) VALUES ('Fantasía', 'Libros que contienen elementos mágicos o sobrenaturales', 'ACTIVE');
INSERT INTO book_catalogs (genre_name, description, status) VALUES ('Misterio', 'Libros que involucran la resolución de un crimen o misterio', 'ACTIVE');
INSERT INTO book_catalogs (genre_name, description, status) VALUES ('Romance', 'Libros centrados en relaciones románticas', 'ACTIVE');
INSERT INTO book_catalogs (genre_name, description, status) VALUES ('Biografía', 'Libros que narran la vida de una persona', 'ACTIVE');
INSERT INTO book_catalogs (genre_name, description, status) VALUES ('Historia', 'Libros sobre eventos históricos', 'ACTIVE');
INSERT INTO book_catalogs (genre_name, description, status) VALUES ('Informática', 'Libros sobre programación y tecnología', 'ACTIVE');

-- Insertar datos de ejemplo para estudiantes
INSERT INTO students (student_number, first_name, last_name, email, phone, department) 
VALUES ('S001', 'Juan', 'Pérez', 'juan.perez@example.com', '555-1234', 'Ingeniería');

INSERT INTO students (student_number, first_name, last_name, email, phone, department) 
VALUES ('S002', 'María', 'González', 'maria.gonzalez@example.com', '555-5678', 'Ciencias');

INSERT INTO students (student_number, first_name, last_name, email, phone, department) 
VALUES ('S003', 'Carlos', 'Rodríguez', 'carlos.rodriguez@example.com', '555-9012', 'Humanidades');

-- Insertar datos de ejemplo para libros
INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Dune', 'Frank Herbert', '9780441172719', 'Ciencia Ficción', 15.99, 3, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('El Hobbit', 'J.R.R. Tolkien', '9780547928227', 'Fantasía', 12.99, 2, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Asesinato en el Orient Express', 'Agatha Christie', '9780062693662', 'Misterio', 10.99, 1, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Clean Code', 'Robert C. Martin', '9780132350884', 'Informática', 29.99, 5, 'AVAILABLE');

-- Insertar datos de ejemplo para préstamos de libros
INSERT INTO book_loans (book_id, student_id, loan_date, due_date, status) 
VALUES (1, 1, SYSTIMESTAMP, SYSTIMESTAMP + INTERVAL '14' DAY, 'ACTIVE');

INSERT INTO book_loans (book_id, student_id, loan_date, due_date, return_date, status) 
VALUES (2, 2, SYSTIMESTAMP - INTERVAL '30' DAY, SYSTIMESTAMP - INTERVAL '16' DAY, SYSTIMESTAMP - INTERVAL '15' DAY, 'RETURNED');

COMMIT;

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_book_title ON books(title);
CREATE INDEX idx_book_author ON books(author);
CREATE INDEX idx_book_isbn ON books(isbn);
CREATE INDEX idx_book_status ON books(status);

CREATE INDEX idx_student_number ON students(student_number);
CREATE INDEX idx_student_email ON students(email);

CREATE INDEX idx_loan_book_id ON book_loans(book_id);
CREATE INDEX idx_loan_student_id ON book_loans(student_id);
CREATE INDEX idx_loan_status ON book_loans(status);
CREATE INDEX idx_loan_due_date ON book_loans(due_date);

-- Crear vista para préstamos activos
CREATE OR REPLACE VIEW active_loans AS
SELECT l.id, b.title, b.isbn, s.student_number, s.first_name || ' ' || s.last_name as student_name,
       l.loan_date, l.due_date, l.status
FROM book_loans l
JOIN books b ON l.book_id = b.id
JOIN students s ON l.student_id = s.id
WHERE l.status = 'ACTIVE' OR l.status = 'OVERDUE';

-- Crear vista para libros disponibles
CREATE OR REPLACE VIEW available_books AS
SELECT b.id, b.title, b.author, b.isbn, c.genre_name as category, b.quantity
FROM books b
JOIN book_catalogs c ON b.category = c.genre_name
WHERE b.status = 'AVAILABLE' AND b.quantity > 0;

-- Crear procedimiento para actualizar estado de préstamos vencidos
CREATE OR REPLACE PROCEDURE update_overdue_loans AS
BEGIN
    UPDATE book_loans
    SET status = 'OVERDUE'
    WHERE status = 'ACTIVE' AND due_date < SYSTIMESTAMP;
    COMMIT;
END;
/

-- Crear job para ejecutar el procedimiento diariamente
BEGIN
    DBMS_SCHEDULER.CREATE_JOB (
        job_name => 'UPDATE_OVERDUE_LOANS_JOB',
        job_type => 'STORED_PROCEDURE',
        job_action => 'update_overdue_loans',
        start_date => SYSTIMESTAMP,
        repeat_interval => 'FREQ=DAILY; BYHOUR=0',
        enabled => TRUE,
        comments => 'Job para actualizar préstamos vencidos diariamente a medianoche'
    );
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -27477 THEN RAISE; END IF; -- Ignorar si el job ya existe
END;
/

COMMIT;