<?php
require_once("../../../config.php");

class OrdemServicoController
{
    private $service = null;

    public function __construct(BancoDados $conexao = null)
    {
        if (isset($conexao))
            $bancoDados = $conexao;
        else
            $bancoDados = BDSingleton::get();

        $ordemServicoDAO = new OrdemServicoDAO($bancoDados);
        $this->service = new OrdemServicoService($ordemServicoDAO);
    }

    public function salvar($dados)
    {
        $erro = array();

        $ordemServico = new OrdemServico();

        if (isset($dados['id'])) {
            $ordemServico->setId($dados['id']);
        }

        if (isset($dados['idCliente'])) {
            $ordemServico->setCliente($dados['idCliente']);
        }

        if (isset($dados['idTrabalhador'])) {
            $ordemServico->setTrabalhador($dados['idTrabalhador']);
        }

        return $this->service->salvar($ordemServico, $erro);
    }

    public function obterComId($idTrabalhador, $completo = true)
    {
        return $this->service->obterComId($idTrabalhador, $completo);
    }

    public function modificarStatus($idOrdemServico, $statusNovo){
        return $this->service->modificarStatus($idOrdemServico, $statusNovo);
    }

    public function atualizarValor($idOrdemServico, $valor){
        return $this->service->atualizarValor($idOrdemServico, $valor);
    }
}
