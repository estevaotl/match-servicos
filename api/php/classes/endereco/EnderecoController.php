<?php
require_once($_SERVER['DOCUMENT_ROOT'] . "/match-servicos/api/config.php");

class EnderecoController
{
    // private $service = null;

    // public function __construct(BancoDados $conexao = null){
    // 	if(isset($conexao))
    // 		$bancoDados = $conexao;
    // 	else
    // 		$bancoDados = BDSingleton::get();

    // 	$enderecoDAO = new EnderecoDAO($bancoDados);
    // 	$this->service = new EnderecoService($enderecoDAO);
    // }

    // public function salvar($cliente){
    //     $erro = array();

    //     $endereco = new Endereco();

    //     $enderecoCliente = $cliente->getEndereco();

    //     if(isset($enderecoCliente->getId())){
    //         $endereco->setId($enderecoCliente->getId());
    //     }

    //     if(isset($enderecoCliente->getCep())){
    //         $endereco->setCEP($enderecoCliente->getCep());
    //     }

    //     if(isset($enderecoCliente->getRua())){
    //         $endereco->setRua($enderecoCliente->getRua());
    //     }

    //     if(isset($enderecoCliente->getComplemento())){
    //         $endereco->setComplemento($enderecoCliente->getComplemento());
    //     }

    //     if(isset($enderecoCliente->getCidade())){
    //         $endereco->setCidade($enderecoCliente->getCidade());
    //     }

    //     if(isset($enderecoCliente->getBairro())){
    //         $endereco->setBairro($enderecoCliente->getBairro());
    //     }

    //     if(isset($enderecoCliente->getEstado())){
    //         $endereco->setEstado($enderecoCliente->getEstado());
    //     }

    //     if(isset($enderecoCliente->getNumero())){
    //         $endereco->setNumero($enderecoCliente->getNumero());
    //     }

    //     return $this->service->salvar($endereco, $erro);
    // }
}
