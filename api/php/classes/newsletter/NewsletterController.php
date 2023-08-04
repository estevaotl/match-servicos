<?php
    class NewsletterController{
        private $service = null;

        public function __construct(BancoDados $conexao = null){
			if(isset($conexao))
				$bancoDados = $conexao;
			else
				$bancoDados = BDSingleton::get();

			$newsletterDAO = new NewsletterDAO($bancoDados);
			$this->service = new NewsletterService($newsletterDAO);
		}

        public function salvar($dados){
            try {
                $erro = array();

                $newsletter = new Newsletter();

                $camposComuns = ["nome", "email"];

                foreach ($camposComuns as $campo) {
                    $setter = 'set' . ucfirst($campo); // Obtém o nome do método setter para o campo atual

                    $newsletter->$setter($dados[$campo]);
                }

                $this->service->salvar($newsletter, $erro);
            } catch (\Throwable $th) {
                Util::logException($th);
                throw new Exception($th->getMessage());
            }
        }
    }