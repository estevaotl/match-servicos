<?php
	require_once($_SERVER['DOCUMENT_ROOT'] . "/match-servicos/api/config.php");

	class ImagemLocalDAO{
		private $bancoDados = null;

        public function __construct($bancoDados){
			$this->bancoDados = $bancoDados;
		}

        public function salvar($obj){
			try{
				$this->bancoDados->iniciarTransacao();
				$return = null;

				if($obj->getId() == BancoDados::ID_INEXISTENTE){
                    $id = $this->adicionarNovo($obj);
					$obj->setId($id);
				}else{
					$return = $this->atualizar($obj);
				}

				$this->bancoDados->finalizarTransacao();
				return $return;
			}catch(Exception $e){
				$this->bancoDados->desfazerTransacao();
				throw $e;
			}
			return false;
		}

		protected function adicionarNovo($imagemLocal){
			$comando = "insert into imagem (idObjeto, nomeArquivo, pasta, ehImagemPerfil) values (:idObjeto, :nomeArquivo, :pasta, :ehImagemPerfil)";
			$linha = $this->bancoDados->geraTeste($comando,  $this->parametros($imagemLocal));
			return $this->bancoDados->executar($comando, $this->parametros($imagemLocal));
		}

		protected function atualizar($imagemLocal){
			$comando = 'update imagem set pasta = :pasta, imagem = :imagem where id = :id';
			$this->bancoDados->executar($comando, $this->parametros($imagemLocal));
		}

		protected function parametros($imagemLocal){
			return array(
				'idObjeto' => $imagemLocal->getIdObjeto(),
				'nomeArquivo' => $imagemLocal->getNomeArquivo(),
				'pasta' => $imagemLocal->getPasta(),
				'ehImagemPerfil' => $imagemLocal->getEhImagemPerfil() ? 1 : 0
			);
		}

		public function existe($imagemLocal){
			/*if($this->getBancoDados()->existe('imagem', 'nome', $imagemLocal->getNome(), $imagemLocal->getId()))
				return true;
			return false;*/
		}

		public function transformarEmObjeto($l, $completo = true){
			$imagemLocal = new ImagemLocal();
			$imagemLocal->setId($l['id']);
			$imagemLocal->setIdObjeto($l['idObjeto']);
			$imagemLocal->setNomeArquivo($l['nomeArquivo']);
			$imagemLocal->setPasta($l['pasta']);
			$imagemLocal->setImagem($l['imagem']);
			return $imagemLocal;
		}

		public function obterComRestricoes($restricoes,$orderBy = 'principal desc, costas desc, ordem', $limit = null, $offset = 0, $completo = true){
			$query = 'select * from imagem';
			$where = ' where ativo = 1';
			$parametros = array();

			if(isset($restricoes['idObjeto'])){
				$where .= ' and idObjeto = :idObjeto';
				$parametros['idObjeto'] = $restricoes['idObjeto'];
			}

			if(isset($restricoes['nomeArquivo'])){
				$where .= ' and nomeArquivo = :nomeArquivo';
				$parametros['nomeArquivo'] = $restricoes['nomeArquivo'];
			}

			$comando = $query.$where;

			return $this->bancoDados->obterObjetos($comando,array($this,'transformarEmObjeto'), $parametros, $orderBy, $limit, $offset, $completo);
		}

		public function obterTodos($orderBy = 'principal desc, costas desc', $limit = null, $offset = 0, $completo = true){
			$comando = 'select * from imagem where ativo = 1';
			return $this->bancoDados->obterObjetos($comando, array($this, 'transformarEmObjeto'), array(), $orderBy, $limit, $offset, $completo);
		}

		public function obterComId($id, $completo = true){
			$comando = 'select * from imagem where id = :id';
			$parametros = array(
				'id' => $id
			);
			return $this->bancoDados->obterObjeto($comando, array($this, 'transformarEmObjeto'), $parametros, $completo);
		}

		public function excluirImagem($imagemLocal){
			$this->bancoDados->excluir($imagemLocal);
			return true;
		}

		public function excluirImagemComNomeEIdObjeto($nome, $idObjeto){
			$comando = 'delete from imagem where idObjeto = :idObjeto and imagem = :imagem';
			$parametros = array(
				'idObjeto' => $idObjeto,
				'imagem' => $nome
			);
			return $this->bancoDados->executar($comando,$parametros);
		}

		public function desativarComId($id){
			return $this->bancoDados->desativar('imagem', $id);
		}

		public function excluirComId($id){
			return $this->bancoDados->excluir('imagem', $id);
		}
	}
?>