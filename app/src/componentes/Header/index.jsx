import React, { useMemo } from 'react';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import './styles.css';
import { Link, useLocation, } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';

function Header() {
  const location = useLocation();
  const { signed, nomeCliente, signOut } = useAuth();

  const isHomePage = useMemo(() => {
    return location.pathname === '/'
  }, [location])


  return (
    <header className="main-header">
      <div className="text-white title-logo">
        Match Serviços
      </div>
      <nav>
        <ul className="user-options list-unstyled">
          {signed ? (
            <>
              <li className="mb-2">Olá, {nomeCliente} </li>
              {!isHomePage &&
                <li className="mb-2">
                  <Link to="/" className="header-link">Página Inicial </Link>
                </li>
              }
              <li className="mb-2">
                <Link className="header-link" to="/minha-conta">Minha conta </Link>
              </li>
            </>

          ) : (
            <>
              {!isHomePage &&
                <li className="mb-2">
                  <Link to="/" className="header-link ">Página Inicial </Link>
                </li>
              }
              <li className="mb-2">
                <Link className="header-link" to="/cadastrar">Cadastrar-se </Link>
              </li>
              <li className="mb-2">
                <Link className="header-link" to="/login">Entrar na sua conta</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      {
        signed &&
        <FaArrowRightFromBracket color='red' size={32} onClick={signOut} />
      }

    </header>

  )
}

export default Header;