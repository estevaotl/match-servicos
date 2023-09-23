import React, { useState, useEffect } from 'react';
import TrabalhadorCard from '../componentes/TrabalhadorCard';
import { Link, useNavigate } from 'react-router-dom';
import '../css/busca-page.css';

const SearchPage = () => {
    const [idCliente, setIdCliente] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');

    const [currentSearchQuery, setCurrentSearchQuery] = useState('');
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [minAge, setMinAge] = useState(18);
    // const [maxDistance, setMaxDistance] = useState(10); // Defina a distância máxima permitida em quilômetros
    const navigate = useNavigate();

    const handleMinAgeChange = (event) => {
        setMinAge(event.target.value);
    };

    // const handleMaxDistanceChange = (event) => {
    //     setMaxDistance(event.target.value);
    // };

    const fetchData = async () => {
        try {
            // Encode the search query and minAge values
            const encodedQuery = encodeURIComponent(currentSearchQuery);
            const encodedMinAge = encodeURIComponent(minAge);
            // const encodedMaxDistance = encodeURIComponent(maxDistance);
            // distancia=${encodedMaxDistance}

            // Send a request to the API, filtering workers based on the selected age range and search query.
            const response = await fetch(`http://localhost/match-servicos/api/clientes/busca?q=${encodedQuery}&idade=${encodedMinAge}`);

            const data = await response.json();

            setFilteredWorkers(data.cliente);
        } catch (error) {
            setFilteredWorkers([]);
        }
    };

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

        // Obtain URL parameters when the page loads.
        const urlSearchParams = new URLSearchParams(window.location.search);
        const query = urlSearchParams.get('q');
        const ageRange = urlSearchParams.get('idade');
        // const distance = urlSearchParams.get('distancia');

        // Set search query and minAge based on URL parameters.
        setCurrentSearchQuery(query || '');
        setMinAge(ageRange || 18);
        // setMaxDistance(distance || 10); // Valor padrão: 10 km

        // Fetch data when the page loads.
        fetchData();
        
    }, []);

    const handleFilter = () => {
        // Update the URL with the new filter parameters.
        // distancia=${maxDistance}
        navigate(`/busca?q=${currentSearchQuery}&idade=${minAge}`);
        // Fetch data with the updated parameters.
        fetchData();
    };

    const handleLogout = () => {
        sessionStorage.removeItem('idCliente'); // Supondo que 'idCliente' é o item que você deseja limpar
        sessionStorage.removeItem('nomeCliente');
        setIdCliente(false); // Atualizar o estado para indicar que o cliente não está mais logado
        setNomeCliente(false);
    };

    return (
        <div className="App">
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
                                    <Link to="/" className="text-decoration-none text-dark d-block">Página Inicial</Link>
                                </li>
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
                                    <Link to="/" className="text-decoration-none text-dark d-block">Página Inicial</Link>
                                </li>
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

            <article id="articleMinhaContaPage">
                <div className="d-flex">
                    <div className="flex-grow-1 d-flex flex-wrap">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Digite o serviço desejado"
                            value={currentSearchQuery}
                            onChange={(e) => setCurrentSearchQuery(e.target.value)}
                        />
                        <input
                            type="range"
                            min="18"
                            max="200"
                            value={minAge}
                            onChange={handleMinAgeChange}
                        />
                        <span>Idade atual: {minAge} anos</span>
                        {/* <input
                            type="range"
                            min="0"
                            max="50" // Defina o valor máximo com base nas suas necessidades
                            value={maxDistance}
                            onChange={handleMaxDistanceChange}
                        />
                        <span>Distância máxima: {maxDistance} km</span> */}
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleFilter}>
                            Filtrar
                        </button>
                    </div>
                    <div className="flex-grow-1 d-flex flex-wrap">
                        {filteredWorkers.length === 0 && (
                            <div className="alert alert-warning">
                                Nenhum trabalhador encontrado
                            </div>
                        )}
                        {filteredWorkers.length > 0 && filteredWorkers.map(worker => (
                            <TrabalhadorCard key={worker.id} worker={worker} />
                        ))}
                    </div>
                </div>
            </article>

        </div>
    );
};

export default SearchPage;