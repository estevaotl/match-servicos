import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardPrestadorServicos from '../../components/CardPrestadorServicos'; // Caminho relativo para o arquivo Card.js
import Carousel from 'react-bootstrap/Carousel';
import { useAuth } from '../../contexts/Auth';
import { Container } from 'react-bootstrap';
import Hero from '../../components/Hero';
import CarrosselPrestadorServicos from '../../components/CarrosselPrestadorServicos';

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
      const { cliente } = await response.json();

      cliente.forEach(prestador => {
        prestador.imagemPerfil = prestador.imagemPerfil.length > 0
          ? `${apiURL}/imagem/ler/${prestador.imagemPerfil[0].nomeArquivo}`
          : `${apiURL}/imagem/ler/icone_person.png`;


        prestador.servicosPrestados = prestador.servicosPrestados.split(', ');
      });

      setPrestadoresServicos(cliente);
    } catch (error) {
      console.error('Erro ao obter as ordens de serviço:', error);
    }
  };

  return (
    <>
      <Hero />

      <CarrosselPrestadorServicos
        prestadoresServicos={prestadoresServicos}
      />
    </>
  );
};

export default HomePage;
