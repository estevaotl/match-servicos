import React, { useState, useEffect } from 'react';
import TrabalhadorCard from '../componentes/TrabalhadorCard';
import { useNavigate } from 'react-router-dom';
import '../css/busca-page.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const SearchPage = () => {
    const [currentSearchQuery, setCurrentSearchQuery] = useState('');
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    // const [minAge, setMinAge] = useState(18);
    const [selectedProfession, setSelectedProfession] = useState(''); // Add state for selected profession
    const [ufs, setUfs] = useState([]);
    const [selectedEstado, setSelectedEstado] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCidade, setSelectedCidade] = useState([]);

    const navigate = useNavigate();

    // const handleMinAgeChange = (event) => {
    //     setMinAge(event.target.value);
    // };

    const handleProfessionChange = (event) => {
        setSelectedProfession(event.target.value);
    };

    const handleCidadeChange = (event) => {
        setSelectedCidade(event.target.value);
    };

    const fetchData = async (query = '', profession = '', estado = '', cidade = '') => {
        try {
            const encodedQuery = encodeURIComponent(query); // Use the `query` parameter
            const encodedProfession = encodeURIComponent(profession); // Include the selected profession
            const encodedEstado = encodeURIComponent(estado); // Include the selected profession
            const encodedCidade = encodeURIComponent(cidade); // Include the selected profession

            var url = `http://localhost/match-servicos/api/clientes/busca?q=${encodedQuery}`;
            // if (age > 18) {
            //     const encodedMinAge = encodeURIComponent(age);
            //     url += `&idade=${encodedMinAge}`;
            // }

            if (profession) { // Add the profession to the URL if it's selected
                url += `&profissaoEspecifica=${encodedProfession}`;
            }

            if (estado) { // Add the profession to the URL if it's selected
                url += `&estado=${encodedEstado}`;
            }

            if (cidade) { // Add the profession to the URL if it's selected
                url += `&cidade=${encodedCidade}`;
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
        // const ageRange = urlSearchParams.get('idade');
        const profissaoEspecifica = urlSearchParams.get('profissaoEspecifica');
        const estado = urlSearchParams.get('estado');
        const cidade = urlSearchParams.get('cidade');

        setCurrentSearchQuery(query || '');
        // setMinAge(ageRange || 18);
        setSelectedProfession(profissaoEspecifica || '');
        setSelectedEstado(estado || '');
        setSelectedCidade(cidade || '');

        // Use the `query` parameter in the initial API request
        fetchData(query, profissaoEspecifica, estado, cidade); // Pass `query` as an argument to fetchData
    }, []);

    const fetchEstados = async () => {
        try {
            var url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`;

            const response = await fetch(url);

            const data = await response.json();

            setUfs(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleEstadoChange = (event) => {
        setSelectedEstado(event.target.value);

        if(event.target.value.length > 0){
            fetchCidadeEstado(event.target.value);
        } else {
            setSelectedCidade([]);
        }
    };

    const fetchCidadeEstado = async (estado) => {
        try {
            var url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`

            const response = await fetch(url);

            const data = await response.json();

            setCities(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleFilter = () => {
        var url = `/busca?q=${currentSearchQuery}`;
        // if (minAge > 18) {
        //     url += `&idade=${minAge}`;
        // }

        if (selectedProfession) {
            url += `&profissaoEspecifica=${selectedProfession}`;
        }

        if (selectedEstado) {
            url += `&estado=${selectedEstado}`;
        }

        if (selectedCidade) {
            url += `&cidade=${selectedCidade}`;
        }

        navigate(url); // Include the selected profession in the URL
        fetchData(currentSearchQuery, selectedProfession, selectedEstado, selectedCidade); // Pass the selected profession to fetchData
    };

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const estado = urlSearchParams.get('estado');
        const cidade = urlSearchParams.get('cidade');

        setSelectedEstado(estado || '');
        setSelectedCidade(cidade || '');

        fetchEstados();

        if(estado != null){
            fetchCidadeEstado(estado);
        }
    }, []);

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

                        {/* <span>Idade atual: {minAge} anos</span><br />
                        <input
                            type="range"
                            min="18"
                            max="200"
                            value={minAge}
                            onChange={handleMinAgeChange}
                            className='input-age'
                        /><br /> */}

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
                            <option value="">Selecione a profissão</option>
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
                        </select>
                        <br />

                        <label htmlFor="estadoSelect" className="form-label">Selecione um Estado:</label>
                        <select
                            id="estadoSelect"
                            value={selectedEstado}
                            onChange={handleEstadoChange}
                            className="form-select"
                        >
                            <option value="">Selecione um Estado</option>
                            {ufs.map((estado, index) => (
                                <option key={index} value={estado.sigla}>
                                    {estado.nome}
                                </option>
                            ))}
                        </select>
                        <br />

                        {selectedEstado && (
                            <>
                                <label htmlFor="cidadeSelect" className="form-label">Selecione uma cidade:</label>
                                <select
                                    id="cidadeSelect"
                                    value={selectedCidade}
                                    onChange={handleCidadeChange} // Implemente a função handleCidadeChange
                                    className="form-select"
                                >
                                    <option value="">Selecione a cidade</option>
                                    {cities.map((cidade, index) => (
                                        <option key={cidade.id} value={cidade.nome}>
                                            {cidade.nome}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
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