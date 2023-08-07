import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../css/minha-conta-page.css';
import FooterPage from '../componentes/FooterPage';
import logo from '../imagens/logo.png'; // Importe o caminho da imagem corretamente
import { Link, useNavigate } from 'react-router-dom'; // Importe o useNavigate

function App() {
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [genero, setGenero] = useState('');
    const [prestadorDeServicos, setPrestadorDeServicos] = useState('');

    const [cliente, setCliente] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode enviar os dados do formulário e do arquivo para o servidor
        console.log('Dados do formulário:', { email });
        console.log('Arquivo:', file);
    };

    useEffect(() => {
        console.log(sessionStorage);
        const idCliente = sessionStorage.getItem('idCliente');

        fetch(`http://localhost:8000/clientes/obter/${idCliente}`, {
            method: 'GET', // ou 'GET', 'PUT', 'DELETE', etc., dependendo do tipo de requisição que você deseja fazer
            headers: {
                'Content-Type': 'application/json',
                // Aqui você pode adicionar quaisquer outros cabeçalhos necessários
            }
        })
        .then(response => response.json())
            .then(data => {
                setCliente(data.cliente); // Não é necessário usar JSON.stringify aqui
        })
        .catch(error => {
            navigate('/'); // Use navigate('/') para redirecionar para a página inicial
        });
    }, []);

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
                    </TabList>

                    <TabPanel>
                        <h2>Editar Dados</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="nome" className="form-label">Nome:</label>
                                <input type="text" className="form-control" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="prestadorDeServicos" className="form-label">Prestador de Serviços:</label>
                                <select className="form-select" id="prestadorDeServicos" value={prestadorDeServicos} onChange={(e) => setPrestadorDeServicos(e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="prestadorSim">Sim</option>
                                <option value="prestadorNao">Não</option>
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="telefone" className="form-label">Telefone:</label>
                                <input type="tel" className="form-control" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="whatsapp" className="form-label">WhatsApp:</label>
                                <input type="tel" className="form-control" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="genero" className="form-label">Gênero:</label>
                                <select className="form-select" id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="feminino">Feminino</option>
                                <option value="masculino">Masculino</option>
                                </select>
                            </div>
                            <button type="submit">Salvar</button>
                        </form>
                    </TabPanel>

                    <TabPanel>
                        <h2>Enviar Fotos/Vídeos</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Selecionar arquivo:
                                <input type="file" onChange={handleFileChange} />
                            </label>
                            <button type="submit">Enviar</button>
                        </form>
                    </TabPanel>
                </Tabs>
            </article>

            <FooterPage></FooterPage>
        </div>
    );
}

export default App;
