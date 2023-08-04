<?php
	class Ops{
		private $id = 0;
		private $arquivo = "";
		private $trace = "";
		private $horario = null;
		private $mensagem = "";
		
		public function getId(){
			return $this->id;
		}
		
		public function setId($id){
			$this->id = $id;
		}
		
		public function getArquivo(){
			return $this->arquivo;
		}
		
		public function setArquivo($arquivo){
			$this->arquivo = $arquivo;
		}
		
		public function getTrace(){
			return $this->trace;
		}
		
		public function setTrace($trace){
			$this->trace = $trace;
		}
		
		public function getHorario(){
			return $this->horario;
		}
		
		public function setHorario($horario){
			$this->horario = date("d-m-Y H:i", strtotime($horario));
		}
		
		public function getMensagem(){
			return $this->mensagem;
		}
		
		public function setMensagem($mensagem){
			$this->mensagem = $mensagem;
		}
	}
?>