<?php
    require_once("../../../config.php");

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
            $ordemServico = $this->obterComId($idOrdemServico)[0]; 
            $cliente = (new ClienteController())->obterComId($ordemServico['idSolicitante']);
            (new EmailSender())->enviarEmail($cliente->getEmail(), "Email Transacional", "Bem Vindo");

            return $this->dao->modificarStatus($idOrdemServico, $statusNovo);
        }

        public function atualizarValor($idOrdemServico, $valor){
            return $this->dao->atualizarValor($idOrdemServico, $valor);
        }
    }