import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

    return (
        <div>
            <header id="headerHomePage">
                <img src={logo} alt="Logo" />
                <nav>
                    <ul>
                        {idCliente ? (
                            <>
                                <li>Olá, {nomeCliente}.</li>
                                <li>
                                    <Link to="/minha-conta">Entrar na sua conta</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                            
                        ) : (
                            // Renderiza o menu padrão quando idCliente não está presente
                            <>
                                <li>
                                    <Link to="/cadastrar">Cadastrar-se</Link>
                                </li>
                                <li>
                                    <Link to="/login">Entrar na sua conta</Link>
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