import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [signed, setSigned] = useState(false);
  const [idCliente, setIdCliente] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [ehPrestadorServicos, setEhPrestadorServicos] = useState('');

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
  }, []);

  function saveUserSate(idCliente, nomeCliente, ehPrestadorServicos) {
    sessionStorage.setItem('idCliente', idCliente);
    setIdCliente(idCliente);
    sessionStorage.setItem('nomeCliente', nomeCliente);
    setNomeCliente(nomeCliente);
    sessionStorage.setItem('ehPrestadorServicos', ehPrestadorServicos);
    setEhPrestadorServicos(ehPrestadorServicos);
    setSigned(true);
  }
  async function signOut() {
    setSigned(false);
    sessionStorage.removeItem('idCliente');
    sessionStorage.removeItem('nomeCliente');
    sessionStorage.removeItem('ehPrestadorServicos');
    setIdCliente(false);
    setNomeCliente(false);
    setEhPrestadorServicos(false);
  }

  return (
    <AuthContext.Provider
      value={{
        signed,
        saveUserSate,
        signOut,
        idCliente,
        nomeCliente,
        ehPrestadorServicos
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