import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../contexts/Auth';

const TrabalhadorCard = ({ key, worker }) => {
    const whatsappMessage = encodeURIComponent(`Olá ${worker.nome}. Vi seu perfil no site e gostei dos seus serviços prestados. Gostaria de solicitar um orçamento. Como posso proceder?`);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${worker.whatsapp}&text=${whatsappMessage}`;
    const { idCliente, ehPrestadorServicos } = useAuth();

    const [isLogged, setIsLogged] = useState(sessionStorage.getItem('idCliente') !== null);
    const navigate = useNavigate();

    const currentURL = window.location.href;
    const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

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
                    idTrabalhador: worker.id,
                    idCliente: idCliente
                })
            });

            const data = await response.json();
            console.log('Requisição enviada:', data);
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const handleWhatsappClick = (event) => {
        if(ehPrestadorServicos){
            event.preventDefault(); // Impede o link de abrir a aba do WhatsApp
            alert("Não é possivel realizar essa opção. Você é um prestador de serviços!");
        } else {
            if (!isLogged) {
                event.preventDefault(); // Impede o link de abrir a aba do WhatsApp
                alert("Faça login para entrar em contato");
                navigate('/login');
            } else {
                alert("Ao continuar, esteja ciente que uma ordem de serviço será gerada caso não existe nenhuma criada anteriormente. \nEssa ordem de serviço criada será utilizada como controle pelo profissional, via painel do cliente do mesmo. \nVocê receberá um email para controle com essa OS criada e quando a mesma for finalizada.");

                // Abre o link do WhatsApp em uma nova aba
                window.open(whatsappLink, '_blank');

                enviarRequisicao();
            }
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
                <Link to={`/profile/${worker.id}`} className="btn btn-primary mb-2">
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