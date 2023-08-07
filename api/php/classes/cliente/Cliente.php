<?php
    class Cliente {
        private $id = 0;
        private $nome = "";
        private $email = "";
        private $whatsapp = "";
        private $genero = "";
        private $prestadorDeServicos = false;
        private $dadosEspecificos = array();
        private $senha = "";
        private $dataCadastro = "";
        private $ativo = true;

        public function __construct() {}

        public function getId(){
            return $this->id;
        }

        public function setId($id){
            $this->id = $id;
        }

        public function getNome(){
            return $this->nome;
        }
        public function setNome($nome){
            $this->nome = $nome;
        }

        public function getEmail(){
            return $this->email;
        }

        public function setEmail($email){
            $this->email = $email;
        }

        public function getWhatsapp(){
            return $this->whatsapp;
        }

        public function setWhatsapp($whatsapp){
            $this->whatsapp = $whatsapp;
        }

        public function getGenero(){
            return $this->genero;
        }

        public function setGenero($genero){
            $this->genero = $genero;
        }

        public function getPrestadorDeServicos(){
            return $this->prestadorDeServicos;
        }

        public function setPrestadorDeServicos($prestadorDeServicos){
            $this->prestadorDeServicos = $prestadorDeServicos;
        }

        public function getDadosEspecificos(){
            return $this->dadosEspecificos;
        }

        public function setDadosEspecificos($dadosEspecificos){
            $this->dadosEspecificos = $dadosEspecificos;
        }

        public function getSenha(){
            return $this->senha;
        }

        public function setSenha($senha){
            $this->senha = $senha;
        }

        /**
         * Get the value of dataCadastro
         */ 
        public function getDataCadastro()
        {
                return $this->dataCadastro;
        }

        /**
         * Set the value of dataCadastro
         *
         * @return  self
         */ 
        public function setDataCadastro($dataCadastro)
        {
                $this->dataCadastro = $dataCadastro;

                return $this;
        }

        /**
         * Get the value of ativo
         */ 
        public function getAtivo()
        {
                return $this->ativo;
        }

        /**
         * Set the value of ativo
         *
         * @return  self
         */ 
        public function setAtivo($ativo)
        {
                $this->ativo = $ativo;

                return $this;
        }
    }