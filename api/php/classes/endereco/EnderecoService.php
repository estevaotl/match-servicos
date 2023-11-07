<?php
    class EnderecoService{
        private $dao = null;

        public function __construct($enderecoDAO){
			$this->dao = $enderecoDAO;
		}

        public function obterComId($idEndereco, $completo = true){
            return $this->dao->obterComId($idEndereco, $completo);
        }

        public function existeEnderecoAtivoCliente($idCliente){
            return $this->dao->existeEnderecoAtivoCliente($idCliente);
        }

        public function desativarEnderecoCliente($idCliente){
            return $this->dao->desativarEnderecoCliente($idCliente);
        }
    }