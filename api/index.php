<?php
    try {
        // Define os headers para permitir o acesso através de CORS
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");

        require __DIR__ . '/vendor/autoload.php';
        require_once __DIR__ . '/php/classes/util/Util.php';

        // Incluindo o arquivo de configuração
        require_once 'config.php';

        // Cria a instância do Slim App
        $app = new \Slim\App();

        // Defina uma rota de teste
        $app->get('/', function ($request, $response, $args) {
            $response->getBody()->write("Olá, Mundo!");
            return $response;
        });

        // Grupo de rotas para a rota '/clientes'
        $app->group('/clientes', function ($app) {

            $app->get('/', function ($request, $response, $args) {
                $response->getBody()->write("Rota /clientes");
                return $response;
            });

            $app->post('/criar', function ($request, $response, $args) {

                $params = $request->getParsedBody(); // Retorna um array com os dados do POST

                // Cria uma instância da classe ClienteController
                $clienteController = new ClienteController();

                // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                $resultado = $clienteController->salvar($params);

                // Use o resultado da função salvar como necessário
                $response->getBody()->write("Rota /clientes/criar - Resultado: " . $resultado);
                return $response;
            });
        });

        $app->group('/newsletter', function ($app) {
            $app->post('/criar', function ($request, $response, $args) {
                $params = $request->getParsedBody(); // Retorna um array com os dados do POST

                // Cria uma instância da classe ClienteController
                $newsletterController = new NewsletterController();

                // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                $resultado = $newsletterController->salvar($params);

                // Use o resultado da função salvar como necessário
                $response->getBody()->write("Rota /newletter/criar - Resultado: " . $resultado);
                return $response;
            });
        });

        $app->run();
    }catch (\Throwable $th) {
        $response->getBody()->write($th->getMessage());
        return $response;
    }
