CREATE DATABASE crudpeliculas_db;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL
);

CREATE TABLE peliculas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    mime_type VARCHAR(255),
    foto BYTEA 
);

INSERT INTO usuarios (username, password, rol) 
VALUES ('admin', 'admin123', 'ADMIN');

SELECT * FROM usuarios;
SELECT * FROM peliculas;

SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'peliculas';

SELECT id, titulo, director, mime_type, length(foto) AS bytes_foto FROM peliculas;
