import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Modal, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/Auth';

const TrabalhadorCard = ({ key, worker, navigate }) => {
    const whatsappMessage = encodeURIComponent(`Olá ${worker.nome}. Vi seu perfil no site e gostei dos seus serviços prestados. Gostaria de solicitar um orçamento. Como posso proceder?`);
    const whatsappLink = `https://api.whatsapp.com/send?phone=+55${worker.whatsapp}&text=${whatsappMessage}`;
    const { idCliente } = useAuth();

    const [isLogged, setIsLogged] = useState(sessionStorage.getItem('idCliente') !== null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const enviarRequisicao = async () => {
        if (!isLogged) {
            setAlertMessage("Faça login para entrar em contato");
            return;
        }

        try {
            // Certifique-se de definir apiURL corretamente
            const apiURL = window.location.href.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

            const response = await fetch(`${apiURL}/ordemServico/criar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idTrabalhador: worker.id,
                    idCliente: idCliente
                })
            });

            const data = await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const handleWhatsappClick = () => {
        if (sessionStorage.getItem('ehPrestadorServicos') === 'true') {
            setAlertMessage("Não é possível realizar essa opção. Você é um prestador de serviços!");
        } else {
            if (!isLogged) {
                setAlertMessage("Faça login para entrar em contato");
            } else {
                setShowConfirmation(true);
            }
        }
    };

    const handleConfirmation = () => {
        setShowConfirmation(false);
        window.open(whatsappLink, '_blank');
        enviarRequisicao();
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="card m-2" key={key}>
            <div className="card-body">
                {/* Bootstrap Alert */}
                {alertMessage && (
                    <Alert variant="danger" onClose={() => setAlertMessage('')} dismissible>
                        {alertMessage}
                    </Alert>
                )}

                <h4 className="card-title">{worker.nome}</h4>
                <p className="card-text">Email: {worker.email}</p>
                {worker.endereco && worker.endereco.length > 0 && (
                    <>
                        <p className="card-text">Cep: {worker.endereco[0].cep}</p>
                        <p className="card-text">Endereço: {worker.endereco[0].rua}  {worker.endereco[0].numero} {worker.endereco[0].bairro} {worker.endereco[0].cidade}</p>
                    </>
                )}
                <Link to={`/profile/${worker.id}`} className="btn btn-primary mb-2">
                    Ver Perfil
                </Link>

                <Button
                    onClick={handleWhatsappClick}
                    className="btn btn-success contact-button"
                >
                    <FontAwesomeIcon icon={faWhatsapp} className="me-2" />
                    Entrar em Contato
                </Button>

                {/* React Bootstrap Modal for Confirmation */}
                <Modal show={showConfirmation} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmação</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Ao continuar, esteja ciente que uma ordem de serviço será gerada...
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
            </div>
        </div>
    );
};

export default TrabalhadorCard;
