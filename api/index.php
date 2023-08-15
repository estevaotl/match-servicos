<?php 
    // Incluindo o arquivo de configuração
    require_once __DIR__ . '/config.php';

    try {
        // Configuração do CORS
        header('Access-Control-Allow-Origin: *'); 
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

        require __DIR__ . '/vendor/autoload.php';

        // Cria a instância do Slim App
        $app = new \Slim\App(array());

        // // Defina uma rota de teste
        // $app->get('/clientes/teste', function ($request, $response, $args) {
        //     $response->getBody()->write("Olá, Mundo!");
        //     return $response;
        // });

        // Grupo de rotas para a rota '/clientes'
        $app->group('/clientes', function ($app) {

            $app->post('/criar', function ($request, $response, $args) {

                $params = $request->getParsedBody(); // Retorna um array com os dados do POST

                // Cria uma instância da classe ClienteController
                $clienteController = new ClienteController();

                // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                $cliente = $clienteController->salvar($params);

                // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                $clienteController->logar($params['email'], $params['senha']);

                return $response->withJson(['cliente' => ['id' => $cliente->getId(), 'nome' => $cliente->getNome()]]);
            });

            $app->post('/logar', function ($request, $response, $args) {
                $params = $request->getParsedBody(); // Retorna um array com os dados do POST

                // Cria uma instância da classe ClienteController
                $clienteController = new ClienteController();

                // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                $clienteController->logar($params['email'], $params['senha']);
                $cliente = $clienteController->obterComEmail($params['email']);

                if(!$cliente instanceof Cliente){
                    throw new Exception("Cliente não encontrado.");
                }

                return $response->withJson(['cliente' => ['id' => $cliente->getId(), 'nome' => $cliente->getNome()]]);
            });

            // Rota para obter um cliente por ID
            $app->get('/obter/{id}', function ($request, $response, $args) {
                $clienteId = $args['id']; // Obtém o ID do cliente a partir dos argumentos da URL

                // Cria uma instância da classe ClienteController
                $clienteController = new ClienteController();

                // Chama a função 'obterPorId' da classe ClienteController, passando o ID do cliente
                $cliente = $clienteController->obterComId($clienteId);

                if (!$cliente instanceof Cliente) {
                    throw new Exception("Cliente não encontrado.");
                }

                return $response->withJson(['cliente' => $cliente->jsonSerialize()]);
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

        $app->group('/imagem', function ($app) {
            $app->post('/upload', function ($request, $response) {
                $uploadedFile = $request->getUploadedFiles()['image'];
                $params = $request->getParsedBody(); // Retorna um array com os dados do POST

                $fileName = ImagemFactory::saveImage($uploadedFile, $params['idCliente']);
            });

            $app->get('/ler/{nomeArquivo}', function ($request, $response, $args) {
                $nomeArquivo = $args['nomeArquivo'];
                $caminhoImagem = __DIR__ . '/public/dinamica/' . $nomeArquivo;

                if (file_exists($caminhoImagem)) {
                    $image = file_get_contents($caminhoImagem);
                    $response->getBody()->write($image);
                    return $response->withHeader('Content-Type', 'image/jpeg'); // ou o tipo de imagem apropriado
                } else {
                    return $response->withStatus(404); // Retorne um erro, se a imagem não existir
                }
            });
        });

        $app->run();
    }catch (\Throwable $th) {
        Util::logException($th);
        $response->getBody()->write($th->getMessage());
        return $response;
    }
