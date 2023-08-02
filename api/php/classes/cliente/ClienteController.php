<?php
    class ClienteController{
        public function __construct() { }

        public function salvar($dados){
            $erro = array();

            $cliente = new Cliente();

            $camposComuns = ["nome", "email", "whatsapp", "genero"];

            foreach ($camposComuns as $campo) {
                $setter = 'set' . ucfirst($campo); // Obtém o nome do método setter para o campo atual

                $cliente->$setter($dados[$campo]);
            }

            if($dados['cpf'] && $dados['dataNascimento']){
                $dadosClienteFisico = new DadosClienteFisico();
                $dadosClienteFisico->setCpf($dados['cpf']);
                $dadosClienteFisico->setDataNascimento($dados['dataNascimento']);

                $cliente->setDadosEspecificos($dadosClienteFisico);
            } else {
                $dadosClienteJurico = new DadosClienteJuridico();
                $dadosClienteJurico->setCnpj($dados['cnpj']);
                $dadosClienteJurico->setInscricaoEstadual($dados['inscricaoEstadual']);
                $dadosClienteJurico->setRazaoSocial($dados['razaoSocial']);

                $cliente->setDadosEspecificos($dadosClienteJurico);
            }

            if($dados['prestadorSim']){
                $cliente->setPrestadorDeServicos(true);
            }

            (new ClienteService())->salvar($cliente, $erro);
        }
    }