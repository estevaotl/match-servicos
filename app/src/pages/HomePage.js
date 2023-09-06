import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/home-page.css';
import logo from '../imagens/logo.png'; // Importe o caminho da imagem corretamente
import icone_engenharia from '../imagens/icone_engenharia.png'; // Importe o caminho da imagem corretamente
import icone_personagem from '../imagens/icone_personagem.png'; // Importe o caminho da imagem corretamente
import CardPrestadorServicos from '../componentes/CardPrestadorServicos'; // Caminho relativo para o arquivo Card.js
import CardAvalicoesSite from '../componentes/CardAvaliacoesSite'; // Caminho relativo para o arquivo Card.js
import FooterPage from '../componentes/FooterPage';

const HomePage = () => {
    const [idCliente, setIdCliente] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica se o idCliente está salvo na sessionStorage
        const idClienteStorage = sessionStorage.getItem('idCliente');
        if (idClienteStorage) {
            setIdCliente(idClienteStorage);
        }

        const nomeCliente = sessionStorage.getItem('nomeCliente');
        if (nomeCliente) {
            setNomeCliente(nomeCliente);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('idCliente'); // Supondo que 'idCliente' é o item que você deseja limpar
        sessionStorage.removeItem('nomeCliente');
        setIdCliente(false); // Atualizar o estado para indicar que o cliente não está mais logado
        setNomeCliente(false);
    };

    const handleSearch = () => {
        if (searchValue) {
            navigate(`/busca?q=${searchValue}`);
        }
    };

    return (
        <div>
            <header className="mt-4 header-background d-flex justify-content-between align-items-center">
                <div className="text-white title-logo">
                    Match Serviços
                </div>
                <nav>
                    <ul className="list-unstyled">
                        {idCliente ? (
                            <>
                                <li className="mb-2">Olá, {nomeCliente}.</li>
                                <li className="mb-2">
                                    <Link className="text-decoration-none text-dark d-block" to="/minha-conta">Entrar na sua conta</Link>
                                </li>
                                <li className="mb-2">
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </>

                        ) : (
                            // Renderiza o menu padrão quando idCliente não está presente
                            <>
                                <li className="mb-2">
                                    <Link className="text-decoration-none text-dark d-block" to="/cadastrar">Cadastrar-se</Link>
                                </li>
                                <li className="mb-2">
                                    <Link className="text-decoration-none text-dark d-block" to="/login">Entrar na sua conta</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <section id="sectionHomePage">
                <span>
                    BEM VINDO AO MATCH SERVIÇOS. <br />
                    O PORTAL PARA ENCONTRAR O <br />
                    PRESTADOR DE SERVIÇOS IDEAL
                </span>
                <img src={icone_engenharia} alt="Logo" />
            </section>

            <div className="d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Digite o serviço desejado"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button className="btn btn-primary" type="button" onClick={handleSearch}>
                    Buscar
                </button>
            </div>

            <article id="articleCardTrabalhadorHomePage">
                <CardPrestadorServicos imageSrc={icone_personagem} altText="Descrição da imagem" profissao="Pedreiro" idade="40 anos" endereco="Rua Campos Salles numero 157 Perissê, Nova Friburgo - RJ" media_avaliacao="5.9" />
                <CardPrestadorServicos imageSrc={icone_personagem} altText="Descrição da imagem" profissao="Pedreiro" idade="40 anos" endereco="Rua Campos Salles numero 157 Perissê, Nova Friburgo - RJ" media_avaliacao="5.9" />
                <CardPrestadorServicos imageSrc={icone_personagem} altText="Descrição da imagem" profissao="Pedreiro" idade="40 anos" endereco="Rua Campos Salles numero 157 Perissê, Nova Friburgo - RJ" media_avaliacao="5.9" />
            </article>

            <article id="articleCardAvaliacoesHomePage">
                <CardAvalicoesSite imageSrc={icone_personagem} altText="Descrição da imagem" nome="Rosana" idade="40 anos" comentario="A loja é muito boa. Recomendo" />
                <CardAvalicoesSite imageSrc={icone_personagem} altText="Descrição da imagem" nome="Rosana" idade="40 anos" comentario="A loja é muito boa. Recomendo" />
                <CardAvalicoesSite imageSrc={icone_personagem} altText="Descrição da imagem" nome="Rosana" idade="40 anos" comentario="A loja é muito boa. Recomendo" />
            </article>

            <FooterPage></FooterPage>
        </div>
    );
};

export default HomePage;