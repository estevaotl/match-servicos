<?php

class OrdemServicoDAO
{
    private $bancoDados = null;

    public function __construct($bancoDados)
    {
        $this->bancoDados = $bancoDados;
    }

    public function salvar(OrdemServico &$ordemServico)
    {
        try {
            if ($this->existe($ordemServico)) {
                return $this->atualizar($ordemServico);
            } else {
                return $this->adicionarNovo($ordemServico);
            }
        } catch (Throwable $th) {
            throw new Throwable($th->getMessage());
        }
    }

    public function adicionarNovo(OrdemServico $ordemServico)
    {
        $comando = "INSERT INTO ordem_servico (idTrabalhador, idSolicitante) VALUES (:idTrabalhador, :idSolicitante)";
        $parametros = $this->parametros($ordemServico);

        $this->bancoDados->executar($comando, $parametros);
        $ordemServico->setId($this->bancoDados->ultimoIdInserido());

        return $ordemServico;
    }

    public function atualizar(OrdemServico $cliente)
    {
        // $comando = " UPDATE cliente SET email = :email, whatsapp = :whatsapp, genero = :genero, prestadorServico = :prestadorServico, servicosPrestados = :servicosPrestados WHERE cliente.id = :idCliente ";

        // $parametros = array(
        //     "idCliente" => $cliente->getId(),
        //     "email" => $cliente->getEmail(),
        //     "genero" => $cliente->getGenero(),
        //     "whatsapp" => $cliente->getWhatsapp(),
        //     "prestadorServico" => $cliente->getPrestadorDeServicos() ? 1 : 0,
        //     "servicosPrestados" => $cliente->getServicosPrestados()
        // );

        // $this->bancoDados->executar($comando, $parametros);
    }

    public function existe(OrdemServico $ordemServico)
    {
        $comando = "SELECT COUNT(ordem_servico.id) as qtdRegistros FROM ordem_servico WHERE idTrabalhador = :idTrabalhador AND idSolicitante = :idSolicitante and ativo = 1";
        $parametros = array(
            "idTrabalhador" => $ordemServico->getTrabalhador(),
            "idSolicitante" => $ordemServico->getCliente()
        );

        $linhas = $this->bancoDados->consultar($comando, $parametros)[0]["qtdRegistros"];
        return $linhas > 0;
    }

    public function transformarEmObjeto($l, $completo = true)
    {
        $ordemServico = new OrdemServico();

        $ordemServico->setId($l['id']);
        $ordemServico->setTrabalhador($l['idTrabalhador']);
        $ordemServico->setCliente($l['idSolicitante']);
        $ordemServico->setVirouServico(filter_var($l['virouServico'], FILTER_VALIDATE_BOOLEAN));
        $ordemServico->setValor($l['valor']);
        $ordemServico->setDataCriacao($l['dataCriacao']);
        $ordemServico->setStatus($l['status']);
        $ordemServico->setAtivo(filter_var($l['ativo'], FILTER_VALIDATE_BOOLEAN));

        return $ordemServico;
    }

    private function parametros(OrdemServico $ordemServico)
    {
        $parametros = array(
            "idTrabalhador" => $ordemServico->getTrabalhador(),
            "idSolicitante" => $ordemServico->getCliente()
        );

        return $parametros;
    }

    public function existeOrdemServicoAberta(OrdemServico $ordemServico){
        $comando = "SELECT 
                COUNT(id) AS qtd 
            FROM ordem_servico 
            WHERE 
                idTrabalhador = :idTrabalhador 
                AND idSolicitante = :idSolicitante 
                AND status = :aberta 
                AND ativo = 1";
        $parametros = array(
            "idTrabalhador" => $ordemServico->getTrabalhador(),
            "idSolicitante" => $ordemServico->getCliente(),
            "aberta" => StatusOrdemServico::EM_ABERTO
        );

        $linha = $this->bancoDados->consultar($comando, $parametros);
        return $linha[0]['qtd'] > 0;
    }

    public function atualizarCliquesEntrarContato(OrdemServico $ordemServico){
        $comando = "INSERT INTO log_cliques_contato (datahora, idTrabalhador, idSolicitante) VALUES (NOW(), :idTrabalhador, :idSolicitante)";
        $parametros = array(
            "idTrabalhador" => $ordemServico->getTrabalhador(),
            "idSolicitante" => $ordemServico->getCliente()
        );

        return $this->bancoDados->executar($comando, $parametros);
    }

    public function obterComId($idOrdemServico, $completo = true){
        $comando = "SELECT * FROM ordem_servico WHERE id = :idOrdemServico AND ativo = 1";
        $parametros = array(
            "idOrdemServico" => $idOrdemServico
        );

        return $this->bancoDados->consultar($comando, $parametros, true);
    }

    public function modificarStatus($idOrdemServico, $statusNovo){
        $comando = "UPDATE ordem_servico SET status = :status WHERE id = :id";
        $parametros = array(
            "id"     => $idOrdemServico,
            "status" => $statusNovo
        );

        return $this->bancoDados->executar($comando, $parametros);
    }

    public function atualizarValor($idOrdemServico, $valor){
        $comando = "UPDATE ordem_servico SET valor = :valor WHERE id = :id";
        $parametros = array(
            "id"     => $idOrdemServico,
            "valor" => $valor
        );

        return $this->bancoDados->executar($comando, $parametros);
    }

    public function obterOrdensServicoIdTrabalhador($idTrabalhador){
        $comando = "SELECT * FROM ordem_servico WHERE idTrabalhador = :idTrabalhador AND ativo = 1";
        $parametros = array(
            "idTrabalhador" => $idTrabalhador
        );

        $linhas = $this->bancoDados->consultar($comando, $parametros, true);
        $clienteController = new ClienteController();
        foreach ($linhas as &$linha) {
            $cliente = $clienteController->obterComId($linha['idSolicitante']);
            if($cliente instanceof Cliente){
                $linha['solicitante'] = $cliente->getNome();
            }
        }

        return $linhas;
    }
}
