<?php
    session_start();

    // Função de autoload
    function my_autoloader($class_name) {
        global $class_map;

        // Verifica se a classe está no array de mapeamento
        if (isset($class_map[$class_name])) {
            // Obtém o caminho do arquivo a partir do mapeamento
            $file_path = __DIR__ . '/php/classes' . $class_map[$class_name];

            // Carrega o arquivo se ele existir
            if (file_exists($file_path)) {
                require_once $file_path;
            }
        }
    }
    // Registrar a função de autoload
    spl_autoload_register('my_autoloader');

    $class_map = array(
        'ClienteController' => '/cliente/ClienteController.php',
        'ClienteService' => '/cliente/ClienteService.php',
        'ClienteDAO' => '/cliente/ClienteDAO.php',
        'Cliente' => '/cliente/Cliente.php',
        'DadosClienteFisico' => '/cliente/DadosClienteFisico.php',
        'DadosClienteJuridico' => '/cliente/DadosClienteJuridico.php',
        'DBException' => '/exception/DBException.php',
        'NewsletterController' => '/newsletter/NewsletterController.php',
        'Newsletter' => '/newsletter/Newsletter.php',
        'NewsletterService' => '/newsletter/NewsletterService.php',
        'NewsletterDAO' => '/newsletter/NewsletterDAO.php',
        'BancoDados' => '/singleton/BancoDados.php',
        'PDOSingleton' => '/singleton/PDOSingleton.php',
        'BDSingleton' => '/singleton/BDSingleton.php',
        'Ops' => '/ops/Ops.php',
        'OpsController' => '/ops/OpsController.php',
        'OpsService' => '/ops/OpsService.php',
        'OpsDAO' => '/ops/OpsDAO.php',

        // Adicione outros mapeamentos de classes aqui
    );
?>