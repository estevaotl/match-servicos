import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/home-page.css';
import icone_engenharia from '../imagens/icone_engenharia.png'; // Importe o caminho da imagem corretamente
import icone_personagem from '../imagens/icone_personagem.png'; // Importe o caminho da imagem corretamente
import icone_person from '../imagens/icone_person.png'; // Importe o caminho da imagem corretamente
import CardPrestadorServicos from '../componentes/CardPrestadorServicos'; // Caminho relativo para o arquivo Card.js
import CardAvalicoesSite from '../componentes/CardAvaliacoesSite'; // Caminho relativo para o arquivo Card.js
import FooterPage from '../componentes/FooterPage';
import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';
import { BiEnvelopeOpen } from 'react-icons/bi';

const HomePage = () => {
    const [idCliente, setIdCliente] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0); // Página inicial em 0
    const totalItems = 9; // Número total de itens no carrossel
    const itemsPerPage = 3; // Número de itens por página no carrossel
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [prestadoresServicos, setPrestadoresServicos] = useState([]);

    const startIdx = currentPage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleData = prestadoresServicos.slice(startIdx, endIdx);

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

        fetchPrestadoresServicos();
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

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const chunkArray = (array, chunkSize) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const paginatedData = chunkArray(prestadoresServicos, itemsPerPage);

    // Função para buscar ordens de serviço da API
    const fetchPrestadoresServicos = async () => {
        try {
            const response = await fetch(`http://localhost/match-servicos/api/clientes/obterParaCarrossel`);
            const data = await response.json();
            setPrestadoresServicos(data.cliente);
        } catch (error) {
            console.error('Erro ao obter as ordens de serviço:', error);
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
                <Carousel selectedItem={currentPage}>
                    {paginatedData.map((pageData, index) => (
                        <div key={index} className="row">
                            {pageData.map((prestador, prestadorIndex) => (
                                <div key={prestadorIndex} className="col-md-4">
                                    <CardPrestadorServicos
                                        imageSrc={
                                            prestador.imagem.length > 0
                                                ? `http://localhost/match-servicos/api/imagem/ler/${prestador.imagem[0].nomeArquivo}`
                                                : 'http://localhost/match-servicos/api/imagem/ler/icone_person.png' // Defina o caminho para a imagem padrão aqui
                                        }
                                        altText={`Imagem de ${prestador.nome}`}
                                        profissao={prestador.servicosPrestados}
                                        idade={prestador.idade}
                                        endereco={`${prestador.endereco[0].rua}, ${prestador.endereco[0].numero}, ${prestador.endereco[0].bairro}, ${prestador.endereco[0].cidade}, ${prestador.endereco[0].estado}`}
                                        media_avaliacao={prestador.media_avaliacao}
                                        key={prestadorIndex}
                                    >
                                        {/* O restante do seu conteúdo do CardPrestadorServicos */}
                                    </CardPrestadorServicos>
                                </div>
                            ))}
                        </div>
                    ))}
                </Carousel>
            </article>

            {/* <article id="articleCardAvaliacoesHomePage">
                <CardAvalicoesSite imageSrc={icone_personagem} altText="Descrição da imagem" nome="Rosana" idade="40 anos" comentario="A loja é muito boa. Recomendo" />
                <CardAvalicoesSite imageSrc={icone_personagem} altText="Descrição da imagem" nome="Rosana" idade="40 anos" comentario="A loja é muito boa. Recomendo" />
                <CardAvalicoesSite imageSrc={icone_personagem} altText="Descrição da imagem" nome="Rosana" idade="40 anos" comentario="A loja é muito boa. Recomendo" />
            </article> */}

            <FooterPage></FooterPage>
        </div>
    );
};

export default HomePage;
