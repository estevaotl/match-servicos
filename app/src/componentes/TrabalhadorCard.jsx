import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const TrabalhadorCard = ({ key, worker }) => {
    const whatsappMessage = encodeURIComponent(`Olá ${worker.nome}. Vi seu perfil no site e gostei dos seus serviços prestados. Gostaria de solicitar um orçamento. Como posso proceder?`);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${worker.whatsapp}&text=${whatsappMessage}`;
    const clienteId = sessionStorage.getItem('idCliente');

    const [isLogged, setIsLogged] = useState(sessionStorage.getItem('idCliente') !== null);
    const navigate = useNavigate();

    const enviarRequisicao = async () => {
        if (!isLogged) {
            alert("Faça login para entrar em contato");
            navigate('/login'); // Usando navigate para redirecionar
            return;
        }

        try {
            const response = await fetch('http://localhost/match-servicos/api/ordemServico/criar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idTrabalhador: worker.id,
                    idCliente: clienteId
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
        <div className="card m-2" key={key}>
            <div className="card-body">
                <h4 className="card-title">{worker.nome}</h4>
                <p className="card-text">Email: {worker.email}</p>
                {worker.endereco && worker.endereco.length > 0 && (
                    <>
                        <p className="card-text">Cep: {worker.endereco[0].cep}</p>
                        <p className="card-text">Endereço: {worker.endereco[0].rua}  {worker.endereco[0].numero} {worker.endereco[0].bairro} {worker.endereco[0].cidade}</p>
                    </>
                )}
                <Link to={`/profile/${worker.id}`} className="btn btn-primary">
                    Ver Perfil
                </Link>

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
        </div>
    );
};

export default TrabalhadorCard;