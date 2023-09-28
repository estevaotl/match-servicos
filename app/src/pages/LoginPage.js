import React, { useState } from 'react';
import '../css/login-page.css';
import {  useNavigate } from 'react-router-dom'; // Importe o useNavigate

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('http://localhost:8080/match-servicos/api/clientes/logar', {
            method: 'POST', // ou 'GET', 'PUT', 'DELETE', etc., dependendo do tipo de requisição que você deseja fazer
            headers: {
                'Content-Type': 'application/json',
                // Aqui você pode adicionar quaisquer outros cabeçalhos necessários
            },
            body: JSON.stringify({
                // Aqui você pode adicionar os dados que deseja enviar no corpo da requisição
                // Por exemplo, se estiver enviando um objeto com os campos 'nome' e 'email':
                email : email,
                senha : senha
            })
        })
        .then(response => response.json())
            .then(data => {
                sessionStorage.setItem('idCliente', data.id);
                sessionStorage.setItem('nomeCliente', data.nome);
                navigate('/'); // Use navigate('/') para redirecionar para a página inicial
        })
        .catch(error => {
            // Aqui você pode lidar com erros de requisição
            console.error(error);
        });
    };

    return (
        <div>

            <article id="articleLoginPage">
                <div>
                    <h1>LOGIN</h1> <br />
                    <form onSubmit={handleSubmit}>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="senha" className="form-label">Senha:</label>
                            <input type="password" className="form-control" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                        </div>
                        <div className="button-container-article-login-page">
                            <button type="submit" className="btn btn-success larger-button">Entrar</button>
                            <button type="submit" className="btn btn-success larger-button">Esqueceu sua senha?</button>
                        </div>
                    </form>
                </div>
            </article>

        </div>
    );
};

export default LoginPage;