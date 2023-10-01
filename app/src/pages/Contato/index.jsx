import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './styles.css';
const ContatoPage = () => {
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Remova a chave 'valor' do objeto formData e crie um novo objeto sem ela
    const { valor, ...formDataWithoutValor } = formData;

    // Adicione o campo 'valor' separadamente ao corpo da solicitação
    const requestBody = JSON.stringify({
      ...formDataWithoutValor,
      valor: valor,
    });

    fetch('http://localhost/match-servicos/api/contato/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        return response.json();
      })
      .then((data) => {
        // Definir a mensagem de sucesso
        setMessage('Sucesso ao enviar mensagem de contato');

        // Limpar os campos do formulário manualmente
        setFormData({
          name: '',
          email: '',
          message: '',
        });

        // Limpar a mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      })
      .catch((error) => {
        // Definir a mensagem de erro
        setMessage('Erro ao enviar mensagem de contato: ' + error.message);
        // Limpar a mensagem de erro após 3 segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      });
  };

  return (
    <div className="contact-container">

      <article >
        <h1>Entre em Contato</h1>

        <div className="message">
          {message && (
            <div
              className={
                message.startsWith('Erro')
                  ? 'alert alert-danger'
                  : 'alert alert-success'
              }
            >
              {message}
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit} id="form-contato">
          <Form.Group controlId="formName" className='form-group'>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className='form-group'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Seu email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formMessage" className='form-group'>
            <Form.Label>Mensagem</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              size='sm'
              placeholder="Sua mensagem"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="btn btn-success submit-button" type="submit">
            Enviar
          </Button>
        </Form>
      </article>
    </div>
  );
};

export default ContatoPage;
