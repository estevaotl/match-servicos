<?php
require_once($_SERVER['DOCUMENT_ROOT'] . "/match-servicos/api/config.php");

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
        $dsn = "mysql:dbname=match_servicos;host=localhost;charset=utf8mb4";
        $usuario = "root";
        $senha = "";
        return new PDO($dsn, $usuario, $senha);
    }
}
