<?php
    class OrdemServico {
        private $id = 0;
        private $trabalhador = "";
        private $cliente = "";
        private $ativo = true;
        private $virouServico = false;
        private $status = 0;
        private $valor = 0.0;
        private $dataCriacao = "";

        public function __construct() {}

        public function getId(){
            return $this->id;
        }

        public function setId($id){
            $this->id = $id;
        }

        public function getAtivo(){
            return $this->ativo;
        }

        public function setAtivo($ativo){
            $this->ativo = $ativo;
        }

        public function getTrabalhador(){
            return $this->trabalhador;
        }

        public function setTrabalhador($trabalhador){
            $this->trabalhador = $trabalhador;
        }

        public function getCliente(){
            return $this->cliente;
        }

        public function setCliente($cliente){
            $this->cliente = $cliente;
        }

        public function getVirouServico(){
            return $this->virouServico;
        }

        public function setVirouServico($virouServico){
            $this->virouServico = $virouServico;
        }

        public function getStatus(){
            return $this->status;
        }

        public function setStatus($status){
            $this->status = $status;
        }

        public function getValor(){
            return $this->valor;
        }

        public function setValor($valor){
            $this->valor = $valor;
        }

        public function getDataCriacao(){
            return $this->dataCriacao;
        }

        public function setDataCriacao($dataCriacao){
            $this->dataCriacao = $dataCriacao;
        }
    }