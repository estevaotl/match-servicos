import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.css';

const Profile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);

  const currentURL = window.location.href;
  const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  useEffect(() => {
    fetch(`${apiURL}/clientes/obter/${id}`)
      .then((response) => response.json())
      .then((data) => setProfileData(data.cliente))
      .catch((error) => console.error('Erro ao obter dados do perfil:', error));
  }, [id]);

  return (
    <div className="profile-container">
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
                <div key={index} className="profile-image">
                  <img
                    src={`${apiURL}/imagem/ler/${imagem.nomeArquivo}`}
                    alt={`Descrição da imagem ${index + 1}`}
                    className="rounded-circle ball-image-inner"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Carregando perfil...</p>
        )}
      </main>

    </div>
  );
};

export default Profile;