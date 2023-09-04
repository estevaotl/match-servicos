<?php
    class Endereco {
        private $id = 0;
        private $cidade = "";
        private $bairro = "";
        private $cep = "";
        private $estado = "";
        private $rua = "";
        private $numero = "";
        private $complemento = "";

        public function __construct() {}

        public function getId(){
            return $this->id;
        }

        public function setId($id){
            $this->id = $id;
        }

        public function getCidade(){
            return $this->cidade;
        }

        public function setCidade($cidade){
            $this->cidade = $cidade;
        }

        public function getBairro(){
            return $this->bairro;
        }

        public function setBairro($bairro){
            $this->bairro = $bairro;
        }

        public function getCep(){
            return $this->cep;
        }

        public function setCep($cep){
            $this->cep = $cep;
        }

        public function getEstado(){
            return $this->estado;
        }

        public function setEstado($estado){
            $this->estado = $estado;
        }

        public function getRua(){
            return $this->rua;
        }

        public function setRua($rua){
            $this->rua = $rua;
        }

        public function getNumero(){
            return $this->numero;
        }

        public function setNumero($numero){
            $this->numero = $numero;
        }

        public function getComplemento(){
            return $this->complemento;
        }

        public function setComplemento($complemento){
            $this->complemento = $complemento;
        }
    }