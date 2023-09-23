import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CadastroPage from './pages/CadastroPage';
import LoginPage from './pages/LoginPage';
import MinhaContaPage from './pages/MinhaContaPage';
import BuscaPage from './pages/BuscaPage';
import ProfilePage from './pages/ProfilePage';
import ContatoPage from './pages/ContatoPage';
import Footer from './componentes/Footer'
import "./App.css";

const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cadastrar" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/minha-conta" element={<MinhaContaPage />} />
          <Route path="/busca" element={<BuscaPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/contato" element={<ContatoPage />} />
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
};

export default App;
