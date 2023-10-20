<?php

if (strpos($_SERVER['HTTP_REFERER'], 'localhost') !== false) {
    require_once __DIR__ . '/../../../config.php';
} else {
    require_once($_SERVER['DOCUMENT_ROOT']."/config.php");
}

class OpsController
{
	private $service = null;

	public function __construct(BancoDados $conexao = null)
	{
		if (isset($conexao))
			$bancoDados = $conexao;
		else
			$bancoDados = BDSingleton::get();

		$opsDAO = new OpsDAO($bancoDados);
		$this->service = new OpsService($opsDAO);
	}

	public function criarOps($exception)
	{
		$ops = new Ops();
		$ops->setArquivo($exception['arquivo']);
		$ops->setTrace($exception['trace']);
		$ops->setMensagem($exception['mensagem']);
		return $ops;
	}

	public function salvar($ops)
	{
		return $this->service->salvar($ops);
	}
}
