import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Profile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);

  const whatsappMessage = profileData ? `Olá ${profileData.nome}. Vi seu perfil no site e gostei dos seus serviços prestados. Gostaria de solicitar um orçamento. Como posso proceder?` : '';
  const whatsappLink = profileData ? `https://api.whatsapp.com/send?phone=${profileData.whatsapp}&text=${encodeURIComponent(whatsappMessage)}` : '';

  const [isLogged, setIsLogged] = useState(sessionStorage.getItem('idCliente') !== null);
  const navigate = useNavigate();

  const currentURL = window.location.href;
  const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  useEffect(() => {
    fetch(`${apiURL}/clientes/obter/${id}`)
      .then((response) => response.json())
      .then((data) => setProfileData(data.cliente))
      .catch((error) => console.error('Erro ao obter dados do perfil:', error));
  }, [id]);

  const enviarRequisicao = async () => {
    if (!isLogged) {
      alert("Faça login para entrar em contato");
      navigate('/login'); // Usando navigate para redirecionar
      return;
    }

    try {
        const response = await fetch(`${apiURL}/ordemServico/criar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idTrabalhador: profileData.id,
            idCliente: id
          })
        });

        const data = await response.json();
        console.log('Requisição enviada:', data);
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
  };

  const handleWhatsappClick = (event) => {
    if (!isLogged) {
      event.preventDefault(); // Impede o link de abrir a aba do WhatsApp
      alert("Faça login para entrar em contato");
      navigate('/login');
    } else {
      // Abre o link do WhatsApp em uma nova aba
      window.open(whatsappLink, '_blank');

      enviarRequisicao();
    }
  };

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

            <a
              href={whatsappLink} // Mantém o atributo href para o link do WhatsApp
              className="btn btn-success contact-button"
              onClick={handleWhatsappClick} // Usa a função de tratamento de clique personalizada
              target='_blank'
              rel='noopener noreferrer'
            >
              <FontAwesomeIcon icon={faWhatsapp} className="me-2" />
              Entrar em Contato
            </a>
          </div>
        ) : (
          <p>Carregando perfil...</p>
        )}
      </main>

    </div>
  );
};

export default Profile;
