ALTER TABLE `cliente` ADD `genero` VARCHAR(69) NULL DEFAULT NULL AFTER `prestadorServico`, ADD `whatsapp` VARCHAR(30) NULL DEFAULT NULL AFTER `genero`;

ALTER TABLE `cliente` ADD `email` VARCHAR(233) NOT NULL AFTER `nome`;

ALTER TABLE `cliente` ADD `senha` VARCHAR(255) NOT NULL AFTER `whatsapp`;

ALTER TABLE `cliente` ADD `ativo` TINYINT NOT NULL DEFAULT '1' AFTER `senha`;