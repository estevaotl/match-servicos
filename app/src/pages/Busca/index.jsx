import React, { useState, useEffect } from 'react';
import TrabalhadorCard from '../../componentes/TrabalhadorCard';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useAuth } from '../../contexts/Auth';
import Autocomplete from '../../componentes/AutoComplete';

const SearchPage = () => {
  const { idCliente } = useAuth();

  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState(''); // Add state for selected profession
  const [ufs, setUfs] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCidade, setSelectedCidade] = useState([]);

  const currentURL = window.location.href;
  const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  const navigate = useNavigate();

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

      var url = `${apiURL}/clientes/busca?q=${encodedQuery}`;
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

    if (event.target.value.length > 0) {
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

    if (estado != null) {
      fetchCidadeEstado(estado);
    }
  }, []);

  return (
    <div className="container-busca">
      <div className="container-resultado-busca flex-grow-1 d-flex flex-wrap">
        {filteredWorkers.length === 0 && (
          <div className="empty-container alert alert-warning">
            Nenhum trabalhador encontrado
          </div>
        )}
        {filteredWorkers.length > 0 && filteredWorkers.map(worker => (
          <TrabalhadorCard key={worker.id} worker={worker} />
        ))}
      </div>

      <article className='filter'>
        <div className="d-flex">
          <div className="">
            {idCliente.length <= 0 && (
              <div className="alert alert-danger">Caso queira uma filtragem pela sua localidade, se logue no site!</div>
            )}

            <Autocomplete
              placeholder="Digite o serviço desejado"
              onSelectJob={(value) => setCurrentSearchQuery(value)}
              exibirBotaoPesquisa={false}
              classeInputBusca="input-servico"
              value={currentSearchQuery}
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
              <option value="">Selecione a profissão</option>
              <optgroup label="Reparos Elétricos">
                  <option value="Troca de tomadas e interruptores">Troca de tomadas e interruptores</option>
                  <option value="Instalação de luminárias">Instalação de luminárias</option>
                  <option value="Resolução de problemas elétricos simples">Resolução de problemas elétricos simples</option>
                  <option value="Substituição de disjuntores">Substituição de disjuntores</option>
                </optgroup>

                <optgroup label="Reparos Hidráulicos">
                  <option value="Conserto de vazamentos de torneiras e canos">Conserto de vazamentos de torneiras e canos</option>
                  <option value="Desentupimento de pias e ralos">Desentupimento de pias e ralos</option>
                  <option value="Instalação ou substituição de torneiras e válvulas">Instalação ou substituição de torneiras e válvulas</option>
                </optgroup>

                <optgroup label="Pintura">
                  <option value="Pintura de paredes e tetos">Pintura de paredes e tetos</option>
                  <option value="Pintura de portas e janelas">Pintura de portas e janelas</option>
                  <option value="Preparação de superfícies, como lixar e aplicar primer">Preparação de superfícies, como lixar e aplicar primer</option>
                </optgroup>

                <optgroup label="Reparos em Carpintaria">
                  <option value="Instalação de prateleiras">Instalação de prateleiras</option>
                  <option value="Reparo de portas e fechaduras">Reparo de portas e fechaduras</option>
                  <option value="Montagem de móveis">Montagem de móveis</option>
                </optgroup>

                <optgroup label="Reparos em Alvenaria">
                  <option value="Construção de alvenaria, incluindo paredes de tijolos, blocos ou pedras">Construção de alvenaria, incluindo paredes de tijolos, blocos ou pedras</option>
                  <option value="Reparação de rachaduras em paredes">Reparação de rachaduras em paredes</option>
                  <option value="Rejunte de azulejos">Rejunte de azulejos</option>
                  <option value="Substituição de telhas danificadas">Substituição de telhas danificadas</option>
                </optgroup>

                <optgroup label="Montagem e Instalação">
                  <option value="Montagem de móveis e estantes">Montagem de móveis e estantes</option>
                  <option value="Instalação de suportes para TV e prateleiras">Instalação de suportes para TV e prateleiras</option>
                  <option value="Montagem de playgrounds e equipamentos de ginástica">Montagem de playgrounds e equipamentos de ginástica</option>
                  <option value="Instalação de sistemas de armazenamento">Instalação de sistemas de armazenamento</option>
                </optgroup>

                <optgroup label="Limpeza de Calhas">
                  <option value="Remoção de detritos e folhas de calhas">Remoção de detritos e folhas de calhas</option>
                  <option value="Desobstrução de calhas entupidas">Desobstrução de calhas entupidas</option>
                </optgroup>

                <optgroup label="Manutenção de Portões e Cercas">
                  <option value="Lubrificação e reparos em portões">Lubrificação e reparos em portões</option>
                  <option value="Reparo de cercas danificadas">Reparo de cercas danificadas</option>
                </optgroup>

                <optgroup label="Instalação de Aparelhos Domésticos">
                  <option value="Instalação de eletrodomésticos, como máquinas de lavar e secar">Instalação de eletrodomésticos, como máquinas de lavar e secar</option>
                  <option value="Instalação de ventiladores de teto">Instalação de ventiladores de teto</option>
                </optgroup>

                <optgroup label="Pequenos Reparos Gerais">
                  <option value="Troca de maçanetas">Troca de maçanetas</option>
                  <option value="Ajustes em persianas">Ajustes em persianas</option>
                  <option value="Substituição de vidros quebrados">Substituição de vidros quebrados</option>
                </optgroup>

                <optgroup label="Reparos em Telhados">
                  <option value="Substituição de telhas danificadas">Substituição de telhas danificadas</option>
                  <option value="Selagem de vazamentos de telhados">Selagem de vazamentos de telhados</option>
                </optgroup>

                <optgroup label="Construção de Churrasqueiras e Lareiras">
                  <option value="Construção de churrasqueiras e lareiras de alvenaria sob medida">Construção de churrasqueiras e lareiras de alvenaria sob medida</option>
                </optgroup>

                <optgroup label="Construção de Calçadas e Passeios">
                  <option value="Construção de calçadas e passeios em concreto ou pedra">Construção de calçadas e passeios em concreto ou pedra</option>
                </optgroup>

                <optgroup label="Manutenção de Veículos">
                  <option value="Troca de óleo">Troca de óleo</option>
                  <option value="Substituição de freios">Substituição de freios</option>
                  <option value="Alinhamento e balanceamento">Alinhamento e balanceamento</option>
                  <option value="Diagnóstico de problemas mecânicos em veículos">Diagnóstico de problemas mecânicos em veículos</option>
                  <option value="Troca de peças e componentes">Troca de peças e componentes</option>
                  <option value="Reparo de motores de veículos">Reparo de motores de veículos</option>
                </optgroup>

                <optgroup label="Serviços de Chaveiro Residencial">
                  <option value="Instalação, reparo e substituição de fechaduras e chaves em casas e apartamentos">Instalação, reparo e substituição de fechaduras e chaves em casas e apartamentos</option>
                </optgroup>

                <optgroup label="Chaveiro Automotivo">
                  <option value="Desbloqueio de veículos">Desbloqueio de veículos</option>
                  <option value="Cópias de chaves de automóveis">Cópias de chaves de automóveis</option>
                  <option value="Programação de chaves de transponder">Programação de chaves de transponder</option>
                </optgroup>

                <optgroup label="Chaveiro Comercial">
                  <option value="Serviços relacionados a fechaduras de escritórios e estabelecimentos comerciais">Serviços relacionados a fechaduras de escritórios e estabelecimentos comerciais</option>
                  <option value="Instalação de sistemas de controle de acesso">Instalação de sistemas de controle de acesso</option>
                </optgroup>

                <optgroup label="Chaves Codificadas">
                  <option value="Fornecimento de chaves codificadas para veículos modernos com sistemas de segurança avançados">Fornecimento de chaves codificadas para veículos modernos com sistemas de segurança avançados</option>
                </optgroup>

                <optgroup label="Abertura de Cofres">
                  <option value="Abertura de cofres e fechaduras de alta segurança em situações de emergência">Abertura de cofres e fechaduras de alta segurança em situações de emergência</option>
                </optgroup>

                <optgroup label="Outro">
                  <option value="Serviços variados">Serviços variados</option>
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

            <div className='button-container'>
              <button
                className="btn btn-warning  mt-3"
                type="button"
                onClick={handleClear}
              >
                Limpar
              </button>
              <button
                className="btn btn-primary  mt-3"
                type="button"
                onClick={handleFilter}>
                Filtrar
              </button>
            </div>
          </div>

        </div>
      </article>

    </div>
  );
};

export default SearchPage;