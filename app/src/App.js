import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import CadastroPage from './pages/Cadastro';
import LoginPage from './pages/Login';
import MinhaContaPage from './pages/MinhaConta';
import BuscaPage from './pages/Busca';
import ProfilePage from './pages/ProfilePage';
import ContatoPage from './pages/Contato';
import Footer from './componentes/Footer'
import "./App.css";
import Header from './componentes/Header';
import { AuthProvider } from './contexts/Auth';

const App = () => {
  return (
    <div className="container">
      <Router>
        <AuthProvider>
          <Header/>
          <main className='main-container'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cadastrar" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/minha-conta" element={<MinhaContaPage />} />
            <Route path="/busca" element={<BuscaPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/contato" element={<ContatoPage />} />
          </Routes>
          </main>
          <Footer/>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
