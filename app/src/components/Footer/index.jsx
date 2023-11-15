import React, { useState } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import { ChatRightDots, Whatsapp } from 'react-bootstrap-icons';
import { FaWhatsapp } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const links = [
  { href: '/contato', icone: <ChatRightDots />, texto: 'Contato' },
  { href: 'https://web.whatsapp.com/send?phone=+5522997249606&text=Ol%C3%A1%2C%20, gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20site!', icone: <Whatsapp />, texto: 'WhatsApp' },
];

const Footer = () => {
  const [emailNewsletter, setEmailNewsletter] = useState('');
  const [nomeNewsletter, setNomeNewsletter] = useState('');

  const handleSubmitNewsletter = (event) => {
    event.preventDefault();

    fetch('http://localhost/match-servicos/api/newsletter/criar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailNewsletter,
        nome: nomeNewsletter
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const updateNameInput = ({ target }) => {
    const value = target.value;

    setNomeNewsletter(value);
  }

  const updateEmailInput = ({ target }) => {
    const value = target.value;

    setEmailNewsletter(value);
  }

  return (
    <footer className="text-center text-lg-start py-5 border-top border-3">
      <Container className="p-4">
        <Row>
          <Col md={12} lg={6} className="mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-4">Match Serviços</h5>
            <ul className="list-unstyled mb-4">
              {links.map((link, index) => {
                const { href, icone, texto } = link;

                return (
                  <li key={index} className="mb-4">
                    <Link
                      to={href}
                      className="text-decoration-none text-black fs-5"
                    >{icone} {texto}</Link>
                  </li>
                )
              })}
            </ul>
          </Col>

          <Col md={12} lg={4} className="mb-4 mb-lg-0 text-end ms-auto">
            <h5 className="text-uppercase mb-4">Inscreva-se para receber novidades</h5>
            <Form onSubmit={handleSubmitNewsletter}>
              <Form.Group className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="Nome"
                  className="mb-3"
                  onChange={updateNameInput}
                />
                <Form.Control
                  type="email"
                  placeholder="Email"
                  onChange={updateEmailInput}
                />
              </Form.Group>
              <Button
                variant="success"
                as="input"
                type="submit"
                value="Inscrever-se"
              />
            </Form>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;