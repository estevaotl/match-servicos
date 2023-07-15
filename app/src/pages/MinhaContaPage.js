import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/minha-conta-page.css';
import logo from '../imagens/logo.png'; // Importe o caminho da imagem corretamente
import icone_engenharia from '../imagens/icone_engenharia.png'; // Importe o caminho da imagem corretamente
import icone_personagem from '../imagens/icone_personagem.png'; // Importe o caminho da imagem corretamente
import CardPrestadorServicos from '../componentes/CardPrestadorServicos'; // Caminho relativo para o arquivo Card.js
import CardAvalicoesSite from '../componentes/CardAvaliacoesSite'; // Caminho relativo para o arquivo Card.js
import FooterPage from '../componentes/FooterPage';

const MinhaContaPage = () => {
    return (
        <div>
            <header id="headerHomePage">
                <img src={logo} alt="Logo" />
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Página Inicial</Link>
                        </li>
                        <li>
                            <Link to="/sair">Sair</Link>
                        </li>
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

export default MinhaContaPage;