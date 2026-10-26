import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/Auth';
import './styles.css';

export function BrandMark() {
  return <span className="match-brand"><svg viewBox="0 0 42 38" aria-hidden="true"><path d="M4 28V14a9 9 0 0 1 18 0v14M22 28V14a8 8 0 0 1 16 0v14" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" /><circle cx="38" cy="33" r="3.5" fill="#fbd34b" /></svg><span>match<span>serviços</span></span></span>;
}

function Header() {
  const location = useLocation();
  const { signed, nomeCliente, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <header className="match-header">
    <Link to="/" className="brand-link" aria-label="Match Serviços, página inicial" onClick={closeMenu}><BrandMark /></Link>
    <button className="header-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="match-navigation" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>{menuOpen ? <FiX /> : <FiMenu />}</button>
    <nav id="match-navigation" className={menuOpen ? 'match-navigation is-open' : 'match-navigation'} aria-label="Navegação principal">
      <div className="header-main-links"><Link to="/busca" onClick={closeMenu}>Encontrar um profissional</Link><a href="/#como-funciona" onClick={closeMenu}>Como funciona</a></div>
      <div className="header-account-links">{signed ? <><Link to="/minha-conta" onClick={closeMenu}>Olá, {nomeCliente?.split(' ')[0] || 'você'}</Link><button onClick={() => { closeMenu(); signOut(); }} className="header-signout">Sair</button></> : <><Link to="/login" className={location.pathname === '/login' ? 'is-current' : ''} onClick={closeMenu}>Entrar</Link><Link to="/cadastrar?tipo=profissional" className="header-pro-link" onClick={closeMenu}>Sou profissional <FiArrowUpRight aria-hidden="true" /></Link></>}</div>
    </nav>
  </header>;
}
export default Header;
