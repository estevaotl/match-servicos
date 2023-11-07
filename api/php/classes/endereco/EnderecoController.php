<?php
    if (strpos($_SERVER['HTTP_REFERER'], 'localhost') !== false) {
        require_once __DIR__ . '/../../../config.php';
    } else {
        require_once($_SERVER['DOCUMENT_ROOT']."/config.php");
    }

    class EnderecoController
    {
        private $service = null;

        public function __construct(BancoDados $conexao = null)
        {
            if (isset($conexao))
                $bancoDados = $conexao;
            else
                $bancoDados = BDSingleton::get();

            $enderecoDAO = new EnderecoDAO($bancoDados);
            $this->service = new EnderecoService($enderecoDAO);
        }

        public function obterComId($idEndereco, $completo = true){
            return $this->service->obterComId($idEndereco, $completo);
        }

        public function existeEnderecoAtivoCliente($idCliente){
            return $this->service->existeEnderecoAtivoCliente($idCliente);
        }

        public function desativarEnderecoCliente($idCliente){
            return $this->service->desativarEnderecoCliente($idCliente);
        }
    }
