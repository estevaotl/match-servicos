import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../Header';
import { FiArrowUpRight } from 'react-icons/fi';
import './style.css';

const Footer = () => <footer className="match-footer">
  <div className="footer-main"><div><Link className="brand-link" to="/" aria-label="Match Serviços, página inicial"><BrandMark /></Link><p>Bons encontros.<br />Coisas bem feitas.</p></div><div className="footer-links"><Link to="/busca">Encontrar serviços</Link><Link to="/cadastrar?tipo=profissional">Oferecer serviços</Link><Link to="/contato">Fale com a gente <FiArrowUpRight aria-hidden="true" /></Link></div><span className="footer-note">Feito para aproximar<br />ideias e talentos.</span></div>
  <div className="footer-bottom"><span>© {new Date().getFullYear()} Match Serviços</span><span>O próximo bom encontro pode ser aqui.</span></div>
</footer>;
export default Footer;
