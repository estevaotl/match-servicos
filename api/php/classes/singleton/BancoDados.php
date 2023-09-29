<?php

require_once($_SERVER['DOCUMENT_ROOT'] . "/match-servicos/api/config.php");

/**
 * Database utilities.
 */

class BancoDados
{

	private $pdo = NULL;	//PDO Object - Carrega a conexão com o banco de dados

	/**
	 * Indica se o objeto foi criado apenas como uma nova conexão para salvar um erro em um comando sql anterior
	 * Caso true, erros ao executar queries não serão salvos na tabela ops, para evitar um possível loop infinito de execução de comandos que geram erros
	 * e que criam novas conexões para salvar esses erros
	 */
	private $salvandoErro = false;
	/**
	 * Constante concatenada a mensagem da exceção quando não é possível salvar o comando que gerou um erro na tabela ops, existe apenas para indicar visualmente 
	 * que o erro na query original não estará salvo no banco
	 */
	const ERRO_SALVANDO_OPS = "000";
	/**
	 * @const ID_INEXISTENTE 0
	 *	Constante referente ao id considerado inexistente pelo banco de dados
	 */
	const ID_INEXISTENTE = 0;

	/**
	 * Construtor - Cria a classe banco dados já abrindo a conexão com o banco
	 *
	 * @example new BancoDados();
	 * @return void
	 */
	public function __construct()
	{
		$this->conectar();
	}

	/**
	 * Realiza a conexão com o banco.
	 */
	private function conectar()
	{
		$this->pdo = PDOSingleton::get();
	}

	/**
	 * Inicia uma transação no banco de dados
	 * 
	 *
	 * @name iniciarTransacao
	 * @example iniciarTransacao();
	 * @return void
	 */
	public function iniciarTransacao()
	{ //throws
		$this->pdo->beginTransaction();
	}

	/**
	 * Conclui uma transação aberta no o banco de dados
	 * 
	 *
	 * @name concluirTransacao or finalizarTransacao
	 * @example concluirTransacao(); or finalizarTransacao();
	 * @return void
	 */
	public function concluirTransacao()
	{ //throws
		$this->pdo->commit();
	}

	public function finalizarTransacao()
	{ //throws
		$this->pdo->commit();
	}

	/**
	 * Desfaz uma transação aberta no o banco de dados
	 * 
	 *
	 * @name desfazerTransacao
	 * @example desfazerTransacao();
	 * @return void
	 */
	public function desfazerTransacao()
	{ //throws
		$this->pdo->rollBack();
	}

	/**
	 * Verifica se uma transação está aberta no momento
	 * Esta função funciona apenas no PHP5 >= 5.3.3
	 * 
	 *
	 * @name emTransacao
	 * @example emTransacao();
	 * @return bool emTransacao
	 */
	public function emTransacao()
	{
		return $this->pdo->inTransaction();
	}

	/**
	 * Retorna o id do próximo dado que será salvo no banco de dados
	 * 
	 *
	 * @name gerarId
	 * @example gerarId("produto");
	 * @param string tabela
	 *	A tabela para verificar o id do próximo registro a ser salvo
	 * @return int id
	 */
	public function gerarId($tabela)
	{ //throws
		$comando = "select id from $tabela order by id desc limit 1";
		$preparado = $this->rodar($comando);
		if ($preparado->rowCount() <= 0)
			return 1;
		$vetor = $preparado->fetchAll();
		return $vetor[0]['id'] + 1;
	}

	/**
	 * Verifica se um dado já está registrado na tabela
	 * 
	 *
	 * @name existe
	 * @example existe("produto", "nome", "Suco de uva", 4, true);
	 * @param string tabela
	 *	A tabela para verificar a existência do registro
	 * @param string campo
	 *	O campo utilizado para verificação
	 * @param string informacao
	 *	A informação chave para a verificação
	 * @param int id 
	 *	A tabela para verificar a existência do registro (default to 0)
	 * @param bool verificaAtivo 
	 *	Controle de verificação da coluna de controle de exclusão de registro (default to true)
	 * @return bool
	 */
	public function existe($tabela, $campo, $informacao, $id = 0, $verificaAtivo = true)
	{ //throws
		$comando = "select $campo from $tabela where $campo = :informacao and id != :id";
		if ($verificaAtivo)
			$comando .= " and ativo = 1";
		$parametros = array(
			'informacao' => $informacao,
			'id' => $id
		);
		$preparado = $this->rodar($comando, $parametros);
		if ($preparado->rowCount() > 0)
			return true;
		return false;
	}

	/**
	 * Executa uma consulta no banco e retorna um array com os dados encontrados
	 * 
	 *
	 * @name consultar
	 * @example consultar("select * from produto where valor < :valor", array("valor" => 50.0));
	 * @param string comando
	 *	Comando SQL para a consulta
	 * @param array parametros 
	 *	Matriz de valores com a mesma quantidade de parâmetros vinculados na instrução SQL (default to array())
	 * @return array 
	 */
	public function consultar($comando, $parametros = array(), $uniqueAssociation = false)
	{ //throws
		$preparado = $this->rodar($comando, $parametros);
		if ($uniqueAssociation) {
			return $preparado->fetchAll(PDO::FETCH_ASSOC);
		}
		return $preparado->fetchAll();
	}

	/**
	 * Executa uma query no banco.
	 * 
	 *
	 * @name executar
	 * @example executar("insert into produto(nome) values (:nome)", array("nome" => "Suco de uva"));
	 * @param string comando
	 *	Comando SQL para a consulta
	 * @param array parametros 
	 *	Matriz de valores com a mesma quantidade de parâmetros vinculados na instrução SQL (default to array())
	 * @return int
	 *	Número de linhas afetadas
	 */
	public function executar($comando, $parametros = array())
	{ //throws
		$preparado = $this->rodar($comando, $parametros);
		return $preparado->rowCount();
	}

	/**
	 * Remove, por completo, um registro da tabela pelo seu id
	 * 
	 *
	 * @name excluir
	 * @example excluir("produto", 5);
	 * @param string tabela
	 *	Tabela do banco onde será realizada a exclusão
	 * @param int id
	 *	Id do registro a ser excluído
	 * @return int
	 *	Número de linhas afetadas
	 */
	public function excluir($tabela, $id)
	{ //throws
		$comando = "delete from $tabela where id = :id";
		$parametros = array(
			'id' => $id
		);
		$preparado = $this->rodar($comando, $parametros);
		return $preparado->rowCount();
	}

	/**
	 * Desativa um registro da tabela, setando o campo "ativo" como 0 (zero)
	 * 
	 *
	 * @name desativar
	 * @example desativar("produto", 5);
	 * @param string tabela
	 *	Tabela do banco onde será realizada a desativação
	 * @param int id
	 *	Id do registro a ser desativado
	 * @return int
	 *	Número de linhas afetadas
	 */
	public function desativar($tabela, $id)
	{ //throws
		$comando = "update $tabela set ativo = 0 where id = :id";
		$parametros = array(
			'id' => $id
		);
		$preparado = $this->rodar($comando, $parametros);
		return $preparado->rowCount();
	}

	/**
	 * Executa uma consulta e usa o callback para formar os objetos do tipo desejado
	 * 

	 *
	 * @name obterObjetos
	 * @example obterObjetos("select * from produto", array('ProdutoDAO', 'transformarEmObjeto'), array(), "nome", 20, 0);
	 * @param string comando
	 *	Comando SQL para a consulta
	 * @param array callback
	 *	Callback para a transformação de registros em objetos
	 * @param array parametros 
	 *	Matriz de valores com a mesma quantidade de parâmetros vinculados na instrução SQL (default to array())
	 * @param string orderBy
	 *	Campo para ordenação dos registros encontrados (default to 'id')
	 * @param string limit
	 *	Quantidade máxima de registros a serem considerados (default to null)
	 * @param string offset
	 *	Contagem dos registros a partir deste índice (default to 0)
	 * @param string completo
	 *	Envia para a transfomação a intenção de obter ou não o objeto completo (default to true)
	 * @return array unknown_type
	 *	Array de objetos - o tipo do objeto é definido pelo callback enviado
	 */
	public function obterObjetos($comando, $callback, $parametros = array(), $orderBy = 'id', $limit = null, $offset = 0, $completo = true)
	{
		if ($orderBy != '')
			$comando .= " order by $orderBy";
		if (isset($limit))
			$comando .= " limit $offset, $limit";
		$linhas = $this->consultar($comando, $parametros);
		$objetos = array();
		foreach ($linhas as $l) {
			$obj = call_user_func_array($callback, array($l, $completo));
			array_push($objetos, $obj);
		}
		return $objetos;
	}

	/**
	 * Executa uma consulta e usa o callback para formar o objeto do tipo desejado
	 * 

	 *
	 * @name obterObjeto
	 * @example obterObjeto("select * from produto where id = :id", array('ProdutoDAO', 'transformarEmObjeto'), array("id" => 5));
	 * @param string comando
	 *	Comando SQL para a consulta
	 * @param array callback
	 *	Callback para a transformação de registros em objetos
	 * @param array parametros 
	 *	Matriz de valores com a mesma quantidade de parâmetros vinculados na instrução SQL (default to array())
	 * @param string completo
	 *	Envia para a transfomação a intenção de obter ou não o objeto completo (default to true)
	 * @return unknown_type
	 *	Objeto do que é definido pelo callback enviado
	 */
	public function obterObjeto($comando, $callback, $parametros = array(), $completo = true)
	{
		$objetos = $this->obterObjetos($comando, $callback, $parametros, '', null, 0, $completo);
		if (count($objetos) < 1) {
			return null;
			//throw new NaoEncontradoException("Não foi possível localizar o registro em nosso banco de dados");
		}
		return $objetos[0];
	}

	/**
	 * Gera um teste para ser feito no MySQL com a consulta e os parâmetros desejados
	 * 

	 *
	 * @name geraTeste
	 * @example geraTeste("insert into produto(nome) values (:nome)", array("nome" => "Suco de uva"));
	 * @param string comando
	 *	Comando SQL para a consulta
	 * @param array parametros 
	 *	Matriz de valores com a mesma quantidade de parâmetros vinculados na instrução SQL (default to array())
	 * @return String
	 *	Teste para rodar no MySQL
	 */
	public function geraTeste($comando, $parametros = array())
	{
		foreach ($parametros as $key => $p) {
			$dado = $p;
			$type = gettype($p);
			switch ($type) {
				case 'string':
					if (!is_numeric($dado))
						$dado = '"' . addslashes(str_replace("\n", "\\n", str_replace("\r\n", "\\n", $dado))) . '"';
					break;
				case 'boolean': // continue
					$dado = ($dado == true) ? "1" : "0";
					break;
				case 'number': // continue
				case 'integer': // continue
				case 'float': // continue
				case 'double': // continue
				case 'NULL':
					break;
				default:
					die("Tipo de dado impróprio para comando SQL: '" . $key . "' => " . $type);
			}
			$comando = str_replace(":" . $key . ",", $dado . ",", $comando);
			$comando = str_replace(":" . $key . " ", $dado . " ", $comando);
			$comando = str_replace(":" . $key . ")", $dado . ")", $comando);
			$comando = str_replace(":" . $key . "%", $dado . "%", $comando);
		}
		return $comando;
	}

	/**
	 * Executa o comando preparado
	 * 

	 *
	 * @name rodar
	 * @example rodar("insert into produto(nome) values (:nome)", array("nome" => "Suco de uva"));
	 * @param string comando
	 *	Comando SQL para a consulta
	 * @param array parametros 
	 *	Matriz de valores com a mesma quantidade de parâmetros vinculados na instrução SQL (default to array())
	 * @return PDOStatement
	 *	O SQL preparado
	 */
	private function rodar($comando, $parametros = array())
	{ //throw
		try {
			$preparado = $this->pdo->prepare($comando);
			$preparado->execute($parametros);

			return $preparado;
		} catch (Exception $e) {

			// Caso o objeto(conexão) atual tenha sido criado para salvar um erro em uma query feita em uma outra conexão, getSalvandoErro() deveria ser true
			// Nesta situação apenas lançamos uma nova exceção para evitar um possível loop de tentativas falhas em salvar o erro na última query
			if ($this->getSalvandoErro()) {
				throw new DBException($e->getMessage());

				// Caso contrário salvamos o erro encontrado na última query no banco e retornamos uma exceção mais genérica, possivelmente evitando o 
				// vazamento de informações confidenciais do banco
			} else {

				$idInseridoOps = null;
				try {
					$mensagem = "Erro: " . $e->getMessage() . PHP_EOL . " No comando: " . PHP_EOL . $comando . PHP_EOL . " Parâmetros: " . PHP_EOL . Util::arrayParaTexto($parametros) . PHP_EOL . " Testador MySQL: " . PHP_EOL . $this->geraTeste($comando, $parametros);

					$exception = array(
						"mensagem" => $mensagem,
						"trace" => $e->getTraceAsString(),
						"arquivo" => $e->getFile()
					);

					$novaConexao = new BancoDados();
					$novaConexao->setSalvandoErro(true);
					$opsController = new OpsController($novaConexao);
					$ops = $opsController->criarOps($exception);
					$idInseridoOps = $opsController->salvar($ops);

					$novaConexao = null;
					$opsController = null;
				} catch (Exception $e) {
					throw new DBException("Houve um erro ao completar ação - " . self::ERRO_SALVANDO_OPS . " - " . $e->getMessage());
				}

				throw new DBException("Houve um erro ao completar ação - " . $idInseridoOps);
			}
		}
	}

	public function setSalvandoErro($salvandoErro)
	{
		$this->salvandoErro = $salvandoErro;
	}

	public function getSalvandoErro()
	{
		return $this->salvandoErro;
	}

	/**
	 * Obtem o último id inserido no banco
	 *
	 * @return int id o último id inserido
	 */
	public function ultimoIdInserido()
	{
		return $this->pdo->lastInsertId();
	}
}
