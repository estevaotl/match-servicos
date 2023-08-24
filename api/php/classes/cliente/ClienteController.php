<?php
    require_once($_SERVER['DOCUMENT_ROOT'] . "/match-servicos/api/config.php");

    class ClienteController{
        private $service = null;

        public function __construct(BancoDados $conexao = null){
			if(isset($conexao))
				$bancoDados = $conexao;
			else
				$bancoDados = BDSingleton::get();

			$clienteDAO = new ClienteDAO($bancoDados);
			$this->service = new ClienteService($clienteDAO);
		}

        public function salvar($dados){
            $erro = array();

            $cliente = new Cliente();

            if(isset($dados['id'])){
                $cliente->setId($dados['id']);
            }

            if(isset($dados['nome'])){
                $cliente->setNome($dados['nome']);
            }

            if(isset($dados['email'])){
                $cliente->setEmail($dados['email']);
            }

            if(isset($dados['whatsapp'])){
                $cliente->setWhatsapp($dados['whatsapp']);
            }

            if(isset($dados['genero'])){
                $cliente->setGenero($dados['genero']);
            }

            if(isset($dados['senha'])){
                $cliente->setSenha($dados['senha']);
            }

            if(isset($dados['documento']) && isset($dados['dataNascimento'])){
                $dadosClienteFisico = new DadosClienteFisico();
                $dadosClienteFisico->setCpf($dados['documento']);
                $dadosClienteFisico->setDataNascimento($dados['dataNascimento']);

                $cliente->setDadosEspecificos($dadosClienteFisico);
            } else {
                $dadosClienteJuridico = new DadosClienteJuridico();
                $dadosClienteJuridico->setCnpj($dados['documento']);
                $dadosClienteJuridico->setInscricaoEstadual($dados['inscricaoEstadual']);
                $dadosClienteJuridico->setRazaoSocial($dados['razaoSocial']);

                $cliente->setDadosEspecificos($dadosClienteJuridico);
            }

            if(isset($dados['ehPrestadorDeServicos']) && $dados['ehPrestadorDeServicos'] == true){
                $cliente->setPrestadorDeServicos(true);
                if(isset($dados['servicosPrestados'])){
                    $cliente->setServicosPrestados($dados['servicosPrestados']);
                }
            }

            return $this->service->salvar($cliente, $erro);
        }

        public function logar($email, $senha){
			$this->service->logar($email, $senha);
		}

		public function deslogar(){
			$this->service->deslogar();
		}

        public function obterComEmail($email){
			return $this->service->obterComEmail($email);
		}

        public function obterComId($id, $completo = true){
            return $this->service->obterComId($id, $completo);
        }

        public function obterComRestricoes($parametros){
            $restricoes = array();

            if(isset($parametros['q'])){
                $restricoes['q'] = $parametros['profissao'];
            }

            return $this->service->obterComRestricoes($restricoes);
        }
    }