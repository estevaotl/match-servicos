import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import CadastroPage from './pages/Cadastro';
import LoginPage from './pages/Login';
import MinhaContaPage from './pages/MinhaConta';
import BuscaPage from './pages/Busca';
import ProfilePage from './pages/Profile';
import ContatoPage from './pages/Contato';
import Footer from './components/Footer'
import Header from './components/Header';
import { AuthProvider } from './contexts/Auth';
import './App.scss';
import 'aos/dist/aos.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main>
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
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
