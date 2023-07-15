import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/login-page.css';
import logo from '../imagens/logo.png'; // Importe o caminho da imagem corretamente
import FooterPage from '../componentes/FooterPage';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Lógica para enviar os dados do formulário para o servidor
        console.log('Dados do formulário enviados:', { email, senha });
    };

    return (
        <div>
            <header id="headerLoginPage">
                <img src={logo} alt="Logo" />
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Página Inicial | Match Serviços</Link>
                        </li>
                        <li>
                            <Link to="/cadastrar">Cadastrar-se</Link>
                        </li>
                    </ul>
                </nav>
            </header>

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

            <FooterPage></FooterPage>
        </div>
    );
};

export default LoginPage;