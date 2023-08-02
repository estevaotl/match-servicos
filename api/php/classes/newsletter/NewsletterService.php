<?php
    class NewsletterService{

        public function __construct() { }

        public function salvar($newsletter){
            $erro = array();

            $this->validar($newsletter, $erro);

            try {
                (new NewsletterDAO())->salvar($newsletter);
            } catch (\Throwable $th) {
                //throw $th;
            }
        }

        private function validar($newsletter, &$erro){
            
        }
    }