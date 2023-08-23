<?php

    class ClienteDAO{
        private $bancoDados = null;

        public function __construct($bancoDados){
			$this->bancoDados = $bancoDados;
		}

        public function salvar(Cliente &$cliente){
            try {
                if($this->existe($cliente)){
                    return $this->atualizar($cliente);
                } else {
                    return $this->adicionarNovo($cliente);
                }
            } catch (Throwable $th) {
                throw new Throwable($th->getMessage());
            }
        }

        public function adicionarNovo(Cliente $cliente){
            $comando = "INSERT INTO cliente (nome, email, dataCadastro, whatsapp, genero, prestadorServico, senha) VALUES (:nome, :email, :dataCadastro, :whatsapp, :genero, :prestadorServico, :senha)";
            $parametros = $this->parametros($cliente);

            $this->bancoDados->executar($comando, $parametros);
            $cliente->setId($this->bancoDados->ultimoIdInserido());

            // $this->adicionarDadosEspecificos($cliente);

            return $cliente;
        }

        public function atualizar(Cliente $cliente){
            $comando = " UPDATE cliente SET email = :email, whatsapp = :whatsapp, genero = :genero, prestadorServico = :prestadorServico, servicosPrestados = :servicosPrestados WHERE cliente.id = :idCliente ";

            $parametros = array(
                "idCliente" => $cliente->getId(),
                "email" => $cliente->getEmail(),
                "genero" => $cliente->getGenero(),
                "whatsapp" => $cliente->getWhatsapp(),
                "prestadorServico" => $cliente->getPrestadorDeServicos() ? 1 : 0,
                "servicosPrestados" => $cliente->getServicosPrestados()
            );

            $this->bancoDados->executar($comando, $parametros);
        }

        public function existe(Cliente $cliente){
            $comando = "SELECT COUNT(cliente.id) as qtdRegistros FROM cliente WHERE id = :idCliente AND ativo = 1";
            $parametros = array(
                "idCliente" => $cliente->getId()
            );

            $linhas = $this->bancoDados->consultar($comando, $parametros)[0]["qtdRegistros"];
            return $linhas > 0;
        }

        public function transformarEmObjeto($l, $completo = true){
			$cliente = new Cliente();

			// if($this->getBancoDados()->existe('pessoafisica','idCliente',$l['id'],'',false)){ //Transformar em pessoa física
			// 	$cliente = new PessoaFisica($l['id']);
			// 	$this->preencherPF($cliente);
			// }else{ //Transformar em pessoa jurídica
			// 	$cliente = new PessoaJuridica($l['id']);
			// 	$this->preencherPJ($cliente);
			// }

            $cliente->setId($l['id']);
			$cliente->setNome($l['nome']);
			$cliente->setEmail($l['email']);
			$cliente->setWhatsapp($l['whatsapp']);
            $cliente->setDataCadastro($l['dataCadastro']);
            $cliente->setPrestadorDeServicos(filter_var($l['prestadorServico'], FILTER_VALIDATE_BOOLEAN));
            $cliente->setGenero($l['genero']);
            $cliente->setWhatsapp($l['whatsapp']);
            $cliente->setAtivo(filter_var($l['ativo'], FILTER_VALIDATE_BOOLEAN));
            $cliente->setImagem($this->obterImagens($l['id']));
            $cliente->setServicosPrestados($l['servicosPrestados']);
			return $cliente;
		}

        private function obterImagens($idCliente){
            $comando = "SELECT * FROM imagem WHERE idObjeto = :idObjeto";
            $parametros = array(
                "idObjeto" => $idCliente
            );

            return $this->bancoDados->consultar($comando, $parametros, true);
        }

        public function adicionarDadosEspecificos(Cliente $cliente){
            if ($cliente->getDadosEspecificos() instanceof DadosClienteFisico) {
                $comando = "INSERT INTO pessoafisica (idCliente, cpf, dataNascimento) VALUES (:idCliente, :cpf, :dataNascimento)";
                $parametros = $this->parametrosClienteFisico($cliente);
            } elseif($cliente->getDadosEspecificos() instanceof DadosClienteJuridico) {
                $comando = "INSERT INTO pessoafisica (idCliente, cnpj, inscricaoEstadual, razaoSocial) VALUES (:idCliente, :cnpj, :inscricaoEstadual, :razaoSocial)";
                $parametros = $this->parametrosClienteJuridico($cliente);
            }

            $this->bancoDados->executar($comando, $parametros);
        }

        private function parametros(Cliente $cliente){
            $parametros = array(
                "nome" => $cliente->getNome(),
                "dataCadastro" => (new DateTime())->format("Y-m-d H:i:s"),
                "email" => $cliente->getEmail(),
                "genero" => $cliente->getGenero(),
                "whatsapp" => $cliente->getWhatsapp(),
                "prestadorServico" => $cliente->getPrestadorDeServicos() ? 1 : 0,
                "senha" => Util::encripta($cliente->getSenha())
            );

            return $parametros;
        }

        private function parametrosClienteFisico(Cliente $cliente){
            $parametros = array(
                "idCliente" => $cliente->getId(),
                "cpf" => $cliente->getDadosEspecificos()->getCpf(),
                "dataNascimento" => $cliente->getDadosEspecificos()->getDataNascimento()
            );

            return $parametros;
        }

        private function parametrosClienteJuridico(Cliente $cliente){
            $parametros = array(
                "idCliente" => $cliente->getId(),
                "cnpj" => $cliente->getDadosEspecificos()->getCnpj(), 
                "inscricaoEstadual" => $cliente->getDadosEspecificos()->getInscricaoEstadual(), 
                "razaoSocial" => $cliente->getDadosEspecificos()->getRazaoSocial()
            );

            return $parametros;
        }

        public function obterComEmailESenha($email, $senha){
			$senha = Util::encripta($senha);

            $comando = "select * from cliente where email = :email and senha = :senha and ativo = 1";
            $parametros = array(
                "email" => $email,
                "senha" =>  $senha
            );

			return $this->bancoDados->consultar($comando, $parametros, true);
		}

        public function obterComEmail($email){
			$comando = "select * from cliente where email = :email and ativo = 1";
			$parametros = array(
				"email" => $email
			);

			return $this->bancoDados->obterObjeto($comando, array($this, 'transformarEmObjeto'), $parametros);
		}

        public function obterComId($id, $completo = true){
			$comando = "select * from cliente where id = :id";
			$parametros = array(
				"id" => $id
			);

			return $this->bancoDados->obterObjeto($comando, array($this, 'transformarEmObjeto'), $parametros, $completo);
		}

        public function obterComRestricoes($restricoes = array()){
            $comando = "SELECT * FROM cliente ";
            $where = " WHERE ativo = 1 ";
            $parametros = array();

            if(isset($restricoes['profissao'])){
                $where .= " AND cliente.servicosPrestados LIKE :profissao ";
                $parametros['profissao'] = '%' . $restricoes['profissao'] . '%';
            }

            $comando = $comando . $where;

            return $this->bancoDados->obterObjeto($comando, array($this, 'transformarEmObjeto'), $parametros);
        }
    }