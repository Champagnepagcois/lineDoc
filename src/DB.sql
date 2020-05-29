CREATE DATABASE IF NOT EXISTS lineDoc ;
USE lineDoc;


CREATE TABLE sangre (
    id_san int (4) AUTO_INCREMENT,
    tipo VARCHAR (10) NOT NULL,
    PRIMARY KEY (id_san)
);

CREATE TABLE Delegacion (
    id_del int NOT NULL PRIMARY KEY,
    name_del VARCHAR (20) NOT NULL
);
CREATE TABLE colonia (
    codigo_postal int NOT NULL PRIMARY KEY,
    name_col VARCHAR (20) NOT NULL
);

CREATE TABLE dir (
    id_dir int AUTO_INCREMENT PRIMARY KEY,
    id_del int NOT NULL,
    codigo_postal int NOT NULL,
    calle VARCHAR (25) NOT NULL,
    num_ext VARCHAR (10) ,
    num_int VARCHAR (10) ,
    manzana int,
    lote int,
    CONSTRAINT fkdel FOREIGN KEY (id_del)
    REFERENCES Delegacion (id_del) 
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkcol FOREIGN KEY (codigo_postal)
    REFERENCES colonia (codigo_postal)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE hospital (
    id_hos int (10) AUTO_INCREMENT PRIMARY KEY,
    nameh VARCHAR (25) NOT NULL,
    id_dir int NOT NULL,
    id_numh int (10) NOT NULL
);

CREATE TABLE estatus (
    id_estatus int AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR (100) NOT NULL,
    username VARCHAR (30) NOT NULL
);

CREATE TABLE type_usuario (
    id_type int AUTO_INCREMENT PRIMARY KEY,
    tipo_user VARCHAR (10) NOT NULL
);

CREATE TABLE paciente (
    id_pac int AUTO_INCREMENT PRIMARY KEY,
    CURP_pa VARCHAR (18) NOT NULL UNIQUE,
    username VARCHAR (30) NOT NULL,
    password VARCHAR (50) NOT NULL,
    namep VARCHAR (25) NOT NULL,
    surname_p VARCHAR (15) NOT NULL,
    surname_m VARCHAR (15) NOT NULL,
    edad int (2) NOT NULL,
    tel int (12) NOT NULL,
    id_dir int NOT NULL,
    cumple VARCHAR (10) NOT NULL,
    id_san int,
    id_type int NOT NULL,
    id_hos int ,
    id_estatus int,

    CONSTRAINT fkesta FOREIGN KEY (id_estatus) 
    REFERENCES estatus (id_estatus)
    ON DELETE NO ACTION ON UPDATE CASCADE,
        
    CONSTRAINT fksan FOREIGN KEY (id_san) 
    REFERENCES sangre (id_san)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fktype FOREIGN KEY (id_type) 
    REFERENCES type_usuario (id_type)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkdir FOREIGN KEY (id_dir) 
    REFERENCES dir (id_dir)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkhos FOREIGN KEY (id_hos) 
    REFERENCES hospital (id_hos)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE alergias (
    id_ale int AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR (20) 
);


CREATE TABLE fam (
    id_fam int AUTO_INCREMENT PRIMARY KEY,
    CURP VARCHAR (18) NOT NULL UNIQUE,
    namep VARCHAR (25) NOT NULL,
    apellido_p VARCHAR (15) NOT NULL,
    apellido_m VARCHAR (15) NOT NULL,
    tel int (12) NOT NULL,
    id_dir int NOT NULL,
    

    CONSTRAINT fkdirdos FOREIGN KEY (id_dir) 
    REFERENCES dir (id_dir)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE Pac_fam (
    id_pac int NOT NULL,
    id_fam int NOT NULL,

    CONSTRAINT fkpac FOREIGN KEY (id_pac) 
    REFERENCES paciente (id_pac)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkfam FOREIGN KEY (id_fam) 
    REFERENCES fam (id_fam)
    ON DELETE NO ACTION ON UPDATE CASCADE
);


CREATE TABLE Pac_ale (
    id_pac int NOT NULL,
    id_ale int NOT NULL,

    CONSTRAINT fkpacdos FOREIGN KEY (id_pac) 
    REFERENCES paciente (id_pac)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkale FOREIGN KEY (id_ale) 
    REFERENCES alergias (id_ale)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE doc (
    num_emp int (11) NOT NULL PRIMARY KEY UNIQUE,
    cedula int (30) NOT NULL UNIQUE,
    username VARCHAR (30) NOT NULL,
    password VARCHAR (60) NOT NULL,
    nameD VARCHAR (30) NOT NULL,
    surname_p VARCHAR (30) NOT NULL,
    surname_m VARCHAR (30) NOT NULL,
    cargo VARCHAR (30) NOT NULL,
    cumple VARCHAR (10) NOT NULL,
    phone VARCHAR (12) NOT NULL,
    id_hos int,
    id_type int,
    id_estatus int,

    CONSTRAINT fkestatusdos FOREIGN KEY (id_estatus) 
    REFERENCES estatus (id_estatus)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkhosdos FOREIGN KEY (id_hos)
    REFERENCES hospital (id_hos) 
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fktypedos FOREIGN KEY (id_type) 
    REFERENCES type_usuario (id_type)
    ON DELETE NO ACTION ON UPDATE CASCADE
);


CREATE TABLE historial (
    id_his int AUTO_INCREMENT PRIMARY KEY,
    cita VARCHAR (15) NOT NULL,
    id_pac int NOT NULL,
    num_emp int NOT NULL,

        
    CONSTRAINT fkpa FOREIGN KEY (id_pac) 
    REFERENCES paciente (id_pac)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkdoc FOREIGN KEY (num_emp) 
    REFERENCES doc (num_emp)
    ON DELETE NO ACTION ON UPDATE CASCADE

);

CREATE TABLE comentario (
    id_com int AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR (20)
);

CREATE TABLE his_com (
    id_his int NOT NULL,
    id_fam int NOT NULL,
    id_com int ,

    CONSTRAINT fkhis FOREIGN KEY (id_his) 
    REFERENCES historial (id_his)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkcom FOREIGN KEY (id_com) 
    REFERENCES comentario (id_com)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE medicamento (
    id_infomedi int AUTO_INCREMENT PRIMARY KEY,
    durante VARCHAR (20),
    cantidad VARCHAR (20),
    nombre VARCHAR (20)
);
CREATE TABLE his_med (
    id_his int NOT NULL,
    id_infomedi int NOT NULL,

    CONSTRAINT fkhiss FOREIGN KEY (id_his) 
    REFERENCES historial (id_his)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkinfomedos FOREIGN KEY (id_infomedi) 
    REFERENCES medicamento (id_infomedi)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE enfermedad (
    id_enf int AUTO_INCREMENT PRIMARY KEY,
    name_enfer VARCHAR (20)
);

CREATE TABLE his_enf (
    id_his int NOT NULL,
    id_enf int NOT NULL,

    CONSTRAINT fkhise FOREIGN KEY (id_his) 
    REFERENCES historial (id_his)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkenf FOREIGN KEY (id_enf) 
    REFERENCES enfermedad (id_enf)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE receta (
    id_receta int AUTO_INCREMENT PRIMARY KEY, 
    id_his int NOT NULL,

    CONSTRAINT fkrec FOREIGN KEY (id_his) 
    REFERENCES historial (id_his)
    ON DELETE NO ACTION ON UPDATE CASCADE
    
);

CREATE TABLE pac_rec (
    id_pac int NOT NULL,
    id_receta int NOT NULL,

    CONSTRAINT fkpare FOREIGN KEY (id_pac) 
    REFERENCES paciente (id_pac)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkrece FOREIGN KEY (id_receta) 
    REFERENCES receta (id_receta)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

INSERT INTO type_usuario (tipo_user) VALUES ('doc');
INSERT INTO type_usuario (tipo_user) VALUES ('pac');
INSERT INTO type_usuario (tipo_user) VALUES ('uncheck');

INSERT INTO doc (num_emp, cedula,nameD,surname_p,surname_m, cumple,cargo,phone,username, password) 
  VALUES (1, 56, 'DR SIMI', 'LARES','reee','14-02-02','bailar',5615088526,'marlonrodriguez2b@gmail.com','123');

/*delete a table with a FK
   SET FOREIGN_KEY_CHECKS=0; DROP TABLE doc; SET FOREIGN_KEY_CHECKS=1;
*/

/*INSEET INTO */

INSERT INTO doc (num_emp, cedula,nameD,surnameD, cumple,cargo,phone,username, password) 
  VALUES (1, 56, 'DR SIMI', 'LARES','14-02-02','bailar',5615088526,'marlonrodriguez2b@gmail.com','123');

