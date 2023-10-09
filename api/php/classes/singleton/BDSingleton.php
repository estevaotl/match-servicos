<?php

require_once __DIR__ . '/../../../config.php';

class BDSingleton
{
	private static $bancoDados = null;

	private function __construct()
	{
	} // Privado para não ser possível instanciar a classe

	// Só instancia uma vez
	public static function get()
	{
		if (null == self::$bancoDados) {
			self::$bancoDados = new BancoDados();
		}

		return self::$bancoDados;
	}

	/**
	 * Útil caso a conexão fique sem ser utilizada por longos períodos de tempo e o mysql retorne timeout
	 */
	public static function close()
	{
		self::$bancoDados = null;
	}
}
