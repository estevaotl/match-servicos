<?php
    class ClienteService{

        public function __construct() { }

        public function salvar($cliente){
            $erro = array();

            $this->validar($cliente, $erro);

            try {
                (new ClienteDAO())->salvar($cliente);
            } catch (\Throwable $th) {
                //throw $th;
            }
        }

        private function validar($cliente, &$erro){
            
        }
    }