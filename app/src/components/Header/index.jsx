import React, { useMemo } from 'react';
import { useLocation, } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { BoxArrowRight, List } from 'react-bootstrap-icons';

function Header() {
  const location = useLocation();
  const { signed, nomeCliente, signOut } = useAuth();

  const isHomePage = useMemo(() => {
    return location.pathname === '/';
  }, [location])

  return (
    <Navbar sticky="top" expand="lg" bg="light">
      <Container>
        <Navbar.Brand href="/">Match Serviços</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="d-flex justify-content-between w-100">
            {signed ? (
              <Container fluid className="d-flex  flex-column flex-lg-row flex-align-end">
                <Navbar.Brand className="p-1">Olá, {nomeCliente}</Navbar.Brand>
                {!isHomePage &&
                  <Nav.Link href="/">Página Inicial</Nav.Link>
                }
                <Nav.Link href="/minha-conta">Minha Conta</Nav.Link>

                <Button variant="outline-danger" onClick={signOut}>
                  <BoxArrowRight className="me-2" /> Sair
                </Button>
              </Container>
            ) : (
              <Container fluid className="d-flex  flex-column flex-lg-row align-items-end justify-content-end">
                {!isHomePage &&
                  <Nav.Link className="d-none d-lg-block" href="/">Página Inicial</Nav.Link>
                }
                <Nav.Link href="/cadastrar">Cadastrar-se </Nav.Link>
                <Nav.Link href="/login">Entrar na sua conta</Nav.Link>
              </Container>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header;