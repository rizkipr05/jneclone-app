CREATE DATABASE IF NOT EXISTS jneclone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jneclone;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resi_number VARCHAR(40) UNIQUE,
  sender_name VARCHAR(100) NOT NULL,
  sender_phone VARCHAR(30) NOT NULL,
  sender_address TEXT NOT NULL,
  receiver_name VARCHAR(100) NOT NULL,
  receiver_phone VARCHAR(30) NOT NULL,
  receiver_address TEXT NOT NULL,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  weight_kg DECIMAL(10,2) NOT NULL,
  content VARCHAR(200) NOT NULL,
  service VARCHAR(20) NOT NULL DEFAULT 'REG',
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Dibuat',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS shipment_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shipment_id INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  note VARCHAR(255),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Default admin (password: admin123)
INSERT INTO users (username, name, role, password_hash)
VALUES (
  'admin',
  'Administrator',
  'admin',
  '$2a$10$u5s7o0H2mK1Y6y6on22n6uD.2u1l3eL6P1n1iuk2x6oGYd2Qng1gC'
)
ON DUPLICATE KEY UPDATE username = username;
