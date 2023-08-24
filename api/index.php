<?php 
    use Slim\Factory\AppFactory;
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;

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

        $app = AppFactory::create();

        // // Defina uma rota de teste
        // $app->get('/clientes/teste', function ($request, $response, $args) {
        //     $response->getBody()->write("Olá, Mundo!");
        //     return $response;
        // });

        // Grupo de rotas para a rota '/clientes'
        $app->group('/match-servicos/api/clientes', function ($app) {

            $app->post('/criar', function (Request $request, Response $response, $args) {

                try {
                     // Obter o corpo da requisição
                    $body = $request->getBody()->getContents();

                    // Transformar o JSON em array (caso o corpo seja JSON)
                    $data = json_decode($body, true);

                    // Cria uma instância da classe ClienteController
                    $clienteController = new ClienteController();

                    // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                    $cliente = $clienteController->salvar($data);

                    // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                    $clienteController->logar($data['email'], $data['senha']);

                    // Preparar uma resposta JSON
                    $responseData = [
                        'id' => $cliente->getId(), 
                        'nome' => $cliente->getNome()
                    ];

                    // Responder com JSON
                    $response->getBody()->write(json_encode($responseData));

                    return $response->withHeader('Content-Type', 'application/json');
                } catch (\Throwable $th) {
                    // Preparar uma resposta JSON
                    $responseData = [
                        'excecao' => $th->getMessage() 
                    ];

                    // Responder com JSON
                    $response->getBody()->write(json_encode($responseData));

                    return $response->withHeader('Content-Type', 'application/json');
                }
            });

            $app->post('/logar', function (Request $request, Response $response, $args) {
                // Obter o corpo da requisição
                $body = $request->getBody()->getContents();

                // Transformar o JSON em array (caso o corpo seja JSON)
                $data = json_decode($body, true);

                // Cria uma instância da classe ClienteController
                $clienteController = new ClienteController();

                // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                $clienteController->logar($data['email'], $data['senha']);
                $cliente = $clienteController->obterComEmail($data['email']);

                if(!$cliente instanceof Cliente){
                    throw new Exception("Cliente não encontrado.");
                }

                // Preparar uma resposta JSON
                $responseData = [
                    'id' => $cliente->getId(), 
                    'nome' => $cliente->getNome()
                ];

                // Responder com JSON
                $response->getBody()->write(json_encode($responseData));

                return $response->withHeader('Content-Type', 'application/json');
            });

            $app->post('/atualizar', function (Request $request, Response $response, $args) {
                // Obter o corpo da requisição
                $body = $request->getBody()->getContents();

                // Transformar o JSON em array (caso o corpo seja JSON)
                $data = json_decode($body, true);

                // Cria uma instância da classe ClienteController
                $clienteController = new ClienteController();


                // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                $clienteController->salvar($data);
                $cliente = $clienteController->obterComEmail($data['email']);

                if(!$cliente instanceof Cliente){
                    throw new Exception("Cliente não encontrado.");
                }

                // Preparar uma resposta JSON
                $responseData = [
                    'id' => $cliente->getId(), 
                    'nome' => $cliente->getNome()
                ];

                // Responder com JSON
                $response->getBody()->write(json_encode($responseData));

                return $response->withHeader('Content-Type', 'application/json');
            });

            // Rota para obter um cliente por ID
            $app->get('/busca', function (Request $request, Response $response, $args) {
                $params = $request->getQueryParams();

                // Cria uma instância da classe ClienteController
                $clienteController = new ClienteController();

                // Chama a função 'obterPorId' da classe ClienteController, passando o ID do cliente
                $cliente = $clienteController->obterComRestricoes($params);

                if (!$cliente instanceof Cliente) {
                    throw new Exception("Cliente não encontrado.");
                }

                // Responder com JSON
                $response->getBody()->write(json_encode(['cliente' => $cliente->jsonSerialize()]));

                return $response->withHeader('Content-Type', 'application/json');
            });

            // Rota para obter um cliente por ID
            $app->get('/obter/{id}', function (Request $request, Response $response, $args) {
                $clienteId = $args['id']; // Obtém o ID do cliente a partir dos argumentos da URL

                // Cria uma instância da classe ClienteController
                $clienteController = new ClienteController();

                // Chama a função 'obterPorId' da classe ClienteController, passando o ID do cliente
                $cliente = $clienteController->obterComId($clienteId);

                if (!$cliente instanceof Cliente) {
                    throw new Exception("Cliente não encontrado.");
                }

                // Responder com JSON
                $response->getBody()->write(json_encode(['cliente' => $cliente->jsonSerialize()]));

                return $response->withHeader('Content-Type', 'application/json');
            });
        });

        $app->group('/match-servicos/api/newsletter', function ($app) {
            $app->post('/criar', function (Request $request, Response $response, $args) {
                // Obter o corpo da requisição
                $body = $request->getBody()->getContents();

                // Transformar o JSON em array (caso o corpo seja JSON)
                $data = json_decode($body, true);

                // Cria uma instância da classe ClienteController
                $newsletterController = new NewsletterController();

                // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                $resultado = $newsletterController->salvar($data);

                // Use o resultado da função salvar como necessário
                $response->getBody()->write("Rota /newletter/criar - Resultado: " . $resultado);
                return $response;
            });
        });

        $app->group('/match-servicos/api/imagem', function ($app) {
            $app->post('/upload', function (Request $request, Response $response, $args) {
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

        $app->group('/match-servicos/api/ordemServico', function ($app) {
            $app->post('/criar', function (Request $request, Response $response, $args) {
                // Obter o corpo da requisição
                $body = $request->getBody()->getContents();

                // Transformar o JSON em array (caso o corpo seja JSON)
                $data = json_decode($body, true);

                // Cria uma instância da classe ClienteController
                $ordemServicoController = new OrdemServicoController();

                // Chama a função 'salvar' da classe ClienteController, passando os parâmetros do POST
                $resultado = $ordemServicoController->salvar($data);

                // Use o resultado da função salvar como necessário
                $response->getBody()->write("Rota /newletter/criar - Resultado: " . $resultado);
                return $response;
            });
        });


        $app->run();
    }catch (\Throwable $th) {
        Util::logException($th);
        $response->getBody()->write($th->getMessage());
        return $response;
    }
