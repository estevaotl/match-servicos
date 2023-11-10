<?php

if (strpos($_SERVER['HTTP_REFERER'], 'localhost') !== false) {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
}

header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    header("HTTP/1.1 200 OK");
    die();
}

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Incluindo o arquivo de configuração
require_once "./config.php";

try {

    $app = AppFactory::create();

    // // Defina uma rota de teste
    // $app->get('/clientes/teste', function ($request, $response, $args) {
    //     $response->getBody()->write("Olá, Mundo!");
    //     return $response;
    // });

    $apiInicial = "";
    if (strpos($_SERVER['HTTP_REFERER'], 'localhost') !== false) {
        $apiInicial = "/match-servicos/api";
    }

    // Grupo de rotas para a rota '/clientes'
    $app->group($apiInicial . '/clientes', function ($app) {

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

                $clienteController->logar($data['email'], $data['senha']);

                // Preparar uma resposta JSON
                $responseData = [
                    'id' => $cliente->getId(),
                    'nome' => $cliente->getNome(),
                    'ehPrestadorServicos' => $cliente->getPrestadorDeServicos(),
                    'cidade' => $cliente->getEndereco() instanceof Endereco ? $cliente->getEndereco()->getCidade() : '',
                    'estado' => $cliente->getEndereco() instanceof Endereco ? $cliente->getEndereco()->getEstado() : ''
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
            try {
                // Obter o corpo da requisição
                $body = $request->getBody()->getContents();

                // Transformar o JSON em array (caso o corpo seja JSON)
                $data = json_decode($body, true);

                // Cria uma instância da classe ClienteController
                $clienteController = new ClienteController();

                $clienteController->logar($data['email'], $data['senha']);
                $cliente = $clienteController->obterComEmail($data['email']);

                if (!$cliente instanceof Cliente) {
                    throw new Exception("Cliente não encontrado.");
                }

                // Preparar uma resposta JSON
                $responseData = [
                    'id' => $cliente->getId(),
                    'nome' => $cliente->getNome(),
                    'ehPrestadorServicos' => $cliente->getPrestadorDeServicos(),
                    'cidade' => count($cliente->getEndereco()) > 0 ? $cliente->getEndereco()[0]['cidade'] : array(),
                    'estado' => count($cliente->getEndereco()) > 0 ? $cliente->getEndereco()[0]['estado'] : array()
                ];

                // Responder com JSON
                $response->getBody()->write(json_encode($responseData));

                return $response->withHeader('Content-Type', 'application/json');
            } catch (\Throwable $th) {
                Util::logException($th);
                // Preparar uma resposta JSON
                $responseData = [
                    'excecao' => $th->getMessage()
                ];

                // Responder com JSON
                $response->getBody()->write(json_encode($responseData));

                return $response->withHeader('Content-Type', 'application/json');
            }
        });

        $app->post('/atualizar', function (Request $request, Response $response, $args) {
            try {
                $body = $request->getBody()->getContents();

                $data = json_decode($body, true);

                $clienteController = new ClienteController();

                $clienteController->salvar($data, true);
                $cliente = $clienteController->obterComEmail($data['email']);

                if (!$cliente instanceof Cliente) {
                    throw new Exception("Cliente não encontrado.");
                }

                $responseData = [
                    'id' => $cliente->getId(),
                    'nome' => $cliente->getNome(),
                    'ehPrestadorServicos' => $cliente->getPrestadorDeServicos(),
                    'cidade' => count($cliente->getEndereco()) > 0 ? $cliente->getEndereco()[0]['cidade'] : array(),
                    'estado' => count($cliente->getEndereco()) > 0 ? $cliente->getEndereco()[0]['estado'] : array()
                ];

                $response->getBody()->write(json_encode($responseData));

                return $response->withHeader('Content-Type', 'application/json');
            } catch (\Throwable $th) {
                Util::logException($th);
                // Preparar uma resposta JSON
                $responseData = [
                    'excecao' => $th->getMessage()
                ];

                // Responder com JSON
                $response->getBody()->write(json_encode($responseData));

                return $response->withHeader('Content-Type', 'application/json');
            }
        });

        $app->get('/busca', function (Request $request, Response $response, $args) {
            $params = $request->getQueryParams();

            // Cria uma instância da classe ClienteController
            $clienteController = new ClienteController();

            $clientes = $clienteController->obterComRestricoes($params);

            $arrayClientes = array();
            if (count($clientes) > 0) {
                foreach ($clientes as $cliente) {
                    if (!$cliente instanceof Cliente) {
                        continue;
                    }

                    $arrayClientes[] = $cliente->jsonSerialize();
                }
            } else {
                throw new Exception("Clientes não encontrados.");
            }

            // Responder com JSON
            $response->getBody()->write(json_encode(['cliente' => $arrayClientes]));

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

        $app->get('/obterParaCarrossel', function (Request $request, Response $response, $args) {
            $params = array(
                "prestadorServicos"  => true,
                "obterParaCarrossel" => true
            );

            $clienteController = new ClienteController();

            $clientes = $clienteController->obterComRestricoes($params, 9);

            $arrayClientes = array();
            if (count($clientes) > 0) {
                foreach ($clientes as $cliente) {
                    if (!$cliente instanceof Cliente) {
                        continue;
                    }

                    $arrayClientes[] = $cliente->jsonSerialize();
                }
            } else {
                throw new Exception("Clientes não encontrados.");
            }

            // Responder com JSON
            $response->getBody()->write(json_encode(['cliente' => $arrayClientes]));

            return $response->withHeader('Content-Type', 'application/json');
        });
    });

    $app->group($apiInicial . '/newsletter', function ($app) {
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

    $app->group($apiInicial . '/imagem', function ($app) {
        $app->post('/upload', function (Request $request, Response $response, $args) {
            try {
                $uploadedFile = $request->getUploadedFiles()['image'];

                $params = $request->getParsedBody(); // Retorna um array com os dados do POST

                ImagemFactory::saveImage($uploadedFile, $params['idCliente']);

                $responseData = [
                    'resposta' => 'Imagem criada'
                ];

                // Responder com JSON
                $response->getBody()->write(json_encode($responseData));

                return $response->withHeader('Content-Type', 'application/json');
            } catch (\Throwable $th) {
                $responseData = [
                    'excecao' => $th->getMessage()
                ];

                // Responder com JSON
                $response->getBody()->write(json_encode($responseData));

                return $response->withHeader('Content-Type', 'application/json');
            }
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

        $app->post('/uploadPerfil', function (Request $request, Response $response, $args) {
            try {
                $uploadedFile = $request->getUploadedFiles()['image'];

                $params = $request->getParsedBody();

                ImagemFactory::saveImage($uploadedFile, $params['idCliente'], true);

                $response->getBody()->write("Imagem criada.");
                return $response;
            } catch (\Throwable $th) {
                $responseData = [
                    'excecao' => $th->getMessage()
                ];

                // Responder com JSON
                $response->getBody()->write(json_encode($responseData));

                return $response->withHeader('Content-Type', 'application/json');
            }
        });
    });

    $app->group($apiInicial . '/ordemServico', function ($app) {
        $app->post('/criar', function (Request $request, Response $response, $args) {
            try {
                // Obter o corpo da requisição
                $body = $request->getBody()->getContents();

                // Transformar o JSON em array (caso o corpo seja JSON)
                $data = json_decode($body, true);

                $ordemServicoController = new OrdemServicoController();

                $resultado = $ordemServicoController->salvar($data);

                // Use o resultado da função salvar como necessário
                $response->getBody()->write("Ordem de Serviço criada.");
                return $response;
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

        $app->get('/obter/{id}', function (Request $request, Response $response, $args) {
            $idOS = $args['id']; // Obtém o ID do cliente a partir dos argumentos da URL

            $ordemServicoController = new OrdemServicoController();

            $ordemServico = $ordemServicoController->obterComId($idOS);

            // Responder com JSON
            $response->getBody()->write(json_encode(['ordens' => $ordemServico]));

            return $response->withHeader('Content-Type', 'application/json');
        });

        // Rota para ordem de serviço pelo id do trabalhador
        $app->get('/obterPorTrabalhador/{id}', function (Request $request, Response $response, $args) {
            $idTrabalhador = $args['id']; // Obtém o ID do cliente a partir dos argumentos da URL

            $ordemServicoController = new OrdemServicoController();

            $ordemServico = $ordemServicoController->obterOrdensServicoIdTrabalhador($idTrabalhador);

            // Responder com JSON
            $response->getBody()->write(json_encode(['ordens' => $ordemServico]));

            return $response->withHeader('Content-Type', 'application/json');
        });

        // Rota para ordem de serviço pelo id do solicitante
        $app->get('/obterPorSolicitante/{id}', function (Request $request, Response $response, $args) {
            $idTrabalhador = $args['id'];

            $ordemServicoController = new OrdemServicoController();

            $ordemServico = $ordemServicoController->obterOrdensServicoIdSolicitante($idTrabalhador);

            $response->getBody()->write(json_encode(['ordens' => $ordemServico]));

            return $response->withHeader('Content-Type', 'application/json');
        });

        $app->post('/modificarStatus', function (Request $request, Response $response, $args) {
            try {
                $body = $request->getBody()->getContents();

                $data = json_decode($body, true);

                $ordemServicoController = new OrdemServicoController();

                $ordemServico = $ordemServicoController->modificarStatus($data['ordemId'], $data['novoStatus']);

                $responseData = [
                    'id' => $data['ordemId'],
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

        $app->post('/atualizarValor', function (Request $request, Response $response, $args) {
            try{
                // Obter o corpo da requisição
                $params = $request->getParsedBody();

                $ordemServicoController = new OrdemServicoController();

                $resultado = $ordemServicoController->atualizarValor($params['ordemId'], $params['valor']);

                $responseData = [
                    'resposta' => $resultado
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
    });

    $app->group($apiInicial . '/contato', function ($app) {
        $app->post('/enviar', function (Request $request, Response $response, $args) {
            try{
                $body = $request->getBody()->getContents();
                $data = json_decode($body, true);

                $resultado = (new EmailSender())->enviarEmail("estevaotlnf@gmail.com", "Duvida vinda do site do cliente " . $data['name'], $data['message']);

                $responseData = [
                    'resposta' => $resultado
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
    });
} catch (\Throwable $th) {
    Util::logException($th);
    $response->getBody()->write($th->getMessage());
    return $response;
}

$app->run();
