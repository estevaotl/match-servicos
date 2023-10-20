<?php

if (strpos($_SERVER['HTTP_REFERER'], 'localhost') !== false) {
    require_once __DIR__ . '/../../../config.php';
} else {
    require_once($_SERVER['DOCUMENT_ROOT']."/config.php");
}

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

    public function desativarComId($idImagemLocal){
        return $this->service->desativarComId($idImagemLocal);
    }

    public function obterComRestricoes($restricoes = array(), $orderBy = 'id desc', $limit = null, $offset = 0){
        return $this->service->obterComRestricoes($restricoes, $orderBy, $limit, $offset);
    }
}
