<?php

session_start();

require '../api/vendor/autoload.php';

// Função de autoload
function my_autoloader($class_name)
{
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
    'Util' => '/util/Util.php',
    'UtilValidacoes' => '/util/UtilValidacoes.php',
    'Enum' => '/Enum.php',
    'SituacaoTributaria' => '/situacaoTributaria/SituacaoTributaria.php',
    'ImagemFactory' => '/imagem/ImagemFactory.php',
    'ImagemLocal' => '/imagem/ImagemLocal.php',
    'ImagemLocalService' => '/imagem/ImagemLocalService.php',
    'ImagemLocalController' => '/imagem/ImagemLocalController.php',
    'ImagemLocalDAO' => '/imagem/ImagemLocalDAO.php',
    'OrdemServicoDAO' => '/ordemServico/OrdemServicoDAO.php',
    'OrdemServicoController' => '/ordemServico/OrdemServicoController.php',
    'OrdemServicoService' => '/ordemServico/OrdemServicoService.php',
    'OrdemServico' => '/ordemServico/OrdemServico.php',
    'StatusOrdemServico' => '/ordemServico/StatusOrdemServico.php',
    'Endereco' => '/endereco/Endereco.php',
    'EnderecoController' => '/endereco/EnderecoController.php',
    'EnderecoService' => '/endereco/EnderecoService.php',
    'EnderecoDAO' => '/endereco/EnderecoDAO.php',
    'ControllerException' => '/exception/ControllerException.php',
    'SituacaoTributaria' => '/cliente/SituacaoTributaria.php',
    'EmailSender' => '/emailSender/PhpMailer.php'
    // Adicione outros mapeamentos de classes aqui
);
