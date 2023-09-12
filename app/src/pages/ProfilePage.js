import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FooterPage from '../componentes/FooterPage';
import CardPrestadorServicos from '../componentes/CardPrestadorServicos';
import '../css/profile-page.css';

const Profile = () => {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        // Faz a requisição à API usando o ID fornecido
        fetch(`http://localhost/match-servicos/api/clientes/obter/${id}`)
            .then((response) => response.json())
            .then((data) => setProfileData(data.cliente))
            .catch((error) => console.error('Erro ao obter dados do perfil:', error));
    }, [id]);

    return (
        <div className="container">
            <header className="mt-4 header-background d-flex justify-content-between align-items-center">
                <div className="text-white title-logo">
                    Match Serviços
                </div>
                <nav>
                    <ul className="list-unstyled">
                        <li className="mb-2">
                            <Link to="/" className="text-decoration-none text-dark d-block">Página Inicial | Match Serviços</Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/cadastrar" className="text-decoration-none text-dark d-block">Cadastrar-se</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="mt-4">
                {profileData ? (
                    <div className="profile">
                        <h2 className="mb-3">{profileData.nome}</h2>
                        <p className="mb-2"><strong>Email:</strong> {profileData.email}</p>
                        <p className="mb-2"><strong>Serviços Prestados:</strong> {profileData.servicosPrestados}</p>
                        <p className="mb-2"><strong>WhatsApp:</strong> {profileData.whatsapp}</p>
                        <p className="mb-2"><strong>Gênero:</strong> {profileData.genero}</p>
                        <div className="image-gallery">
                            {profileData.imagem.map((imagem, index) => (
                                <CardPrestadorServicos
                                    imageSrc={`http://localhost/match-servicos/api/imagem/ler/${imagem.nomeArquivo}`}
                                    alt={`Descrição da imagem ${index + 1}`}
                                    key={index}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Carregando perfil...</p>
                )}
            </main>

            <FooterPage />
        </div>
    );
};

export default Profile;
