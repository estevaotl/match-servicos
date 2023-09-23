<?php
    class OrdemServicoService{
        private $dao = null;

        public function __construct($ordemServicoDAO){
			$this->dao = $ordemServicoDAO;
		}

        public function salvar($ordemServico){
            $erro = array();

            try {
                $this->validar($ordemServico, $erro);

                return $this->dao->salvar($ordemServico);
            } catch (\Throwable $th) {
                //throw $th;
            }
        }

        private function validar($ordemServico, &$erro){
            if(!empty($ordemServico->getTrabalhador()) && !empty($ordemServico->getCliente())){
                if($this->existeOrdemServicoAberta($ordemServico)){
                    $this->atualizarCliquesEntrarContato($ordemServico);
                }
            }
        }

        public function existeOrdemServicoAberta(OrdemServico $ordemServico){
            return $this->dao->existeOrdemServicoAberta($ordemServico);
        }

        public function atualizarCliquesEntrarContato(OrdemServico $ordemServico){
            return $this->dao->atualizarCliquesEntrarContato($ordemServico);
        }

        public function obterComId($idTrabalhador, $completo = true){
            return $this->dao->obterComId($idTrabalhador, $completo);
        }

        public function modificarStatus($idOrdemServico, $statusNovo){
            return $this->dao->modificarStatus($idOrdemServico, $statusNovo);
        }
    }