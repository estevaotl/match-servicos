<?php
    class PDOSingleton{
        private static $pdo = null;

        public function __construct() {
            try {
                if(!isset(self::$pdo) && !self::$pdo instanceof PDO){
                    self::$pdo = new PDO("mysql:host=localhost;dbname=match_servicos;charset=utf8mb4", "root", "");
                    self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                }

                return self::$pdo;
            } catch (PDOException $e) {
                throw new Exception("Erro na conexão com o banco de dados: " . $e->getMessage());
            }
        }

        public function executar($comando, $parametros = array()){
            try {
                $this::$pdo->beginTransaction();

                $ps = $this::$pdo->prepare($comando);
                $ps->execute($parametros);

                $this::$pdo->commit();
            } catch (\Throwable $th) {
                $this::$pdo->rollback();

                throw new Exception($th->getMessage());
            }
        }
    }

?>