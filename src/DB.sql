CREATE DATABASE IF NOT EXISTS lineDoc ;
USE lineDoc;


CREATE TABLE sangre (
    id_san int (4) AUTO_INCREMENT,
    tipo VARCHAR (10) NOT NULL,
    PRIMARY KEY (id_san)
);

CREATE TABLE estado (
    id_esta int NOT NULL PRIMARY KEY,
    name_esta VARCHAR (20)
);


CREATE TABLE delegacion (
    id_del int NOT NULL PRIMARY KEY,
    name_del VARCHAR (20)
);

CREATE TABLE colonia (
    codigo_postal int NOT NULL PRIMARY KEY,
    id_esta int NOT NULL,
    id_del int NOT NULL,
    name_col VARCHAR (20) NOT NULL,

    CONSTRAINT fkestado FOREIGN KEY (id_esta)
    REFERENCES estado (id_esta)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkdele FOREIGN KEY (id_del)
    REFERENCES delegacion (id_del)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE dir (
    id_dir int AUTO_INCREMENT PRIMARY KEY,
    codigo_postal int NOT NULL,
    calle VARCHAR (25) NOT NULL,
    num_ext VARCHAR (10),
    num_int VARCHAR (10),


    CONSTRAINT fkcol FOREIGN KEY (codigo_postal)
    REFERENCES colonia (codigo_postal)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE hospital (
    id_hos int (10) AUTO_INCREMENT PRIMARY KEY,
    nameh VARCHAR (25) NOT NULL,
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
    username VARCHAR (30) ,
    password VARCHAR (60) ,
    namep VARCHAR (25) NOT NULL,
    surname_p VARCHAR (15) NOT NULL,
    surname_m VARCHAR (15) NOT NULL,
    id_san int,
    tel VARCHAR (12) ,
    id_dir int,
    cumple VARCHAR (10) ,
    id_type int NOT NULL,
    id_hos int,
    id_estatus int,

    CONSTRAINT fkestaaa FOREIGN KEY (id_estatus) 
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
    namef VARCHAR (25) NOT NULL,
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
    num_emp int NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp,


    CONSTRAINT fkdoc FOREIGN KEY (num_emp) 
    REFERENCES doc (num_emp)
    ON DELETE NO ACTION ON UPDATE CASCADE

);

CREATE TABLE comentario (
    id_com int AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR (100)
);

CREATE TABLE his_com (
    id_his int NOT NULL,
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
    cada VARCHAR (10),
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
    num_emp int NOT NULL,
    id_pac int UNIQUE,
    created_at timestamp NOT NULL DEFAULT current_timestamp,

    CONSTRAINT fkrec FOREIGN KEY (id_his) 
    REFERENCES historial (id_his)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkdocrec FOREIGN KEY (num_emp) 
    REFERENCES doc (num_emp)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkrecpac FOREIGN KEY (id_pac) 
    REFERENCES paciente (id_pac)
    ON DELETE NO ACTION ON UPDATE CASCADE
    
);

CREATE TABLE pa_his (
    id_pac int NOT NULL,
    id_his int NOT NULL,

    CONSTRAINT fkpare FOREIGN KEY (id_pac) 
    REFERENCES paciente (id_pac)
    ON DELETE NO ACTION ON UPDATE CASCADE,

    CONSTRAINT fkpacrec FOREIGN KEY (id_his) 
    REFERENCES historial (id_his)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

INSERT INTO type_usuario (tipo_user) VALUES ('doc');
INSERT INTO type_usuario (tipo_user) VALUES ('pac');
INSERT INTO type_usuario (tipo_user) VALUES ('uncheck');

 INSERT INTO delegacion (id_del,name_del) VALUES (306,'Álvaro Obregón');
 INSERT INTO delegacion (id_del,name_del) VALUES (298,'Azcapotzalco');
 INSERT INTO delegacion (id_del,name_del) VALUES (310,'Benito Juárez');
 INSERT INTO delegacion (id_del,name_del) VALUES (299,'Coyoacán');
 INSERT INTO delegacion (id_del,name_del) VALUES (311,'Cuauhtémoc');
 INSERT INTO delegacion (id_del,name_del) VALUES (301,'Gustavo A. Madero');
 INSERT INTO delegacion (id_del,name_del) VALUES (302,'Iztacalco');
 INSERT INTO delegacion (id_del,name_del) VALUES (303,'Iztapalapa');
 INSERT INTO delegacion (id_del,name_del) VALUES (312,'Miguel Hidalgo');
 INSERT INTO delegacion (id_del,name_del) VALUES (300,'Cuajimalpa');
 INSERT INTO delegacion (id_del,name_del) VALUES (307,'Tláhuac');
 INSERT INTO delegacion (id_del,name_del) VALUES (308,'Tlalpan');
 INSERT INTO delegacion (id_del,name_del) VALUES (304,'Magdalena Contreras');
 INSERT INTO delegacion (id_del,name_del) VALUES (305,'Milpa Alta');
 INSERT INTO delegacion (id_del,name_del) VALUES (313,'Venustiano Carranza');
 INSERT INTO delegacion (id_del,name_del) VALUES (309,'Xochimilco');

INSERT INTO sangre (id_san,tipo) VALUES (0,'+A');
INSERT INTO sangre (id_san,tipo) VALUES (0,'+B');
INSERT INTO sangre (id_san,tipo) VALUES (0,'+O ');
INSERT INTO sangre (id_san,tipo) VALUES (0,'+AB');
INSERT INTO sangre (id_san,tipo) VALUES (0,'-A');
INSERT INTO sangre (id_san,tipo) VALUES (0,'-B');
INSERT INTO sangre (id_san,tipo) VALUES (0,'-O');
INSERT INTO sangre (id_san,tipo) VALUES (0,'-AB');

INSERT INTO estado (id_esta,name_esta) VALUES (9,'CDMX');