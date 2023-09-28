import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import FooterPage from '../componentes/FooterPage';

const ContatoPage = () => {

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

    return (
        <div className="App">

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
