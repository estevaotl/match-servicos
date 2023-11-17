import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';
import { Button, Col, Container, Form, Row } from "react-bootstrap";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { saveUserSate } = useAuth();
  const [errors, setErrors] = useState([]);

  const currentURL = window.location.href;
  const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`${apiURL}/clientes/logar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        senha: senha
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.excecao) {
          setErrors(data.excecao.split('\n'));
        } else {
          saveUserSate(data.id, data.nome, data.ehPrestadorServicos, data.estado, data.cidade)
          navigate('/');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Container style={{
      marginTop: '10rem',
      marginBottom: '10rem'
    }}>
      <h2 className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-5">Login</h2>
      <Form onSubmit={handleSubmit} className="w-75 w-lg-50 m-auto">
        <Row>
          <Form.Group className="form-outline">
            <Form.Control
              id="email"
              type="email"
              placeholder="Seu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Label htmlFor="email">Email</Form.Label>
          </Form.Group>
          <Form.Group className="form-outline">
            <Form.Control
              id="senha"
              type="password"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Form.Label htmlFor="senha">Senha</Form.Label>
          </Form.Group>

          {errors.length > 0 && (
            <div className="alert alert-danger mt-3">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </Row>

        <div className="d-flex justify-content-end mb-5">
          <Button type="submit" className="me-2 a">Entrar</Button>
          <Button type="submit" variant="outline-secondary">Esqueceu sua senha?</Button>
        </div>

      </Form>
    </Container>
  );
};

export default LoginPage;