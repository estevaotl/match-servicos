import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';
import Autocomplete from '../../components/AutoComplete';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import ResultadoBusca from '../../components/ResultadoBusca';
import SelectProfissoes from '../../components/SelectProfissoes';

const SearchPage = () => {
  const { idCliente } = useAuth();

  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
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
      const encodedQuery = encodeURIComponent(query);
      const encodedProfession = encodeURIComponent(profession);
      const encodedEstado = encodeURIComponent(estado);
      const encodedCidade = encodeURIComponent(cidade);

      var url = `${apiURL}/clientes/busca?q=${encodedQuery}`;

      if (profession) {
        url += `&profissaoEspecifica=${encodedProfession}`;
      }

      if (estado) {
        url += `&estado=${encodedEstado}`;
      }

      if (cidade) {
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
    window.location.href = '/busca';
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const query = urlSearchParams.get('q');
    const profissaoEspecifica = urlSearchParams.get('profissaoEspecifica');
    const estado = urlSearchParams.get('estado');
    const cidade = urlSearchParams.get('cidade');

    setCurrentSearchQuery(query || '');
    setSelectedProfession(profissaoEspecifica || '');
    setSelectedEstado(estado || '');
    setSelectedCidade(cidade || '');

    fetchData(query, profissaoEspecifica, estado, cidade);
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

    if (selectedProfession) {
      url += `&profissaoEspecifica=${selectedProfession}`;
    }

    if (selectedEstado) {
      url += `&estado=${selectedEstado}`;
    }

    if (selectedCidade) {
      url += `&cidade=${selectedCidade}`;
    }

    navigate(url);
    fetchData(currentSearchQuery, selectedProfession, selectedEstado, selectedCidade);
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
    <Container fluid className="my-5">

      <Row>
        <Col lg="3">
          <div className="sticky-top" style={{ top: '7rem', zIndex: 1019 }}>

            {idCliente.length <= 0 && (
              <>
                <Alert variant="warning">
                  <span>Caso queira uma filtragem pela sua localidade, se logue no site!</span>
                </Alert>
              </>
            )}

            <Form.Group className="mb-3">
              <Autocomplete
                placeholder="Digite o serviço desejado"
                onSelectJob={(value) => setCurrentSearchQuery(value)}
                exibirBotaoPesquisa={false}
                value={currentSearchQuery}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <SelectProfissoes
                value={selectedProfession}
                onChange={handleProfessionChange}
                defaultOption="Selecione uma profissão"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select
                id="estadoSelect"
                name="estadoSelect"
                aria-label="Estado"
                value={selectedEstado}
                onChange={handleEstadoChange}
              >
                <option value="">Selecione um Estado</option>
                {ufs.map((estado, index) => (
                  <option key={index} value={estado.sigla}>
                    {estado.nome}
                  </option>
                ))}
              </Form.Select>
              <Form.Label htmlFor="estadoSelect">Estado</Form.Label>
            </Form.Group>

            {selectedEstado && (
              <Form.Group>
                <Form.Select
                  id="cidadeSelect"
                  value={selectedCidade}
                  onChange={handleCidadeChange}
                >
                  <option value="">Selecione a cidade</option>
                  {cities.map(cidade => (
                    <option key={cidade.id} value={cidade.nome}>
                      {cidade.nome}
                    </option>
                  ))}
                </Form.Select>
                <Form.Label htmlFor="cidadeSelect">Cidade</Form.Label>
              </Form.Group>
            )}

            <Col className="d-flex justify-content-end">
              <Button
                variant="outline-secondary"
                onClick={handleClear}
                className="me-2"
              >
                Limpar
              </Button>
              <Button
                variant="primary"
                onClick={handleFilter}
              >
                Filtrar
              </Button>
            </Col>
          </div>
        </Col>

        <Col lg="9">
          <ResultadoBusca filteredWorkers={filteredWorkers} />
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;