import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import icone_engenharia from '../../imagens/icone_engenharia.png'; // Importe o caminho da imagem corretamente
import CardPrestadorServicos from '../../componentes/CardPrestadorServicos'; // Caminho relativo para o arquivo Card.js
import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';
import { prestadoresServicosMocked } from './mock';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../contexts/Auth';
import Autocomplete from '../../componentes/AutoComplete';

const ITEMS_PER_PAGE = 3; // Número de itens por página no carrossel

const HomePage = () => {
  const { idCliente, estado, cidade } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const [prestadoresServicos, setPrestadoresServicos] = useState([]);

  const currentURL = window.location.href;
  const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  useEffect(() => {
    fetchPrestadoresServicos();
  }, []);

  const fetchPrestadoresServicos = async () => {
    try {
      const response = await fetch(`${apiURL}/clientes/obterParaCarrossel`);
      const data = await response.json();
      setPrestadoresServicos(data.cliente);
    } catch (error) {
      console.error('Erro ao obter as ordens de serviço:', error);
    }
  };

  const handleSearch = () => {
    if (searchValue) {
      var url = `/busca?q=${searchValue}`;

      if(idCliente){
        if(estado.length > 0){
          url += `&estado=${estado}`;
        }

        if(cidade.length > 0){
          url += `&cidade=${cidade}`;
        }
      }

      navigate(url);
    }
  };

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const paginatedData = useMemo(() => chunkArray(prestadoresServicos, ITEMS_PER_PAGE), [prestadoresServicos]);
  // const paginatedData = useMemo(() => chunkArray(prestadoresServicosMocked, ITEMS_PER_PAGE), []);

  return (
    <main className='home-container'>
      <section id="sectionHomePage">
        <span>
          BEM VINDO AO MATCH SERVIÇOS. <br />
          O PORTAL PARA ENCONTRAR O <br />
          PRESTADOR DE SERVIÇOS IDEAL
        </span>
        <img src={icone_engenharia} alt="Logo" />
      </section>

      <Autocomplete
        onSelectJob={selectedJob => setSearchValue(selectedJob)}
        onSearch={handleSearch}
      />

      <article id="articleCardTrabalhadorHomePage">
        <Carousel className='carrossel'>
          {paginatedData.map((pageData, index) => (
            <Carousel.Item className='carrossel-item' key={index}>
              <div className='carrossel-content'>
                {pageData.map((prestador, prestadorIndex) => (
                  <CardPrestadorServicos
                    imageSrc={
                      prestador.imagemPerfil.length > 0
                        ? `${apiURL}/imagem/ler/${prestador.imagemPerfil[0].nomeArquivo}`
                        : `${apiURL}/imagem/ler/icone_person.png`
                    }
                    altText={`Imagem de ${prestador.nome}`}
                    profissao={prestador.servicosPrestados}
                    endereco={`${prestador.endereco[0].rua}, ${prestador.endereco[0].numero}, ${prestador.endereco[0].bairro}, ${prestador.endereco[0].cidade}, ${prestador.endereco[0].estado}`}
                    nome={prestador.nome}
                    email={prestador.email}
                    key={prestadorIndex}
                    id={prestador.id}
                  >
                  </CardPrestadorServicos>
                ))}
              </div >
            </Carousel.Item>
          ))}

        </Carousel>
      </article>

    </main>
  );
};

export default HomePage;
