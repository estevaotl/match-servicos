CREATE TABLE endereco(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    rua VARCHAR(255) DEFAULT NULL,
    numero INT DEFAULT NULL,
    complemento VARCHAR(255) DEFAULT NULL,
    cep VARCHAR(255) DEFAULT NULL,
    cidade varchar(255) DEFAULT NULL, 
    estado varchar(255) DEFAULT NULL,
    bairro VARCHAR(255) DEFAULT NULL,
    idCliente INT NOT NULL,
    CONSTRAINT fk_endereco_idCliente FOREIGN KEY (idCliente)
    REFERENCES cliente(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;