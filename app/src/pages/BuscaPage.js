import React, { useState, useEffect } from 'react';
import TrabalhadorCard from '../componentes/TrabalhadorCard';
import FooterPage from '../componentes/FooterPage';
import { Link, useNavigate } from 'react-router-dom';
import '../css/busca-page.css';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Obtém os parâmetros da URL
        const urlSearchParams = new URLSearchParams(window.location.search);
        const query = urlSearchParams.get('q');

        // Define o estado de busca com base no parâmetro da URL
        setSearchQuery(query || '');

        const buscarTrabalhadores = async () => {
            try {
                const response = await fetch(`http://localhost/match-servicos/api/clientes/busca?q=${query}`);
                const data = await response.json();

                setFilteredWorkers(data.cliente);
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        };

        buscarTrabalhadores();
    }, [searchQuery]);

    const handleSearch = () => {
        if (searchValue) {
            navigate(`/busca?q=${searchValue}`);
        }
    };

    return (
        <div className="App">
            <header className="mt-4 header-background d-flex justify-content-between align-items-center">
                <div className="text-white title-logo">
                    Match Serviços
                </div>
                <nav>
                    <ul className="list-unstyled">
                        <li className="mb-2">
                            <Link className="text-decoration-none text-dark d-block" to="/">Página Inicial | Match Serviços</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <article id="articleMinhaContaPage">
                <div className="d-flex">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Digite o serviço desejado"
                        value={searchQuery}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button className="btn btn-primary" type="button" onClick={handleSearch}>
                        Buscar
                    </button>
                </div>

                <div className="d-flex">
                    <div className="flex-grow-1 d-flex flex-wrap">
                        {filteredWorkers.map(worker => (
                            <TrabalhadorCard key={worker.id} worker={worker} />
                        ))}
                    </div>
                </div>
            </article>

            <FooterPage></FooterPage>
        </div>
    );
};

export default SearchPage;