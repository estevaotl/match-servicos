import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';
import { Modal, Button, Container } from 'react-bootstrap';
import PerfilPrestadorServicos from '../../components/PerfilPrestadorServicos';

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

  return (
    <Container>
      <PerfilPrestadorServicos
        prestador={profileData}
        onClick={handleWhatsappClick}
      />

      <Modal show={showConfirmation} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ao continuar, esteja ciente que uma ordem de serviço será gerada caso não existe nenhuma criada anteriormente. <br /><br />Essa ordem de serviço criada será utilizada como controle pelo profissional, via painel do cliente do mesmo. <br /><br />Você receberá um email para controle com essa OS criada e quando a mesma for finalizada.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleConfirmation}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;