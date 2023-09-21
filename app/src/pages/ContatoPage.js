import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import FooterPage from '../componentes/FooterPage';
import { Link } from 'react-router-dom'; // Importe o useNavigate

const ContatoPage = () => {
    const [idCliente, setIdCliente] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');

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

        // Simule o envio de e-mail (substitua isso com sua própria lógica de envio de e-mail)
        console.log('Enviando e-mail com os seguintes dados:', formData);
    };

    useEffect(() => {
        // Verifica se o idCliente está salvo na sessionStorage
        const idClienteStorage = sessionStorage.getItem('idCliente');
        if (idClienteStorage) {
            setIdCliente(idClienteStorage);
        }

        const nomeCliente = sessionStorage.getItem('nomeCliente');
        if (nomeCliente) {
            setNomeCliente(nomeCliente);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('idCliente'); // Supondo que 'idCliente' é o item que você deseja limpar
        sessionStorage.removeItem('nomeCliente');
        setIdCliente(false); // Atualizar o estado para indicar que o cliente não está mais logado
        setNomeCliente(false);
    };

    return (
        <div className="App">
            <header className="mt-4 header-background d-flex justify-content-between align-items-center">
                <div className="text-white title-logo">
                    Match Serviços
                </div>
                <nav>
                    <ul className="list-unstyled">
                        {idCliente ? (
                            <>
                                <li className="mb-2">Olá, {nomeCliente}.</li>
                                <li className="mb-2">
                                    <Link to="/" className="text-decoration-none text-dark d-block">Página Inicial</Link>
                                </li>
                                <li className="mb-2">
                                    <Link className="text-decoration-none text-dark d-block" to="/minha-conta">Entrar na sua conta</Link>
                                </li>
                                <li className="mb-2">
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </>

                        ) : (
                            // Renderiza o menu padrão quando idCliente não está presente
                            <>
                                <li className="mb-2">
                                    <Link to="/" className="text-decoration-none text-dark d-block">Página Inicial</Link>
                                </li>
                                <li className="mb-2">
                                    <Link className="text-decoration-none text-dark d-block" to="/cadastrar">Cadastrar-se</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <article id="articleMinhaContaPage">

                <h1>Entre em Contato</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
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

                    <Form.Group controlId="formEmail">
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

                    <Form.Group controlId="formMessage">
                        <Form.Label>Mensagem</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="message"
                            placeholder="Sua mensagem"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Enviar
                    </Button>
                </Form>
            </article>
            <FooterPage></FooterPage>
        </div>
    );
};

export default ContatoPage;
