CREATE TABLE cliente(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL,
    dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pessoafisica(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idCliente INT,
    cpf varchar(14) NOT NULL DEFAULT 0,
    dataNascimento DATETIME NOT NULL,
    CONSTRAINT fk_idCliente_pessoafisica FOREIGN KEY (idCliente)
    REFERENCES cliente(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pessoafisica(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idCliente INT,
    cpf varchar(14) NOT NULL DEFAULT 0,
    dataNascimento DATETIME NOT NULL,
    CONSTRAINT fk_idCliente_pessoafisica FOREIGN KEY (idCliente)
    REFERENCES cliente(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pessoajuridica(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idCliente INT,
    cnpj varchar(20) NOT NULL DEFAULT 0,
    inscricaoEstadual varchar(50) DEFAULT NULL,
    razaoSocial varchar(100) DEFAULT NULL,
    CONSTRAINT fk_idCliente_pessoajuridica FOREIGN KEY (idCliente)
    REFERENCES cliente(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE telefone(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idCliente INT,
    ddi varchar(20) DEFAULT NULL,
    ddd varchar(20) DEFAULT NULL,
    numero varchar(200) DEFAULT NULL,
    ehPrincipal TINYINT DEFAULT 0,
    ehWhatsapp TINYINT DEFAULT 0,
    ativo TINYINT DEFAULT 0,
    CONSTRAINT fk_idCliente_telefone FOREIGN KEY (idCliente)
    REFERENCES cliente(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE newsletter(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) DEFAULT NULL, 
    email varchar(100) DEFAULT NULL, 
    dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP, 
    ativo TINYINT DEFAULT 1
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;