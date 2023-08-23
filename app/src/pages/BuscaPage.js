import React, { useState, useEffect } from 'react';
import TrabalhadorCard from '../componentes/TrabalhadorCard';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [profissao, setProfissao] = useState('');
    const [idade, setIdade] = useState('');
    const [distancia, setDistancia] = useState('');
    const [filteredWorkers, setFilteredWorkers] = useState([]);

    useEffect(() => {
        // Obtém os parâmetros da URL
        const urlSearchParams = new URLSearchParams(window.location.search);
        const query = urlSearchParams.get('q');

        // Define o estado de busca com base no parâmetro da URL
        setSearchQuery(query || '');

        // Função para buscar os trabalhadores com base nos filtros
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

    return (
        <div>
            <h2>Resultados da Busca</h2>

            <div className="d-flex">
                <div className="flex-grow-1 d-flex flex-wrap">
                    {filteredWorkers.map(worker => (
                        <TrabalhadorCard key={worker.id} worker={worker} />
                    ))}
                </div>

                <div className="flex-grow">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Busca"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Profissão"
                        value={profissao}
                        onChange={(e) => setProfissao(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Idade"
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Distância"
                        value={distancia}
                        onChange={(e) => setDistancia(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchPage;