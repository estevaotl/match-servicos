import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../contexts/Auth';
import { Modal, Button } from 'react-bootstrap';

const Profile = () => {
  const { idCliente } = useAuth();
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLogged, setIsLogged] = useState(sessionStorage.getItem('idCliente') !== null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const currentURL = window.location.href;
  const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${apiURL}/clientes/obter/${id}`);
        const data = await response.json();
        setProfileData(data.cliente);
      } catch (error) {
        console.error('Erro ao obter dados do perfil:', error);
      }
    };

    fetchProfileData();
  }, [apiURL, id]);

  const enviarRequisicao = async () => {
    if (!isLogged) {
      alert("Faça login para entrar em contato");
      navigate('/login');
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
          idCliente: idCliente
        })
      });

      const data = await response.json();
      console.log('Requisição enviada:', data);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleWhatsappClick = () => {
    if (sessionStorage.getItem('ehPrestadorServicos') === 'true') {
      alert("Não é possível realizar essa opção. Você é um prestador de serviços!");
    } else {
      if (!isLogged) {
        alert("Faça login para entrar em contato");
        navigate('/login');
      } else {
        setShowConfirmation(true);
      }
    }
  };

  const handleConfirmation = () => {
    setShowConfirmation(false);
    window.open(getWhatsappLink(), '_blank');
    enviarRequisicao();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const getWhatsappLink = () => {
    const whatsappMessage = profileData ? `Olá ${profileData.nome}. Vi seu perfil no site e gostei dos seus serviços prestados. Gostaria de solicitar um orçamento. Como posso proceder?` : '';
    return profileData ? `https://api.whatsapp.com/send?phone=${profileData.whatsapp}&text=${encodeURIComponent(whatsappMessage)}` : '';
  };

  const renderProfileInfo = () => {
    if (!profileData) {
      return <p>Carregando perfil...</p>;
    }

    return (
      <div className="profile">
        <h2 className="mb-3">{profileData.nome}</h2>
        <p className="mb-2"><strong>Email:</strong> {profileData.email}</p>
        <p className="mb-2"><strong>Serviços Prestados:</strong> {profileData.servicosPrestados}.</p>
        <p className="mb-2"><strong>WhatsApp:</strong> {profileData.whatsapp}</p>
        <p className="mb-2"><strong>Gênero:</strong> {profileData.genero}</p>
        {profileData.endereco && profileData.endereco.length > 0 && (
          <>
            <p className="mb-2"><strong>Cep:</strong> {profileData.endereco[0].cep}</p>
            <p className="mb-2"><strong>Endereço:</strong> {profileData.endereco[0].rua}  {profileData.endereco[0].numero} {profileData.endereco[0].bairro} {profileData.endereco[0].cidade}</p>
          </>
        )}
        <button
          className="btn btn-success contact-button"
          onClick={handleWhatsappClick}
        >
          {/* <FontAwesomeIcon icon={faWhatsapp} className="me-2" /> */}
          Entrar em Contato
        </button>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <main className="mt-4">
        {renderProfileInfo()}

        <Modal show={showConfirmation} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Ao continuar, esteja ciente que uma ordem de serviço será gerada caso não existe nenhuma criada anteriormente. <br/><br/>Essa ordem de serviço criada será utilizada como controle pelo profissional, via painel do cliente do mesmo. <br/><br/>Você receberá um email para controle com essa OS criada e quando a mesma for finalizada.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirmation}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default Profile;