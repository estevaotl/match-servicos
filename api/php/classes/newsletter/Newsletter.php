<?php
    class Newsletter{

        private $id = 0;
        private $email = "";
        private $nome = "";
        private $dataCadastro = "";

        public function __construct() {}

        public function getId(){
            return $this->id;
        }

        public function setId($id){
            $this->id = $id;
        }

        public function getEmail(){
            return $this->email;
        }

        public function setEmail($email){
            $this->email = $email;
        }

        public function getNome(){
            return $this->nome;
        }

        public function setNome($nome){
            $this->nome = $nome;
        }

        public function getDataCadastro(){
            return $this->dataCadastro;
        }

        public function setDataCadastro($dataCadastro){
            $this->dataCadastro = $dataCadastro;
        }
    }