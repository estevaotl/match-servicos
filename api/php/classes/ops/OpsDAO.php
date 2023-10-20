<?php

if (strpos($_SERVER['HTTP_REFERER'], 'localhost') !== false) {
    require_once __DIR__ . '/../../../config.php';
} else {
    require_once($_SERVER['DOCUMENT_ROOT']."/config.php");
}

class OpsDAO
{
	private $bancoDados = null;

	public function __construct($bancoDados)
	{
		$this->bancoDados = $bancoDados;
	}

	public function salvar($ops)
	{
		$comando = "insert into ops (arquivo, trace, mensagem, horario) values (:arquivo, :trace, :mensagem, now())";
		$parametros = array(
			"arquivo" => $ops->getArquivo(),
			"trace" => $ops->getTrace(),
			"mensagem" => $ops->getMensagem()
		);

		$this->bancoDados->executar($comando, $parametros);
		return $this->bancoDados->ultimoIdInserido();
	}
}
