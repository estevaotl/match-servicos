<?php
require_once($_SERVER['DOCUMENT_ROOT']."/config.php");

class ImagemLocal
{
	private $id = 0;
	private $idObjeto = 0;
	private $nomeArquivo = "";
	private $pasta = "";
	private $imagem = "";
	private $ehImagemPerfil = false;

	public function __construct()
	{
	}

	public function getId()
	{
		return $this->id;
	}

	public function setId($id)
	{
		$this->id = $id;
	}

	public function getIdObjeto()
	{
		return $this->idObjeto;
	}

	public function setIdObjeto($idObjeto)
	{
		$this->idObjeto = $idObjeto;
	}

	public function getNomeArquivo()
	{
		return $this->nomeArquivo;
	}

	public function setNomeArquivo($nomeArquivo)
	{
		$this->nomeArquivo = $nomeArquivo;
	}

	public function getPasta()
	{
		return $this->pasta;
	}

	public function setPasta($pasta)
	{
		$this->pasta = $pasta;
	}

	public function getImagem()
	{
		return $this->imagem;
	}

	public function setImagem($imagem)
	{
		$this->imagem = $imagem;
	}

	public function getEhImagemPerfil()
	{
		return $this->ehImagemPerfil;
	}

	public function setEhImagemPerfil($ehImagemPerfil)
	{
		$this->ehImagemPerfil = $ehImagemPerfil;
	}
}
