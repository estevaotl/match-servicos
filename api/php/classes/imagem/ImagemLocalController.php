<?php
require_once($_SERVER['DOCUMENT_ROOT'] . "/match-servicos/api/config.php");

class ImagemLocalController
{
    private $service = null;

    public function __construct(BancoDados $conexao = null)
    {
        if (isset($conexao))
            $bancoDados = $conexao;
        else
            $bancoDados = BDSingleton::get();

        $imagemLocalDAO = new ImagemLocalDAO($bancoDados);
        $this->service = new ImagemLocalService($imagemLocalDAO);
    }

    public function salvar(ImagemLocal $imagemLocal)
    {
        $erro = array();
        return $this->service->salvar($imagemLocal, $erro);
    }
}
