<?php
	class OpsService{
		private $dao = null;

        public function __construct($opsDAO){
			$this->dao = $opsDAO;
		}

        public function salvar($ops){
			return $this->dao->salvar($ops);
		}
	}
?>