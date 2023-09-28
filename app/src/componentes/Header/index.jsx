import React, { useEffect, useMemo, useState } from 'react';

import './styles.css';
import { Link, useLocation, } from 'react-router-dom';

function Header() {
  const [idCliente, setIdCliente] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const location = useLocation();

  useEffect(() => {
    const idClienteStorage = sessionStorage.getItem('idCliente');
    if (idClienteStorage) {
      setIdCliente(idClienteStorage);
    }

    const nomeCliente = sessionStorage.getItem('nomeCliente');
    if (nomeCliente) {
      setNomeCliente(nomeCliente);
    }

  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('idCliente');
    sessionStorage.removeItem('nomeCliente');
    setIdCliente(false);
    setNomeCliente(false);
  };

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
          {idCliente ? (
            <>
              <li className="mb-2">Olá, {nomeCliente}.</li>
              {!isHomePage &&
                <li className="mb-2">
                  <Link to="/" className="text-decoration-none text-dark d-block">Página Inicial</Link>
                </li>
              }
              <li className="mb-2">
                <Link className="text-decoration-none text-dark d-block" to="/minha-conta">Entrar na sua conta</Link>
              </li>
              <li className="mb-2">
                <button className="button" onClick={handleLogout}>Logout</button>
              </li>
            </>

          ) : (
            <>
              {!isHomePage &&
                <li className="mb-2">
                  <Link to="/" className="text-decoration-none text-dark d-block">Página Inicial |</Link>
                </li>
              }
              <li className="mb-2">
                <Link className="text-decoration-none text-dark d-block" to="/cadastrar">Cadastrar-se |</Link>
              </li>
              <li className="mb-2">
                <Link className="text-decoration-none text-dark d-block" to="/login">Entrar na sua conta</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>

  )
}

export default Header;