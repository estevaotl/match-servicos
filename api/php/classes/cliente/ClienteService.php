<?php
    class ClienteService{
        private $dao = null;

        public function __construct($clienteDAO){
			$this->dao = $clienteDAO;
		}

        public function salvar($cliente){
            $erro = array();

            $this->validar($cliente, $erro);

            try {
                return $this->dao->salvar($cliente);
            } catch (\Throwable $th) {
                //throw $th;
            }
        }

        private function validar($cliente, &$erro){
            
        }

        public function logar($email, $senha){
			if($senha == "") throw new Exception('Usuário ou senha incorretos');

			if(!isset($_SESSION)){
				session_start();
			}

			$cliente = $this->dao->obterComEmailESenha($email, $senha)[0];
			if($cliente == null){
				throw new Exception('E-mail ou senha incorreta');
			}

			$_SESSION['idCliente'] = $cliente['id'];
		}

		public function deslogar(){
			if(!isset($_SESSION)){
				session_start();
			}

			if(isset($_SESSION['idCliente']))
				unset($_SESSION['idCliente']);
		}

		public function obterComEmail($email){
			return $this->dao->obterComEmail($email);
		}

		public function obterComId($id, $completo = true){
            return $this->dao->obterComId($id, $completo);
        }
    }