<?php

if (strpos($_SERVER['HTTP_REFERER'], 'localhost') !== false) {
    require_once __DIR__ . '/../../../config.php';
} else {
    require_once($_SERVER['DOCUMENT_ROOT']."/config.php");
}

class ClienteController
{
    private $service = null;

    public function __construct(BancoDados $conexao = null)
    {
        if (isset($conexao))
            $bancoDados = $conexao;
        else
            $bancoDados = BDSingleton::get();

        $clienteDAO = new ClienteDAO($bancoDados);
        $this->service = new ClienteService($clienteDAO);
    }

    public function salvar($dados, $ehAtualizar = false)
    {
        $erro = array();

        $cliente = new Cliente();

        if (isset($dados['id'])) {
            $cliente->setId($dados['id']);
        }

        if (isset($dados['nome'])) {
            $cliente->setNome($dados['nome']);
        }

        if (isset($dados['email'])) {
            $cliente->setEmail($dados['email']);
        }

        if (isset($dados['whatsapp'])) {
            $cliente->setWhatsapp($dados['whatsapp']);
        }

        if (isset($dados['genero'])) {
            $cliente->setGenero($dados['genero']);
        }

        if (isset($dados['senha'])) {
            $cliente->setSenha($dados['senha']);
        }

        if(!$ehAtualizar){
            if (!empty($dados['documento']) && !empty($dados['dataNascimento'])) {
                $dadosClienteFisico = new DadosClienteFisico();
                $dadosClienteFisico->setCpf($dados['documento']);
                $dadosClienteFisico->setDataNascimento($dados['dataNascimento']);
                $dataNascimento = $dados['dataNascimento'];
                $idade = date_diff(new DateTime(), new DateTime($dataNascimento));
                $idade = $idade->format('%Y');

                $dadosClienteFisico->setIdade($idade);

                $cliente->setDadosEspecificos($dadosClienteFisico);
            } elseif (!empty($dados['documento']) && !empty($dados['razaoSocial'])) {
                $dadosClienteJuridico = new DadosClienteJuridico();
                $dadosClienteJuridico->setCnpj($dados['documento']);
                $dadosClienteJuridico->setInscricaoEstadual($dados['inscricaoEstadual']);
                $dadosClienteJuridico->setRazaoSocial($dados['razaoSocial']);
                $dadosClienteJuridico->setSituacaoTributaria(SituacaoTributaria::stringToEnum($dados['situacaoTributaria']));
                $cliente->setDadosEspecificos($dadosClienteJuridico);
            }
        }

        if (isset($dados['ehPrestadorDeServicos']) && $dados['ehPrestadorDeServicos'] == true) {
            $cliente->setPrestadorDeServicos(true);
            if (isset($dados['servicosPrestados'])) {
                $cliente->setServicosPrestados($dados['servicosPrestados']);
            }
        }

        if (isset($dados['cep'])) {
            $endereco = new Endereco();

            $endereco->setCEP($dados['cep']);

            if (isset($dados['rua'])) {
                $endereco->setRua($dados['rua']);
            }

            if (isset($dados['complemento'])) {
                $endereco->setComplemento($dados['complemento']);
            }

            if (isset($dados['cidade'])) {
                $endereco->setCidade($dados['cidade']);
            }

            if (isset($dados['bairro'])) {
                $endereco->setBairro($dados['bairro']);
            }

            if (isset($dados['estado'])) {
                $endereco->setEstado($dados['estado']);
            }

            if (isset($dados['numero'])) {
                $endereco->setNumero($dados['numero']);
            }

            $cliente->setEndereco($endereco);
        }

        return $this->service->salvar($cliente, $erro);
    }

    public function logar($email, $senha)
    {
        $this->service->logar($email, $senha);
    }

    public function deslogar()
    {
        $this->service->deslogar();
    }

    public function obterComEmail($email)
    {
        return $this->service->obterComEmail($email);
    }

    public function obterComId($id, $completo = true)
    {
        return $this->service->obterComId($id, $completo);
    }

    public function obterComRestricoes($parametros)
    {
        $restricoes = array();

        if (isset($parametros['q']) && $parametros['q'] != 'null') {
            $restricoes['profissao'] = $parametros['q'];
        }

        if (isset($parametros['prestadorServicos'])) {
            $restricoes['prestadorServicos'] = $parametros['prestadorServicos'];
        }

        if (isset($parametros['obterParaCarrossel'])) {
            $restricoes['obterParaCarrossel'] = $parametros['obterParaCarrossel'];
        }

        if (isset($parametros['idade']) && $parametros['idade'] > 18) {
            $restricoes['idade'] = $parametros['idade'];
        }

        if (isset($parametros['profissaoEspecifica'])) {
            $restricoes['profissaoEspecifica'] = $parametros['profissaoEspecifica'];
        }

        if (isset($parametros['estado'])) {
            $restricoes['estado'] = $parametros['estado'];
        }

        if (isset($parametros['cidade'])) {
            $restricoes['cidade'] = $parametros['cidade'];
        }

        return $this->service->obterComRestricoes($restricoes);
    }
}
