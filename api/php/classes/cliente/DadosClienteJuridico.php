<?php
    class DadosClienteJuridico{
        private $id = 0;
        private $cnpj = "";
        private $inscricaoEstadual = "";
        private $razaoSocial = "";
        private $situacaoTributaria = "";

        public function __construct() {}

        public function getId(){
            return $this->id;
        }

        public function setId($id){
            $this->id = $id;
        }

        public function getCnpj(){
            return $this->cnpj;
        }

        public function setCnpj($cnpj){
            $this->cnpj = $cnpj;
        }

        public function getInscricaoEstadual(){
            return $this->inscricaoEstadual;
        }

        public function setInscricaoEstadual($inscricaoEstadual){
            $this->inscricaoEstadual = $inscricaoEstadual;
        }

        public function getRazaoSocial(){
            return $this->razaoSocial;
        }

        public function setRazaoSocial($razaoSocial){
            $this->razaoSocial = $razaoSocial;
        }

        public function getSituacaoTributaria(){
            return $this->situacaoTributaria;
        }

        public function setSituacaoTributaria($situacaoTributaria){
            $this->situacaoTributaria = $situacaoTributaria;
        }
    }

?>