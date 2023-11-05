import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './styles.css';
import { useNavigate } from 'react-router-dom'; // Importe o useNavigate
import InputMask from 'react-input-mask';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importe o CSS do Bootstrap
import { useAuth } from '../../contexts/Auth';
import { FaFileImport, FaCamera } from 'react-icons/fa6'

function App() {
  const [file, setFile] = useState(null);
  const [filePerfil, setFilePerfil] = useState(null);
  const [showServicosPrestados, setShowServicosPrestados] = useState(false);
  const [cliente, setCliente] = useState({});
  const [ordensDeServico, setOrdensDeServico] = useState(''); // Estado para armazenar as ordens de serviço
  const [message, setMessage] = useState('');
  const [valorOrdem, setValorOrdem] = useState('');
  const { idCliente } = useAuth();

  const [errorsImagemServico, setErrorsImagemServico] = useState('');

  const currentURL = window.location.href;
  const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileChangePerfil = (event) => {
    setFilePerfil(event.target.files[0]);
  };

  const handleSelectChange = (e) => {
    setCliente(old => ({ ...old, prestadorDeServicos: e.target.value, servicosPrestados: '' }))
  };

  const navigate = useNavigate();

  const handleSubmitImage = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', file);
    formData.append('idCliente', idCliente);

    fetch(`${apiURL}/imagem/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }

        return response.json();
      })
      .then(data => {
        if (data.excecao) {
          setErrorsImagemServico(data.excecao.split('\n'));
        } else {
          window.location.reload();
        }
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  };

  const handleSubmitImagePerfil = async () => {

    const formData = new FormData();
    formData.append('image', filePerfil);
    formData.append('idCliente', idCliente);

    await fetch(`${apiURL}/imagem/uploadPerfil`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Certifique-se de que você está vendo a resposta aqui
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  };

  const handleSubmitDados = async () => {

    await fetch(`${apiURL}/clientes/atualizar`, {
      method: 'POST',
      body: JSON.stringify({
        id: idCliente,
        nome: cliente.nome,
        email: cliente.email,
        whatsapp: cliente.whatsapp,
        genero: cliente.genero,
        servicosPrestados: cliente.servicosPrestados,
        prestadorDeServicos: cliente.prestadorDeServicos
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Certifique-se de que você está vendo a resposta aqui
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  };

  useEffect(() => {

    fetch(`${apiURL}/clientes/obter/${idCliente}`, {
      method: 'GET', // ou 'GET', 'PUT', 'DELETE', etc., dependendo do tipo de requisição que você deseja fazer
      headers: {
        'Content-Type': 'application/json',
        // Aqui você pode adicionar quaisquer outros cabeçalhos necessários
      }
    })
      .then(response => response.json())
      .then(data => {
        setCliente(data.cliente); // Não é necessário usar JSON.stringify aqui
        setShowServicosPrestados(data.cliente.prestadorDeServicos);

        // Se o usuário for um prestador de serviços, carrega as ordens de serviço
        if (data.cliente.prestadorDeServicos) {
          fetchOrdensDeServico();
        }
      })
      .catch(error => {
        navigate('/'); // Use navigate('/') para redirecionar para a página inicial
      });

  }, [idCliente]);

  // Função para buscar ordens de serviço da API
  const fetchOrdensDeServico = async () => {

    try {
      const response = await fetch(`${apiURL}/ordemServico/obterPorTrabalhador/${idCliente}`);
      const data = await response.json();
      setOrdensDeServico(data.ordens);
    } catch (error) {
      console.error('Erro ao obter as ordens de serviço:', error);
    }
  };

  const handleStatusChange = async (ordemId, novoStatus) => {
    // Salvar o status atual em uma variável temporária
    const statusAnterior = ordensDeServico.find(ordem => ordem.id === ordemId).status;

    try {
      // Configurar os dados a serem enviados no corpo da solicitação
      const data = {
        ordemId: ordemId,
        novoStatus: novoStatus,
        valor: novoStatus === '2' ? valorOrdem : null,
      };

      // Configurar as opções da solicitação
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      // Enviar a solicitação para a URL de modificação
      const response = await fetch(`${apiURL}/ordemServico/modificarStatus`, requestOptions);

      // Verificar se a solicitação foi bem-sucedida (código de resposta 200)
      if (response.ok) {
        const updatedOrdensDeServico = ordensDeServico.map(ordem => {
          if (ordem.id === ordemId) {
            return { ...ordem, status: novoStatus };
          }
          return ordem;
        });
        setOrdensDeServico(updatedOrdensDeServico);

        // Definir a mensagem de sucesso
        setMessage('Status atualizado com sucesso');

        // Limpar a mensagem de erro após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        // A solicitação falhou, você pode tratar erros aqui
        // Reverter para o status anterior na interface do usuário
        // Atualizar o estado local com o status anterior
        const updatedOrdensDeServico = ordensDeServico.map(ordem => {
          if (ordem.id === ordemId) {
            return { ...ordem, status: statusAnterior };
          }
          return ordem;
        });
        setOrdensDeServico(updatedOrdensDeServico);

        // Definir a mensagem de erro
        setMessage('Falha ao atualizar o status');

        // Limpar a mensagem de erro após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      // Reverter para o status anterior na interface do usuário
      // Atualizar o estado local com o status anterior
      const updatedOrdensDeServico = ordensDeServico.map(ordem => {
        if (ordem.id === ordemId) {
          return { ...ordem, status: statusAnterior };
        }
        return ordem;
      });
      setOrdensDeServico(updatedOrdensDeServico);

      // Definir a mensagem de erro em caso de erro na solicitação
      setMessage('Erro ao atualizar o status: ' + error.message);

      // Limpar a mensagem de erro após 3 segundos (3000 milissegundos)
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const enviarValorParaAPI = async (ordemId, valor) => {
    try {
      const formData = new FormData();
      formData.append('ordemId', ordemId);
      formData.append('valor', valor);

      fetch(`${apiURL}/ordemServico/atualizarValor`, {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro na requisição');
          }

          return response.json();
        })
        .then(data => {
          // Definir a mensagem de erro em caso de erro na solicitação
          setMessage('Sucesso ao enviar valor da ordem de serviço');

          // Limpar a mensagem de erro após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessage('');
          }, 3000);
        })
        .catch(error => {
          // Definir a mensagem de erro em caso de erro na solicitação
          setMessage('Erro ao enviar valor da ordem de serviço: ' + error.message);

          // Limpar a mensagem de erro após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessage('');
          }, 3000);
        });
    } catch (error) {
      // Definir a mensagem de erro em caso de erro na solicitação
      setMessage('Erro ao enviar valor da ordem de serviço: ' + error.message);

      // Limpar a mensagem de erro após 3 segundos (3000 milissegundos)
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="minha-conta-container">
      <article id="articleMinhaContaPage">
        <h1>Minha Conta</h1>
        {cliente.imagemPerfil && cliente.imagemPerfil.length > 0 && (
          <div className="container-images-minha-conta text-center">
            {cliente.imagemPerfil.map((imagem, index) => (
              <div key={index} className="ball-image mx-auto">
                <img
                  src={`${apiURL}/imagem/ler/${imagem.nomeArquivo}`}
                  alt={`Imagem ${index}`}
                  className="rounded-circle ball-image-inner"
                />
              </div>
            ))}
          </div>
        )}

        <Tabs>
          <TabList>
            <Tab>Editar Dados</Tab>
            <Tab>Enviar Imagem Perfil</Tab>
            {cliente.prestadorDeServicos && <Tab>Enviar Fotos</Tab>}
            {cliente.prestadorDeServicos && <Tab>Ordens de Serviço</Tab>}
          </TabList>

          <TabPanel>
            <h2>Editar Dados</h2>
            <form className='editar-dados-form' onSubmit={handleSubmitDados}>
              <div className="col-md-12 mb-3">
                <label htmlFor="nome" className="form-label">Nome:</label>
                <input type="text" className="form-control" id="nome" value={cliente.nome}
                  onChange={
                    (e) => setCliente((old) => ({ ...old, nome: e.target.value }))
                  } />
              </div>
              <div className="col-md-12 mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" className="form-control" id="email"
                  value={cliente.email}
                  onChange={(e) => setCliente((old) => ({ ...old, email: e.target.value }))} />
              </div>

              <div className="col-md-12 mb-3">
                <label htmlFor="prestadorDeServicos" className="form-label">Prestador de Serviços:</label>
                <select
                  className="form-select"
                  id="prestadorDeServicos"
                  value={cliente.prestadorDeServicos}
                  onChange={handleSelectChange}
                >
                  <option value="">Selecione</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>

              {showServicosPrestados && (
                <div className="col-md-12 mb-3">
                  <label htmlFor="servicosPrestados" className="form-label">Serviços Prestados:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="servicosPrestados"
                    placeholder="Digite os serviços prestados separados por vírgula (pedreiro, eletricista, etc)"
                    value={cliente.servicosPrestados}
                    onChange={(e) => setCliente((old) => ({ ...old, servicosPrestados: e.target.value }))}
                  />
                </div>
              )}

              <div className="col-md-12 mb-3">
                <label htmlFor="whatsapp" className="form-label">WhatsApp:</label>
                <InputMask
                  mask="(99) 99999-9999" // Máscara para número de telefone do WhatsApp
                  type="tel"
                  className="form-control"
                  id="whatsapp"
                  placeholder="(XX) XXXXX-XXXX" // Opcional: forneça um placeholder com o formato desejado
                  value={cliente.whatsapp}
                  onChange={(e) => setCliente((old) => ({ ...old, whatsapp: e.target.value }))}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label htmlFor="genero" className="form-label">Gênero:</label>
                <select className="form-select" id="genero"
                  value={cliente.genero}
                  onChange={(e) => setCliente((old) => ({ ...old, genero: e.target.value }))}>
                  <option value="">Selecione</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                </select>
              </div>

              {cliente.endereco && cliente.endereco.length > 0 && (
                <>
                  <div className="col-md-12 mb-3">
                    <label htmlFor="cep" className="form-label">CEP:</label>
                    <InputMask
                      mask="99999-999"
                      maskPlaceholder=""
                      type="text"
                      className="form-control"
                      id="cep"
                      value={cliente.endereco[0].cep}
                      disabled
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label htmlFor="endereco" className="form-label">Endereço:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="endereco"
                      value={cliente.endereco[0].rua}
                      disabled
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label htmlFor="numero" className="form-label">Número:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="numero"
                      value={cliente.endereco[0].numero}
                      disabled
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label htmlFor="complemento" className="form-label">Complemento:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="complemento"
                      value={cliente.endereco[0].complemento}
                      disabled
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label htmlFor="bairro" className="form-label">Bairro:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="bairro"
                      value={cliente.endereco[0].bairro}
                      disabled
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label htmlFor="localidade" className="form-label">Cidade:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="localidade"
                      value={cliente.endereco[0].cidade}
                      disabled
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label htmlFor="uf" className="form-label">UF:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="uf"
                      value={cliente.endereco[0].estado}
                      disabled
                    />
                  </div>
                </>
              )}

              <button className='btn btn-success submit-button' type="submit">Salvar</button>
            </form>
          </TabPanel>

          <TabPanel>
            <h2>Enviar Imagem Perfil</h2>
            <form className='form-enviar-fotos' onSubmit={handleSubmitImagePerfil}>
              <label className='input-file'>
                <div className='icon-container'>
                  <FaCamera size={24} />
                  Selecione imagem
                </div>
                <input type="file" onChange={handleFileChangePerfil} accept="image/jpg, image/png, image/gif, image/jpeg" />
                <span>
                  {filePerfil?.name}
                </span>
              </label>
              <button className='btn btn-success submit-button' type="submit">Enviar</button>
            </form>
          </TabPanel>

          <TabPanel>
            <h2>Enviar Fotos/Vídeos</h2>
            {errorsImagemServico.length > 0 && (
              <div className="alert alert-danger mt-3">
                {errorsImagemServico.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
            <form className='form-enviar-fotos' onSubmit={handleSubmitImage}>
              <label className='input-file'>
                <div className='icon-container'>
                  <FaFileImport size={24} />
                  Selecione o arquivo
                </div>
                <input type="file" onChange={handleFileChange} accept="image/jpg, image/png, image/gif, image/jpeg" />
                <span>
                  {file?.name}
                </span>
              </label>
              <button className='btn btn-success submit-button' type="submit">Enviar</button>
            </form>

            {cliente.imagem && cliente.imagem.length > 0 && (
              <section className='enviar-fotos-section'>
                {cliente.imagem.map((imagem, index) => (
                  <div key={index} className="rounded-image-minha-conta">
                    <img
                      src={`${apiURL}/imagem/ler/${imagem.nomeArquivo}`}
                      alt={`Descrição da imagem ${index + 1}`}
                      key={index}
                    />
                  </div>
                ))}
              </section>
            )}
          </TabPanel>

          <TabPanel>
            <h2>Ordens de Serviço</h2>
            <div className="container">
              <div className="row">
                {ordensDeServico && ordensDeServico.map((ordem, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">ID da Ordem: {ordem.id}</h5>
                        {ordem.solicitante ? (
                          <p className="card-text">Solicitante: {ordem.solicitante}</p>
                        ) : (
                          <p className="card-text">Solicitante não informado</p>
                        )}
                        <p className="card-text">Data Criação: {ordem.dataCriacao}</p>
                        <p className="card-text">Valor: {ordem.valor}</p>
                        <div className="form-group">
                          <label>Status:</label>
                          <select
                            className="form-control form-select"
                            value={ordem.status}
                            onChange={(e) => handleStatusChange(ordem.id, e.target.value)}
                          >
                            <option value="0">Em Aberto</option>
                            <option value="1">Em Andamento</option>
                            <option value="2">Concluído</option>
                            <option value="3">Cancelado</option>
                          </select>
                        </div>

                        {ordem.status == 2 && ( ordem.valor <= 0 || ordem.valor == null ) && (
                          <div className="mb-3">
                            <label>Valor:</label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={valorOrdem}
                                onChange={(e) => setValorOrdem(e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => enviarValorParaAPI(ordem.id, valorOrdem)}
                              >
                                Enviar
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Renderizar a mensagem de erro ou sucesso */}
                        <div className="message">
                          {message && <div className={message.startsWith('Erro') ? 'alert alert-danger' : 'alert alert-success'}>{message}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </article>

    </div>
  );
}

export default App;
