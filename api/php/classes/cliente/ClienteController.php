<?php

    require_once($_SERVER['DOCUMENT_ROOT']."/config.php");

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

            $camposComuns = ["nome", "email", "whatsapp", "genero", "senha"];

            foreach ($camposComuns as $campo) {
                $setter = 'set' . ucfirst($campo); // Obtém o nome do método setter para o campo atual

                $cliente->$setter($dados[$campo]);
            }

            if($dados['documento'] && $dados['dataNascimento']){
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

            if($dados['ehPrestadorDeServicos']){
                $cliente->setPrestadorDeServicos(true);
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
    }