<?php
    class NewsletterService{
        private $dao = null;

        public function __construct($newsletterDAO){
			$this->dao = $newsletterDAO;
		}

        public function salvar($newsletter){
            $erro = array();

            $this->validar($newsletter, $erro);

            try {
                $this->dao->salvar($newsletter);
            } catch (\Throwable $th) {
                //throw $th;
            }
        }

        private function validar($newsletter, &$erro){
            
        }
    }