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
            $comando = " UPDATE cliente SET email = :email, whatsapp = :whatsapp, genero = :genero, prestadorServico = :prestadorServico WHERE cliente.id = :idCliente ";

            $parametros = array(
                "idCliente" => $cliente->getId(),
                "email" => $cliente->getEmail(),
                "genero" => $cliente->getGenero(),
                "whatsapp" => $cliente->getWhatsapp(),
                "prestadorServico" => $cliente->getPrestadorDeServicos() ? 1 : 0
            );

            $this->bancoDados->executar($comando, $parametros);
        }

        public function existe(Cliente $cliente){
            $comando = "SELECT COUNT(cliente.id) as qtdRegistros FROM cliente WHERE id = :idCliente AND ativo = 1";
            $parametros = array(
                "idCliente" => $cliente->getId()
            );

            $linhas = $this->bancoDados->consultar($comando, $parametros)["qtdRegistros"];
            return count($linhas) > 0;
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
    }