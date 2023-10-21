<?php

    if (strpos($_SERVER['HTTP_REFERER'], 'localhost') !== false) {
        require_once __DIR__ . '/../../../config.php';
    } else {
        require_once($_SERVER['DOCUMENT_ROOT']."/config.php");
    }

    class OrdemServicoService{
        private $dao = null;

        public function __construct($ordemServicoDAO){
			$this->dao = $ordemServicoDAO;
		}

        public function salvar($ordemServico){
            $erro = array();

            try {
                $this->validar($ordemServico, $erro);

                $retorno = $this->dao->salvar($ordemServico);

                try {
                    $clienteController = new ClienteController();
                    $solicitante = $clienteController->obterComId($ordemServico->getCliente());
                    $trabalhador = $clienteController->obterComId($ordemServico->getTrabalhador());

                    $mensagem = "Essa é uma mensagem Automática! Olá " . $solicitante->getNome() . ". Gostaríamos de informar que a ordem de serviço " . $ordemServico->getId() . " foi criada neste exato momento. A partir de agora, toda vez que houver uma mudança de status pelo prestador de serviços " . $trabalhador->getNome() . ", você será informado(a). Obrigado por confiar na nossa plataforma! Atenciosamente, Match Serviços.";

                    Util::enviarEmail($solicitante->getEmail(), "Criação de Ordem Serviço", $mensagem);
                } catch (\Throwable $th) {
                    Util::logException($th);
                }

                return $retorno;
            } catch (\Throwable $th) {
                throw new ControllerException($th->getMessage());
            }
        }

        private function validar($ordemServico, &$erro){
            if(!empty($ordemServico->getTrabalhador()) && !empty($ordemServico->getCliente())){
                if($this->existeOrdemServicoAberta($ordemServico)){
                    $this->atualizarCliquesEntrarContato($ordemServico);

                    $erro['ordemServicoJaCriada'] = "Já existe uma ordem de serviço criada.";
                }
            }

            if(count($erro) > 0){
				throw new Exception(UtilValidacoes::gerarMensagemDeErro($erro, null, "\n"));
			}
        }

        public function existeOrdemServicoAberta(OrdemServico $ordemServico){
            return $this->dao->existeOrdemServicoAberta($ordemServico);
        }

        public function atualizarCliquesEntrarContato(OrdemServico $ordemServico){
            return $this->dao->atualizarCliquesEntrarContato($ordemServico);
        }

        public function obterComId($idOS, $completo = true){
            return $this->dao->obterComId($idOS, $completo);
        }

        public function modificarStatus($idOrdemServico, $statusNovo){
            try {
                $ordemServico = $this->obterComId($idOrdemServico)[0]; 
                $solicitante = (new ClienteController())->obterComId($ordemServico['idSolicitante']);
                $trabalhador = (new ClienteController())->obterComId($ordemServico['idTrabalhador']);

                $mensagem = "Essa é uma mensagem Automática! Olá " . $solicitante->getNome() . ". Gostaríamos de informar que a ordem de serviço " . $idOrdemServico . " sofreu uma atualização pelo prestador de serviços " . $trabalhador->getNome() . ". Novo Status: " . StatusOrdemServico::toString($statusNovo);

                Util::enviarEmail($solicitante->getEmail(), "Atualização de Ordem Serviço", $mensagem);
            } catch (\Throwable $th) {
                Util::logException($th);
            }

            return $this->dao->modificarStatus($idOrdemServico, $statusNovo);
        }

        public function atualizarValor($idOrdemServico, $valor){
            return $this->dao->atualizarValor($idOrdemServico, $valor);
        }

        public function obterOrdensServicoIdTrabalhador($idTrabalhador){
            return $this->dao->obterOrdensServicoIdTrabalhador($idTrabalhador);
        }
    }