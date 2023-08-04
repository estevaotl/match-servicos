<?php

    class NewsletterDAO{
        private $bancoDados = null;

        public function __construct($bancoDados){
			$this->bancoDados = $bancoDados;
		}

        public function salvar(Newsletter &$newsletter){
            try {
                if($this->existe($newsletter)){
                    $this->atualizar($newsletter);
                } else {
                    $id = $this->adicionarNovo($newsletter);

                    $newsletter->setId($id);
                }
            } catch (Throwable $th) {
                throw new Throwable($th->getMessage());
            }
        }

        public function adicionarNovo(Newsletter $newsletter){
            $comando = "INSERT INTO newsletter (nome, email, dataCadastro) VALUES (:nome, :email, :dataCadastro)";
            $parametros = $this->parametros($newsletter);

            $this->bancoDados->executar($comando, $parametros);
        }

        public function atualizar(Newsletter $newsletter){

        }

        private function parametros(Newsletter $newsletter){
            $parametros = array(
                "nome" => $newsletter->getNome(),
                "email" => $newsletter->getEmail(),
                "dataCadastro" => (new DateTime())->format("Y-m-d H:i:s")
            );

            return $parametros;
        }

        public function existe(Newsletter $newsletter){
            $comando = "SELECT COUNT(cliente.id) as qtdRegistros WHERE id = :idCliente AND ativo = 1";
            $parametros = array(
                "idCliente" => $newsletter->getId()
            );

            return false;
            // $linhas = $this->
        }
    }