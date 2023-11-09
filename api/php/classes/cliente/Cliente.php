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
        private $imagem = array();
        private $imagemPerfil = array();
        private $servicosPrestados = "";

        private $endereco = array();

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

        public function getDataCadastro(){
            return $this->dataCadastro;
        }

        public function setDataCadastro($dataCadastro){
            $this->dataCadastro = $dataCadastro;
        }

        public function getAtivo(){
            return $this->ativo;
        }

        public function setAtivo($ativo){
            $this->ativo = $ativo;
        }

        public function jsonSerialize() {
            return [
                'id' => $this->getId(),
                'nome' => $this->getNome(),
                'email' => $this->getEmail(),
                'prestadorDeServicos' => $this->getPrestadorDeServicos(),
                'genero' => $this->getGenero(),
                'whatsapp' => $this->getWhatsapp(),
                'imagem' => $this->getImagem(),
                'servicosPrestados' => $this->getServicosPrestados(),
                'endereco' => $this->getEndereco(),
                'imagemPerfil' => $this->getImagemPerfil(),
                'dadosEspecificos' => $this->getDadosEspecificos()
            ];
        }

        public function getImagem(){
            return $this->imagem;
        }

        public function setImagem($imagem){
            $this->imagem = $imagem;
        }

        public function getServicosPrestados(){
            return $this->servicosPrestados;
        }

        public function setServicosPrestados($servicosPrestados){
            $this->servicosPrestados = $servicosPrestados;
        }

        public function getEndereco(){
            return $this->endereco;
        }

        public function setEndereco($endereco){
            $this->endereco = $endereco;
        }

        public function getImagemPerfil(){
            return $this->imagemPerfil;
        }

        public function setImagemPerfil($imagemPerfil){
            $this->imagemPerfil = $imagemPerfil;
        }
    }