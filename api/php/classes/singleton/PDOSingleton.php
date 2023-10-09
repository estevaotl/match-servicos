<?php

require_once($_SERVER['DOCUMENT_ROOT']."/config.php");

abstract class PDOSingleton
{
    private static $pdo;

    // Instancia apenas uma vez
    public static function get()
    {
        if (!isset(self::$pdo)) {
            self::$pdo = self::create();
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }

        return self::$pdo;
    }

    // Cria o objeto PDO
    private static function create()
    {
        if (strpos($_SERVER['HTTP_REFERER'], 'localhost') !== false){
            $dsn = "mysql:dbname=dev_match_servicos;host=localhost;charset=utf8mb4";
			$usuario = "root";
			$senha = "";
		}else{
			$dsn = "mysql:dbname=match_servicos;unix_socket=/var/lib/mysql/mysql.sock;charset=utf8mb4";
			$usuario = "root";
			$senha = "";
		}

        return new PDO($dsn, $usuario, $senha);
    }
}
