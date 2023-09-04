import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../css/minha-conta-page.css';
import FooterPage from '../componentes/FooterPage';
import logo from '../imagens/logo.png'; // Importe o caminho da imagem corretamente
import { Link, useNavigate } from 'react-router-dom'; // Importe o useNavigate
import CardPrestadorServicos from '../componentes/CardPrestadorServicos'; // Caminho relativo para o arquivo Card.js

function App() {
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [genero, setGenero] = useState('');
    const [prestadorDeServicos, setPrestadorDeServicos] = useState('');
    const [showServicosPrestados, setShowServicosPrestados] = useState(false);
    const [servicosPrestados, setServicosPrestados] = useState(false);
    const [cliente, setCliente] = useState('');
    const [ordensDeServico, setOrdensDeServico] = useState(''); // Estado para armazenar as ordens de serviço

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSelectChange = (e) => {
        setPrestadorDeServicos(e.target.value);
        setServicosPrestados(""); // Reinicia os serviços prestados ao trocar a opção
    };

    const navigate = useNavigate();

    const handleSubmitImage = async () => {
        const idCliente = sessionStorage.getItem('idCliente');

        const formData = new FormData();
        formData.append('image', file);
        formData.append('idCliente', idCliente);

        fetch('http://localhost/match-servicos/api/imagem/upload', {
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
        const idCliente = sessionStorage.getItem('idCliente');

        fetch('http://localhost/match-servicos/api/clientes/atualizar', {
            method: 'POST',
            body: JSON.stringify({
                id: idCliente,
                nome: (nome ? nome : cliente.nome),
                email: (email ? email : cliente.email),
                whatsapp: (whatsapp ? whatsapp : cliente.whatsapp),
                genero: (genero ? genero : cliente.genero),
                servicosPrestados: (servicosPrestados ? servicosPrestados : cliente.servicosPrestados),
                prestadorDeServicos: (prestadorDeServicos ? prestadorDeServicos : cliente.prestadorDeServicos)
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
        const idCliente = sessionStorage.getItem('idCliente');

        fetch(`http://localhost/match-servicos/api/clientes/obter/${idCliente}`, {
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
    }, []);

    // Função para buscar ordens de serviço da API
    const fetchOrdensDeServico = async () => {
        const idCliente = sessionStorage.getItem('idCliente');

        try {
            const response = await fetch(`http://localhost/match-servicos/api/ordemServico/obter/${idCliente}`);
            const data = await response.json();
            setOrdensDeServico(data.cliente);
        } catch (error) {
            console.error('Erro ao obter as ordens de serviço:', error);
        }
    };

    return (
        <div className="App">
            <header id="headerMinhaContaPage">
                <img src={logo} alt="Logo" />
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Página Inicial | Match Serviços</Link>
                        </li>
                        <li>
                            <Link to="/cadastrar">Cadastrar-se</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <article id="articleMinhaContaPage">
                <Tabs>
                    <TabList>
                        <Tab>Editar Dados</Tab>
                        <Tab>Enviar Fotos/Vídeos</Tab>
                        {cliente.prestadorDeServicos && <Tab>Ordens de Serviço</Tab>}
                    </TabList>

                    <TabPanel>
                        <h2>Editar Dados</h2>
                        <form onSubmit={handleSubmitDados}>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="nome" className="form-label">Nome:</label>
                                <input type="text" className="form-control" id="nome" value={cliente.nome} onChange={(e) => setNome(e.target.value)} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="email" className="form-control" id="email" value={cliente.email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="col-md-6 mb-3">
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
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="servicosPrestados" className="form-label">Serviços Prestados:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="servicosPrestados"
                                        placeholder="Digite os serviços prestados separados por vírgula (pedreiro, eletricista, etc)"
                                        value={cliente.servicosPrestados}
                                        onChange={(e) => setServicosPrestados(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="col-md-6 mb-3">
                                <label htmlFor="telefone" className="form-label">Telefone:</label>
                                <input type="tel" className="form-control" id="telefone" value={cliente.telefone} onChange={(e) => setTelefone(e.target.value)} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="whatsapp" className="form-label">WhatsApp:</label>
                                <input type="tel" className="form-control" id="whatsapp" value={cliente.whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="genero" className="form-label">Gênero:</label>
                                <select className="form-select" id="genero" value={cliente.genero} onChange={(e) => setGenero(e.target.value)}>
                                    <option value="">Selecione</option>
                                    <option value="feminino">Feminino</option>
                                    <option value="masculino">Masculino</option>
                                </select>
                            </div>
                            <button type="submit">Salvar</button>
                        </form>
                    </TabPanel>

                    <TabPanel>
                        <h2>Meu Endereço</h2>
                        <form onSubmit={handleSubmitImage}>
                            <label>
                                Selecionar arquivo:
                                <input type="file" onChange={handleFileChange} />
                            </label>
                            <button type="submit">Enviar</button>
                        </form>

                        {cliente.imagem && cliente.imagem.length > 0 && (
                            <article id="articleCardTrabalhadorHomePage">
                                {cliente.imagem.map((imagem, index) => (
                                    <CardPrestadorServicos imageSrc={`http://localhost/match-servicos/api/imagem/ler/${imagem.nomeArquivo}`} alt={`Descrição da imagem ${index + 1}`} key={index} />
                                ))}
                            </article>
                        )}
                    </TabPanel>

                    <TabPanel>
                        <h2>Enviar Fotos/Vídeos</h2>
                        <form onSubmit={handleSubmitImage}>
                            <label>
                                Selecionar arquivo:
                                <input type="file" onChange={handleFileChange} />
                            </label>
                            <button type="submit">Enviar</button>
                        </form>

                        {cliente.imagem && cliente.imagem.length > 0 && (
                            <article id="articleCardTrabalhadorHomePage">
                                {cliente.imagem.map((imagem, index) => (
                                    <CardPrestadorServicos imageSrc={`http://localhost/match-servicos/api/imagem/ler/${imagem.nomeArquivo}`} alt={`Descrição da imagem ${index + 1}`} key={index} />
                                ))}
                            </article>
                        )}
                    </TabPanel>

                    <TabPanel>
                        <h2>Ordens de Serviço</h2>
                        {/* Renderiza as ordens de serviço se houver */}
                        {ordensDeServico && ordensDeServico.map((ordem, index) => (
                            <div key={index}>
                                <p>ID da Ordem: {ordem.id}</p>
                                <p>Id Solicitante: {ordem.idSolicitante}</p>
                                <p>Data Criação: {ordem.dataCriacao}</p>
                                <p>Status: {ordem.status}</p>
                                {/* Renderize outras informações da ordem aqui */}
                            </div>
                        ))}
                    </TabPanel>
                </Tabs>
            </article>

            <FooterPage></FooterPage>
        </div>
    );
}

export default App;
