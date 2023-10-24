import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [signed, setSigned] = useState(false);
  const [idCliente, setIdCliente] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [ehPrestadorServicos, setEhPrestadorServicos] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    const idClienteStorage = sessionStorage.getItem('idCliente');
    if (idClienteStorage) {
      setIdCliente(idClienteStorage);
      setSigned(true);
    }

    const nomeCliente = sessionStorage.getItem('nomeCliente');
    if (nomeCliente) {
      setNomeCliente(nomeCliente);
    }

    const ehPrestadorServicos = sessionStorage.getItem('ehPrestadorServicos');
    if (ehPrestadorServicos) {
      setEhPrestadorServicos(ehPrestadorServicos);
    }

    const cidade = sessionStorage.getItem('cidade');
    if (cidade) {
      setCidade(cidade);
    }

    const estado = sessionStorage.getItem('estado');
    if (estado) {
      setEstado(estado);
    }
  }, []);

  function saveUserSate(idCliente, nomeCliente, ehPrestadorServicos, estado, cidade) {
    sessionStorage.setItem('idCliente', idCliente);
    setIdCliente(idCliente);

    sessionStorage.setItem('nomeCliente', nomeCliente);
    setNomeCliente(nomeCliente);

    sessionStorage.setItem('ehPrestadorServicos', ehPrestadorServicos);
    setEhPrestadorServicos(ehPrestadorServicos);

    sessionStorage.setItem('estado', estado);
    setEstado(estado);

    sessionStorage.setItem('cidade', cidade);
    setCidade(cidade);

    setSigned(true);
  }

  async function signOut() {
    setSigned(false);
    sessionStorage.removeItem('idCliente');
    sessionStorage.removeItem('nomeCliente');
    sessionStorage.removeItem('ehPrestadorServicos');
    sessionStorage.removeItem('estado');
    sessionStorage.removeItem('cidade');
    setIdCliente(false);
    setNomeCliente(false);
    setEhPrestadorServicos(false);
    setEstado(false);
    setCidade(false);

    window.location.reload();
  }

  return (
    <AuthContext.Provider
      value={{
        signed,
        saveUserSate,
        signOut,
        idCliente,
        nomeCliente,
        ehPrestadorServicos,
        estado,
        cidade
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}