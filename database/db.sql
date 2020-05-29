CREATE DATABASE db_links;

USE db_links;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE doc (
  num_emp INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE,
  cedula VARCHAR (30) NOT NULL,
  nameD VARCHAR (50) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  cargo VARCHAR (30) NOT NULL,
  cumple VARCHAR(10) NOT NULL,
  phone VARCHAR(12) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(60) NOT NULL
    
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE doc
  MODIFY num_emp INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

INSERT INTO doc (num_emp,cedula, nameD, surname,cargo,cumple,phone, username,password) 
  VALUES (1, '201809', 'SIMI', 'LARES','nada','14/02/2002','561508','doc@gmqil.com',123);

SELECT * FROM users;

-- LINKS TABLE
CREATE TABLE links (
  id INT(11) NOT NULL,
  title VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE links
  ADD PRIMARY KEY (id);

ALTER TABLE links
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE links;