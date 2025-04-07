-- Script de datos adicionales para RocketDev Library Management System
-- Compatible con Oracle Database

-- Datos adicionales para estudiantes
INSERT INTO students (student_number, first_name, last_name, email, phone, department) 
VALUES ('S004', 'Ana', 'Martínez', 'ana.martinez@example.com', '555-3456', 'Medicina');

INSERT INTO students (student_number, first_name, last_name, email, phone, department) 
VALUES ('S005', 'Pedro', 'Sánchez', 'pedro.sanchez@example.com', '555-7890', 'Derecho');

INSERT INTO students (student_number, first_name, last_name, email, phone, department) 
VALUES ('S006', 'Laura', 'Fernández', 'laura.fernandez@example.com', '555-2345', 'Arquitectura');

INSERT INTO students (student_number, first_name, last_name, email, phone, department) 
VALUES ('S007', 'Miguel', 'López', 'miguel.lopez@example.com', '555-6789', 'Economía');

INSERT INTO students (student_number, first_name, last_name, email, phone, department) 
VALUES ('S008', 'Sofía', 'Díaz', 'sofia.diaz@example.com', '555-1357', 'Psicología');

-- Datos adicionales para libros
INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('1984', 'George Orwell', '9780451524935', 'Ciencia Ficción', 11.99, 2, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Cien años de soledad', 'Gabriel García Márquez', '9780307474728', 'Fantasía', 13.99, 3, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('El código Da Vinci', 'Dan Brown', '9780307474278', 'Misterio', 14.99, 2, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Orgullo y prejuicio', 'Jane Austen', '9780141439518', 'Romance', 9.99, 1, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Steve Jobs', 'Walter Isaacson', '9781451648539', 'Biografía', 19.99, 2, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Sapiens: De animales a dioses', 'Yuval Noah Harari', '9780062316097', 'Historia', 16.99, 3, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Patrones de Diseño', 'Erich Gamma et al.', '9780201633610', 'Informática', 39.99, 1, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('El Principito', 'Antoine de Saint-Exupéry', '9780156012195', 'Fantasía', 8.99, 4, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Don Quijote de la Mancha', 'Miguel de Cervantes', '9788420412146', 'Fantasía', 12.99, 2, 'AVAILABLE');

INSERT INTO books (title, author, isbn, category, price, quantity, status) 
VALUES ('Crimen y castigo', 'Fiódor Dostoyevski', '9780143107637', 'Misterio', 11.99, 1, 'AVAILABLE');

-- Datos adicionales para préstamos de libros
INSERT INTO book_loans (book_id, student_id, loan_date, due_date, status, notes) 
VALUES (3, 3, SYSTIMESTAMP - INTERVAL '5' DAY, SYSTIMESTAMP + INTERVAL '9' DAY, 'ACTIVE', 'Préstamo para trabajo de investigación');

INSERT INTO book_loans (book_id, student_id, loan_date, due_date, status, notes) 
VALUES (4, 4, SYSTIMESTAMP - INTERVAL '10' DAY, SYSTIMESTAMP + INTERVAL '4' DAY, 'ACTIVE', 'Préstamo para lectura personal');

INSERT INTO book_loans (book_id, student_id, loan_date, due_date, return_date, status, notes) 
VALUES (5, 5, SYSTIMESTAMP - INTERVAL '20' DAY, SYSTIMESTAMP - INTERVAL '6' DAY, SYSTIMESTAMP - INTERVAL '7' DAY, 'RETURNED', 'Devuelto antes de tiempo');

INSERT INTO book_loans (book_id, student_id, loan_date, due_date, status, notes) 
VALUES (6, 6, SYSTIMESTAMP - INTERVAL '15' DAY, SYSTIMESTAMP - INTERVAL '1' DAY, 'OVERDUE', 'Contactar al estudiante para recordatorio');

INSERT INTO book_loans (book_id, student_id, loan_date, due_date, return_date, status, notes) 
VALUES (7, 7, SYSTIMESTAMP - INTERVAL '25' DAY, SYSTIMESTAMP - INTERVAL '11' DAY, SYSTIMESTAMP - INTERVAL '10' DAY, 'RETURNED', 'Libro devuelto en buen estado');

COMMIT;