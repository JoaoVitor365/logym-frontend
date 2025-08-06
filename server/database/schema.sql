-- Script para criação do banco de dados LOGYM
-- Execute este script no MySQL para criar as tabelas necessárias

CREATE DATABASE IF NOT EXISTS logym_db;
USE logym_db;

-- Tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de academias
CREATE TABLE academies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    image_url VARCHAR(500),
    description TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo das academias
INSERT INTO academies (name, address, city, state, rating, image_url, description, phone, email) VALUES
('Smart Fit', 'Av. Vinte e Seis de Março, 701 - Centro', 'Barueri', 'SP', 4.8, '/images/smartFit.jpeg', 'Academia com equipamentos modernos e ambiente climatizado', '(11) 4444-5555', 'contato@smartfit.com'),
('Blue Fit', 'Av. Trindade, 344 - Bethaville I', 'Barueri', 'SP', 4.9, '/images/blueFit.jpeg', 'Academia premium com personal trainers qualificados', '(11) 3333-4444', 'info@bluefit.com'),
('Bio Ritmo', 'Av. Piracema, 669 - Tamboré', 'Barueri', 'SP', 4.7, '/images/bioRitmo.jpeg', 'Foco em saúde e bem-estar com aulas especializadas', '(11) 2222-3333', 'contato@bioritmo.com'),
('Gaviões', 'Av. Juruá, 253 - Alphaville', 'Barueri', 'SP', 4.6, '/images/gavioes.jpeg', 'Academia tradicional com ambiente familiar', '(11) 1111-2222', 'info@gavioes.com');

-- Índices para melhor performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_academies_city ON academies(city);
CREATE INDEX idx_academies_name ON academies(name);