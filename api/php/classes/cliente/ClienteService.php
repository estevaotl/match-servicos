<?php
    class ClienteService{
        private $dao = null;

        public function __construct($clienteDAO){
			$this->dao = $clienteDAO;
		}

        public function salvar($cliente, $ehAtualizar = false){
            $erro = array();

            try {
				$this->validar($cliente, $erro, $ehAtualizar);

                return $this->dao->salvar($cliente);
            } catch (\Throwable $th) {
                throw new ControllerException($th->getMessage());
            }
        }

        private function validar($cliente, &$erro, $ehAtualizar = false){
			if(mb_strlen($cliente->getNome()) <= 0)
				$erro['nome'] = "Nome inválido";

            if(!UtilValidacoes::validarEmail($cliente->getEmail()))
				$erro['email'] = "E-mail inválido";

			if($this->dao->existeEmail($cliente))
				$erro['email'] = "E-mail já cadastrado";

			if(!$ehAtualizar){
				if($cliente->getDadosEspecificos() instanceof DadosClienteFisico){
					if($cliente->getDadosEspecificos()->getCPF() == "" || !UtilValidacoes::validarCPF($cliente->getDadosEspecificos()->getCPF()))
						$erro['cpfcnpj'] = "O CPF digitado é inválido";

					if($this->dao->existeCpf($cliente->getDadosEspecificos()))
						$erro['cpfcnpj'] = "CPF já cadastrado";

					if($cliente->getDadosEspecificos()->getIdade() < 18)
						$erro['idade'] = "Você precisa ter ao menos 18 anos";

				} else if($cliente->getDadosEspecificos() instanceof DadosClienteJuridico){
					if(mb_strlen($cliente->getDadosEspecificos()->getRazaoSocial()) < 1)
						$erro['razaoSocial'] = "Preencha a razão social";

					if($cliente->getDadosEspecificos()->getSituacaoTributaria() == SituacaoTributaria::ISENTO){
						$cliente->getDadosEspecificos()->setInscricaoEstadual("ISENTO");
					}elseif($cliente->getDadosEspecificos()->getSituacaoTributaria() == SituacaoTributaria::CONTRIBUINTE || ($cliente->getDadosEspecificos()->getSituacaoTributaria() == SituacaoTributaria::NAO_CONTRIBUINTE && $cliente->getDadosEspecificos()->getInscricaoEstadual() != "")){
						if($this->dao->existeInscricaoEstadual($cliente))
							$erro['inscricaoEstadual'] = "Inscrição Estadual já cadastrada";
					}

					if(mb_strlen($cliente->getDadosEspecificos()->getCNPJ()) < 1)
						$erro['cpfcnpj'] = "Preencha o CNPJ corretamente";
					elseif(!UtilValidacoes::validarCNPJ($cliente->getDadosEspecificos()->getCNPJ()))
						$erro['cpfcnpj'] = "O CNPJ digitado é inválido";
					elseif($this->dao->existeCnpj($cliente))
						$erro['cpfcnpj'] = "CNPJ já cadastrado";
				} else {
					$erro['cpfcnpj'] = "Preencha corretamente o CPF ou CNPJ.";
				}
			}

			//Erro de senha
			$minimoCaracteresSenha = 8;

			if($cliente->getId() == 0){
				if($cliente->getSenha() == "")
					$erro['senha'] = "Preencha a senha";
				if(mb_strlen($cliente->getSenha()) < $minimoCaracteresSenha)
					$erro['senha'] = 'A senha deve ter no mínimo '.$minimoCaracteresSenha.' caracteres';
			}else if($cliente->getSenha() != "" && mb_strlen($cliente->getSenha()) < $minimoCaracteresSenha){
				$erro['senha'] = 'A senha deve ter no mínimo '.$minimoCaracteresSenha.' caracteress';
			}

			if(!empty($cliente->getEndereco())){
				$enderecoController = new EnderecoController();
				if($enderecoController->existeEnderecoAtivoCliente($cliente->getId())){
					$enderecoController->desativarEnderecoCliente($cliente->getId());
				}
			}

			if(count($erro) > 0){
				throw new Exception(UtilValidacoes::gerarMensagemDeErro($erro, null, "\n"));
			}
		}

        public function logar($email, $senha){
			if($senha == "") throw new Exception('Usuário ou senha incorretos');

			if(!isset($_SESSION)){
				session_start();
			}

			$cliente = $this->dao->obterComEmailESenha($email, $senha);
			if(count($cliente) <= 0){
				throw new Exception('E-mail ou senha incorreta');
			}

			$_SESSION['idCliente'] = $cliente[0]['id'];
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

		public function obterComRestricoes($restricoes = array(), $limit = ''){
            return $this->dao->obterComRestricoes($restricoes, $limit);
        }
    }