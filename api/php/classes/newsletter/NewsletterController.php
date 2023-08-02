<?php
    class NewsletterController{
        public function __construct() { }

        public function salvar($dados){
            try {
                $erro = array();

                $newsletter = new Newsletter();

                $camposComuns = ["nome", "email"];

                foreach ($camposComuns as $campo) {
                    $setter = 'set' . ucfirst($campo); // Obtém o nome do método setter para o campo atual

                    $newsletter->$setter($dados[$campo]);
                }

                (new NewsletterService())->salvar($newsletter, $erro);
            } catch (\Throwable $th) {
                throw new Exception($th->getMessage());
            }
            
        }
    }