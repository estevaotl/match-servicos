import React, { useState, useEffect } from 'react';
import TrabalhadorCard from '../componentes/TrabalhadorCard';
import { useNavigate } from 'react-router-dom';
import '../css/busca-page.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const SearchPage = () => {
    const [currentSearchQuery, setCurrentSearchQuery] = useState('');
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [minAge, setMinAge] = useState(18);
    const [selectedProfession, setSelectedProfession] = useState(''); // Add state for selected profession

    const navigate = useNavigate();

    const handleMinAgeChange = (event) => {
        setMinAge(event.target.value);
    };

    const handleProfessionChange = (event) => {
        setSelectedProfession(event.target.value);
    };

    const fetchData = async (query = '', age = 18, profession = '') => {
        try {
            const encodedQuery = encodeURIComponent(query); // Use the `query` parameter
            const encodedProfession = encodeURIComponent(profession); // Include the selected profession

            var url = `http://localhost/match-servicos/api/clientes/busca?q=${encodedQuery}`;
            if (age > 18) {
                const encodedMinAge = encodeURIComponent(age);
                url += `&idade=${encodedMinAge}`;
            }

            if (profession) { // Add the profession to the URL if it's selected
                url += `&profissaoEspecifica=${encodedProfession}`;
            }

            const response = await fetch(url);

            const data = await response.json();

            setFilteredWorkers(data.cliente);
        } catch (error) {
            setFilteredWorkers([]);
        }
    };

    const handleClear = () => {
        // Redirecionar para a URL /busca
        window.location.href = '/busca';
    };

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const query = urlSearchParams.get('q');
        const ageRange = urlSearchParams.get('idade');
        const profissaoEspecifica = urlSearchParams.get('profissaoEspecifica');

        setCurrentSearchQuery(query || '');
        setMinAge(ageRange || 18);
        setSelectedProfession(profissaoEspecifica || '');

        // Use the `query` parameter in the initial API request
        fetchData(query, ageRange, profissaoEspecifica); // Pass `query` as an argument to fetchData
    }, []);

    const handleFilter = () => {
        var url = `/busca?q=${currentSearchQuery}`;
        if (minAge > 18) {
            url += `&idade=${minAge}`;
        }

        if (selectedProfession) { // Add the profession to the URL if it's selected
            url += `&profissaoEspecifica=${selectedProfession}`;
        }

        navigate(url); // Include the selected profession in the URL
        fetchData(currentSearchQuery, minAge, selectedProfession); // Pass the selected profession to fetchData
    };

    return (
        <div className="App">

            <article id="articleMinhaContaPage">
                <div className="d-flex">
                    <div className="">
                        <input
                            type="text"
                            className="form-control me-2 input-servico"
                            placeholder="Digite o serviço desejado"
                            value={currentSearchQuery}
                            onChange={(e) => setCurrentSearchQuery(e.target.value)}
                        />

                        <span>Idade atual: {minAge} anos</span><br />
                        <input
                            type="range"
                            min="18"
                            max="200"
                            value={minAge}
                            onChange={handleMinAgeChange}
                            className='input-age'
                        />

                        <label htmlFor="profissao" className="form-label">
                            Serviços Prestados:
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id="tooltip-profissao">
                                        Caso selecione uma profissão nesse select, a pesquisa anterior será desconsiderada.
                                    </Tooltip>
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-exclamation-circle-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                </svg>
                            </OverlayTrigger>
                        </label>
                        <select
                            id="profissao"
                            name="profissao"
                            value={selectedProfession}
                            onChange={handleProfessionChange} // Handle profession change
                            className="form-select"
                        >
                            <optgroup label="Ciências Agrárias">
                                <option value="agronomia">Agronomia</option>
                                <option value="biotecnologia">Biotecnologia</option>
                                <option value="engenharia agricola">Engenharia Agrícola</option>
                                <option value="engenharia de alimentos">Engenharia de Alimentos</option>
                                <option value="engenharia de pesca">Engenharia de Pesca</option>
                                <option value="engenharia florestal">Engenharia Florestal</option>
                                <option value="medicina veterinaria">Medicina Veterinária</option>
                                <option value="zootecnia">Zootecnia</option>
                            </optgroup>

                            <optgroup label="Ciências da Saúde">
                                <option value="educação fisica">Educação Física</option>
                                <option value="enfermagem">Enfermagem</option>
                                <option value="farmacia">Farmácia</option>
                                <option value="fisioterapia">Fisioterapia</option>
                                <option value="fonoaudiologia">Fonoaudiologia</option>
                                <option value="medicina">Medicina</option>
                                <option value="odontologia">Odontologia</option>
                                <option value="saude coletiva">Saúde Coletiva</option>
                                <option value="terapia ocupacional">Terapia Ocupacional</option>
                            </optgroup>

                            <optgroup label="Ciências Exatas e da Terra">
                                <option value="ciencia da computação">Ciência da Computação</option>
                                <option value="fisica">Física</option>
                                <option value="matematica">Matemática</option>
                                <option value="quimica">Química</option>
                            </optgroup>

                            <optgroup label="Ciências Humanas">
                                <option value="geografia">Geografia</option>
                                <option value="historia">História</option>
                                <option value="psicologia">Psicologia</option>
                                <option value="sociologia">Sociologia</option>
                                <option value="teologia">Teologia</option>
                            </optgroup>

                            <optgroup label="Ciências Sociais Aplicadas">
                                <option value="administração">Administração</option>
                                <option value="publicidade e propaganda">Publicidade e Propaganda</option>
                            </optgroup>

                            <optgroup label="Construção Civil">
                                <option value="pedreiro">Pedreiro</option>
                                <option value="eletrecista">Eletrecista</option>
                                <option value="bombeiro hidraulico">Bombeiro Hidráulico</option>
                                <option value="servente">Servente de Obras</option>
                            </optgroup>

                            <optgroup label="Serviços Gerais">
                                <option value="mecanico">Mecânico</option>
                                <option value="mecanico de moto">Mecânico de Moto</option>
                                <option value="mecanico de carro">Mecânico de Carro</option>
                            </optgroup>
                        </select><br />
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleFilter}>
                            Filtrar
                        </button>
                        <button
                            className="btn btn-warning"
                            type="button"
                            onClick={handleClear}
                        >
                            Limpar
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