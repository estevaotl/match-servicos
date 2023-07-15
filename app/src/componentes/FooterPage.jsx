import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/card.css'; // Caminho relativo para o arquivo card.css

const FooterPage = () => {
    const [emailNewsletter, setEmailNewsletter] = useState('');

    const handleSubmitNewsletter = (event) => {
        event.preventDefault();

        fetch('http://127.0.0.1:8000/match-servicos/api/newsletter/inscricao', {
            method: 'POST', // ou 'GET', 'PUT', 'DELETE', etc., dependendo do tipo de requisição que você deseja fazer
            headers: {
                'Content-Type': 'application/json',
                // Aqui você pode adicionar quaisquer outros cabeçalhos necessários
            },
            body: JSON.stringify({
                // Aqui você pode adicionar os dados que deseja enviar no corpo da requisição
                // Por exemplo, se estiver enviando um objeto com os campos 'nome' e 'email':
                email: emailNewsletter
            })
        })
        .then(response => response.json())
            .then(data => {
             // Aqui você pode lidar com a resposta da API
            console.log(data);
        })
        .catch(error => {
            // Aqui você pode lidar com erros de requisição
            console.error(error);
        });
    };

    return (
        <footer id="footerLoginPage">
            <nav>
                <ul>
                    <li>
                        <Link to="/contato">Contato</Link>
                    </li>
                    <li>
                        <a href='email'>Email</a>
                    </li>
                    <li>
                        <a href='https://web.whatsapp.com/send?phone=+5522997249606&text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20site!' target='_blank'>(22) 99724-9606</a>
                    </li>
                </ul>
            </nav>

            <div>
                <form onSubmit={handleSubmitNewsletter}>
                    <div className="newsletter-container">
                        <p className="newsletter-text">Não perca novidades</p>
                        <div>
                            <input type="text" id="emailNewsletter" value={emailNewsletter} onChange={(e) => setEmailNewsletter(e.target.value)} />
                            <button type="submit" className="btn btn-success">Subscribe</button>
                        </div>
                    </div>
                </form>
            </div>
        </footer>
    );
};

export default FooterPage;