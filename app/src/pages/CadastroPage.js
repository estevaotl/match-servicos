import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import '../css/cadastro-page.css';
import logo from '../imagens/logo.png'; // Importe o caminho da imagem corretamente
import FooterPage from '../componentes/FooterPage';

const CadastroPage = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [genero, setGenero] = useState('');
    const [senha, setSenha] = useState('');
    const [prestadorDeServicos, setPrestadorDeServicos] = useState('');
    const [documento, setDocumento] = useState('');
    const [inscricaoEstadual, setInscricaoEstadual] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [situacaoTributaria, setSituacaoTributaria] = useState('');

    const handleChangeDocumento = (event) => {
        const { value } = event.target;
        setDocumento(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Lógica para enviar os dados do formulário para o servidor
        console.log('Dados do formulário enviados:', { nome, email, dataNascimento, telefone, whatsapp, genero, senha });
    };

    const renderCamposAdicionais = () => {
        if (documento.length === 11) {
          // CPF
            return null;
        } else if (documento.length === 14) {
            // CNPJ
            return (
                <div>
                <div className="mb-3">
                    <label htmlFor="inscricaoEstadual" className="form-label">Inscrição Estadual:</label>
                    <input type="text" className="form-control" id="inscricaoEstadual" value={inscricaoEstadual} onChange={(e) => setInscricaoEstadual(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="razaoSocial" className="form-label">Razão Social:</label>
                    <input type="text" className="form-control" id="razaoSocial" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="situacaoTributaria" className="form-label">Situação Tributária:</label>
                    <select className="form-select" id="situacaoTributaria" value={situacaoTributaria} onChange={(e) => setSituacaoTributaria(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="contribuinte">Contribuinte</option>
                    <option value="naoContribuinte">Não Contribuinte</option>
                    <option value="isento">Isento</option>
                    </select>
                </div>
                </div>
            );
        } else {
            return null;
        }
    };

    return (
        <div>
            <header id="headerCadastroPage">
                <img src={logo} alt="Logo" />
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Página Inicial | Match Serviços</Link>
                        </li>
                        <li>
                            <Link to="/login">Entrar na sua conta</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <article id="articleCadastroPage">
                <div>
                    <h1>CADASTRO</h1> <br />
                    <form onSubmit={handleSubmit}>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="nome" className="form-label">Nome:</label>
                            <input type="text" className="form-control" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="prestadorDeServicos" className="form-label">Prestador de Serviços:</label>
                            <select className="form-select" id="prestadorDeServicos" value={prestadorDeServicos} onChange={(e) => setPrestadorDeServicos(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value="prestadorSim">Sim</option>
                            <option value="prestadorNao">Não</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="documento" className="form-label">CPF/CNPJ:</label>
                            <InputMask mask="999.999.999-99" maskChar={null} className="form-control" id="documento" value={documento} onChange={handleChangeDocumento} />
                        </div>
                        {renderCamposAdicionais()}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="dataNascimento" className="form-label">Data de Nascimento:</label>
                            <input type="date" className="form-control" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="telefone" className="form-label">Telefone:</label>
                            <input type="tel" className="form-control" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="whatsapp" className="form-label">WhatsApp:</label>
                            <input type="tel" className="form-control" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="genero" className="form-label">Gênero:</label>
                            <select className="form-select" id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value="feminino">Feminino</option>
                            <option value="masculino">Masculino</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="senha" className="form-label">Senha:</label>
                            <input type="password" className="form-control" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-success">Cadastrar</button>
                    </form>
                </div>
            </article>

            <FooterPage></FooterPage>
        </div>
    );
};

export default CadastroPage;