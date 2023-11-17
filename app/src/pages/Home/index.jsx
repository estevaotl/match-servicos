import React, { useEffect, useState } from 'react';
import Hero from '../../components/Hero';
import CarrosselPrestadorServicos from '../../components/CarrosselPrestadorServicos';

const HomePage = () => {
  const [prestadoresServicos, setPrestadoresServicos] = useState([]);

  const currentURL = window.location.href;
  const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  useEffect(() => {
    fetchPrestadoresServicos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
