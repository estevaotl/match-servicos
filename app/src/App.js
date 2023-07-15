import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CadastroPage from './pages/CadastroPage';
import LoginPage from './pages/LoginPage';
import MinhaContaPage from './pages/MinhaContaPage';
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
        </Routes>
      </Router>
    </div>
  );
};

export default App;
