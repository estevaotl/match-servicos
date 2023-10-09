<?php

require_once($_SERVER['DOCUMENT_ROOT']."/config.php");

class ImagemLocalService
{
    private $dao = null;

    public function __construct($imagemLocalDAO)
    {
        $this->dao = $imagemLocalDAO;
    }

    public function salvar($imagemLocal)
    {
        $erro = array();

        $this->validar($imagemLocal, $erro);

        try {
            return $this->dao->salvar($imagemLocal);
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    private function validar($imagemLocal, &$erro)
    {
    }

    public function desativarComId($idImagemLocal){
        return $this->dao->desativarComId($idImagemLocal);
    }

    public function obterComRestricoes($restricoes = array(), $orderBy = 'id desc', $limit = null, $offset = 0){
        return $this->dao->obterComRestricoes($restricoes, $orderBy, $limit, $offset);
    }
}
