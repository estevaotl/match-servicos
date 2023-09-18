import React, { useState, useEffect } from 'react';
import TrabalhadorCard from '../componentes/TrabalhadorCard';
import FooterPage from '../componentes/FooterPage';
import { Link, useNavigate } from 'react-router-dom';
import '../css/busca-page.css';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [minAge, setMinAge] = useState(18);
    const navigate = useNavigate();

    const handleMinAgeChange = (event) => {
        setMinAge(event.target.value);
    };

    useEffect(() => {
        // Obtém os parâmetros da URL
        const urlSearchParams = new URLSearchParams(window.location.search);
        const query = urlSearchParams.get('q');
        const ageRange = urlSearchParams.get('idade');

        // Define os estados de busca de acordo com os parâmetros da URL
        setSearchQuery(query || '');
        setAgeRange(ageRange || '');

        // Busca os trabalhadores filtrados pela busca e pela faixa de idade da URL
        const buscarTrabalhadores = async () => {
            try {
                const response = await fetch(`http://localhost/match-servicos/api/clientes/busca?q=${query}&idade=${ageRange}`);
                const data = await response.json();

                setFilteredWorkers(data.cliente);
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        };

        buscarTrabalhadores();

    }, [searchQuery, ageRange]);

    const handleFilter = async () => {
        try {
            // Enviar uma requisição para a API, filtrando os trabalhadores com base na faixa de idade selecionada e no valor da busca.
            const response = await fetch(`http://localhost/match-servicos/api/clientes/busca?q=${searchQuery}&idade=${minAge}`);
            const data = await response.json();

            setFilteredWorkers(data.cliente);

            // Atualiza a URL com os novos parâmetros de filtro.
            navigate(`/busca?q=${searchQuery}&idade=${minAge}`);
        } catch (error) {
            setFilteredWorkers('');
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
                    <div className="flex-grow-1 d-flex flex-wrap">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Digite o serviço desejado"
                            value={searchQuery}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <input
                            type="range"
                            min="18"
                            max="200"
                            value={minAge}
                            onChange={handleMinAgeChange}
                        />
                        <span>Idade atual: {minAge} anos</span>
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

            <FooterPage></FooterPage>
        </div>
    );
};

export default SearchPage;