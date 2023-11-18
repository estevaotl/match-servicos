import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Alert, Card, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/Auth';

const TrabalhadorCard = ({ key, worker }) => {
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
        <Col lg="6">
            <Card className="m-2" key={key}>
                <Card.Body>
                    {/* React-Bootstrap Alert */}
                    {alertMessage && (
                        <Card.Text>
                            <Alert variant="danger" onClose={() => setAlertMessage('')} dismissible>
                                {alertMessage}
                            </Alert>
                        </Card.Text>
                    )}

                    <Card.Title>{worker.nome}</Card.Title>
                    <Card.Text>Email: {worker.email}</Card.Text>
                    {worker.endereco && worker.endereco.length > 0 && (
                        <>
                            <Card.Text>Cep: {worker.endereco[0].cep}</Card.Text>
                            <Card.Text>
                                Endereço: {worker.endereco[0].rua} {worker.endereco[0].numero} {worker.endereco[0].bairro} {worker.endereco[0].cidade}
                            </Card.Text>
                        </>
                    )}

                    <Link to={`/profile/${worker.id}`} className="btn btn-primary me-2">
                        Ver Perfil
                    </Link>

                    <Button variant="success" onClick={handleWhatsappClick}>
                        Entrar em Contato
                    </Button>

                    {/* React Bootstrap Modal for Confirmation */}
                    <Modal show={showConfirmation} onHide={handleCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmação</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Ao continuar, esteja ciente que uma ordem de serviço será gerada...</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleConfirmation}>
                                Confirmar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default TrabalhadorCard;
