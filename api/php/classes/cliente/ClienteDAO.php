<?php

    class ClienteDAO{

        private $bancoDados = null;

        public function __construct() {
            $this->bancoDados = (new BancoDados())->get();
        }

        public function salvar(Cliente &$cliente){
            try {
                if($this->existe($cliente)){
                    $this->atualizar($cliente);
                } else {
                    $id = $this->adicionarNovo($cliente);

                    $cliente->setId($id);
                }
            } catch (Throwable $th) {
                throw new Throwable($th->getMessage());
            }
        }

        public function adicionarNovo(Cliente $cliente){
            $comando = "INSERT INTO cliente (nome, dataCadastro) VALUES (:nome, :dataCadastro)";
            $parametros = $this->parametros($cliente);

            $this->bancoDados->executar($comando, $parametros);
        }

        public function atualizar(Cliente $cliente){

        }

        private function parametros(Cliente $cliente){
            $parametros = array(
                "nome" => $cliente->getNome(),
                "dataCadastro" => (new DateTime())->format("Y-m-d H:i:s")
            );

            return $parametros;
        }

        public function existe(Cliente $cliente){
            $comando = "SELECT COUNT(cliente.id) as qtdRegistros WHERE id = :idCliente AND ativo = 1";
            $parametros = array(
                "idCliente" => $cliente->getId()
            );

            // $linhas = $this->
        }
    }