import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import Input from '../Input';

const Footer = () => {
  const [emailNewsletter, setEmailNewsletter] = useState('');
  const [nomeNewsletter, setNomeNewsletter] = useState('');

  const handleSubmitNewsletter = (event) => {
    event.preventDefault();

    fetch('http://localhost/match-servicos/api/newsletter/criar', {
      method: 'POST', // ou 'GET', 'PUT', 'DELETE', etc., dependendo do tipo de requisição que você deseja fazer
      headers: {
        'Content-Type': 'application/json',
        // Aqui você pode adicionar quaisquer outros cabeçalhos necessários
      },
      body: JSON.stringify({
        // Aqui você pode adicionar os dados que deseja enviar no corpo da requisição
        // Por exemplo, se estiver enviando um objeto com os campos 'nome' e 'email':
        email: emailNewsletter,
        nome: nomeNewsletter
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
    <footer >
      <nav>
        <ul>
          <li>
            <Link className='contact' to="/contato">Contato</Link>
          </li>
          <li>
            <a href='https://web.whatsapp.com/send?phone=+5522997249606&text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20site!' target='_blank' rel="noreferrer">(22) 99724-9606</a>
          </li>
          <li>
            <span>Endereço: Rua teste Neuro 123 Bairro</span>
          </li>
        </ul>
      </nav>

      <aside>
        <h2 className="newsletter-text">Não perca novidades</h2>
        <form onSubmit={handleSubmitNewsletter}>
            <Input label="Email:" type="text"  value={emailNewsletter} onChange={(e) => setEmailNewsletter(e.target.value)} />
            <Input label="Nome:" type="text"  value={nomeNewsletter} onChange={(e) => setNomeNewsletter(e.target.value)} />
            <button type="submit" className="btn btn-success">Inscrever-se</button>
        </form>
      </aside>
    </footer>
  );
};

export default Footer;