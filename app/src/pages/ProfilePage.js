import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import logo from '../imagens/logo.png'; // Importe o caminho da imagem corretamente
import FooterPage from '../componentes/FooterPage';
import '../css/profile-page.css'; // Importe o arquivo CSS para estilização específica da página
import CardPrestadorServicos from '../componentes/CardPrestadorServicos'; // Caminho relativo para o arquivo Card.js

const Profile = () => {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        // Faz a requisição à API usando o ID fornecido
        fetch(`http://localhost/match-servicos/api/clientes/obter/${id}`)
            .then(response => response.json())
            .then(data => setProfileData(data.cliente))
            .catch(error => console.error('Erro ao obter dados do perfil:', error));
    }, [id]);

    return (
        <div className="App">
            <header id="headerMinhaContaPage">
                <img src={logo} alt="Logo" />
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Página Inicial | Match Serviços</Link>
                        </li>
                        <li>
                            <Link to="/cadastrar">Cadastrar-se</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <article id="articleMinhaContaPage">
                {profileData ? (
                    <div>
                        <h2>{profileData.nome}</h2>
                        <p>{profileData.email}</p>
                        <p>{profileData.servicosPrestados}</p>
                        <p>{profileData.whatsapp}</p>
                        <p>{profileData.genero}</p>
                        {profileData.imagem.map((imagem, index) => (
                            <CardPrestadorServicos imageSrc={`http://localhost/match-servicos/api/imagem/ler/${imagem.nomeArquivo}`} alt={`Descrição da imagem ${index + 1}`} key={index}/>
                        ))}
                    </div>
                ) : (
                    <p>Carregando perfil...</p>
                )}
            </article>

            <FooterPage></FooterPage>
        </div>
    );
}

export default Profile;