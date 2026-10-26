import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import HomePage from './pages/Home';
import CadastroPage from './pages/Cadastro';
import LoginPage from './pages/Login';
import MinhaContaPage from './pages/MinhaConta';
import BuscaPage from './pages/Busca';
import ProfilePage from './pages/Profile';
import ContatoPage from './pages/Contato';
import Footer from './componentes/Footer'
import "./App.css";
import Header from './componentes/Header';
import { AuthProvider } from './contexts/Auth';

function RouteScroll() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (!hash && navigationType !== 'POP') window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);
  return null;
}

const App = () => {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Ir para o conteúdo</a>
      <Router>
        <RouteScroll />
        <AuthProvider>
          <Header/>
          <main className='main-container' id='main-content' tabIndex={-1}>
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
