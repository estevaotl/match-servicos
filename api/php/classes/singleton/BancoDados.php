<?php
    class BancoDados{
        private static $bancoDados = null;

        public function __construct() {}

        public function get(){
            self::$bancoDados = new PDOSingleton();

            return self::$bancoDados;
        }

        public function executar($comando, $parametros = array()){
            self::$bancoDados->executar($comando, $parametros);
        }
    }

?>