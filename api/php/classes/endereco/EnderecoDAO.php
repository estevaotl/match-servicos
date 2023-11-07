<?php

class EnderecoDAO
{
    private $bancoDados = null;

    public function __construct($bancoDados)
    {
        $this->bancoDados = $bancoDados;
    }

    public function obterComId($idEndereco, $completo = true){
        $comando = "SELECT * FROM endereco WHERE id = :idEndereco AND ativo = 1";
        $parametros = array(
            "idEndereco" => $idEndereco
        );

        return $this->bancoDados->consultar($comando, $parametros, true);
    }

    public function existeEnderecoAtivoCliente($idCliente){
        $comando = "SELECT * FROM endereco WHERE idCliente = :idCliente AND ativo = 1";
        $parametros = array(
            "idCliente" => $idCliente
        );

        $linhas = $this->bancoDados->consultar($comando, $parametros, true);
        return count($linhas) > 0;
    }

    public function desativarEnderecoCliente($idCliente){
        $comando = "UPDATE endereco SET ativo = 0 WHERE idCliente = :idCliente";
        $parametros = array(
            "idCliente" => $idCliente
        );

        return $this->bancoDados->executar($comando, $parametros);
    }
}
