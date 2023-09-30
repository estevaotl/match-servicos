import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [signed, setSigned] = useState(false);
  const [idCliente, setIdCliente] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');

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


  }, []);

  function saveUserSate(idCliente, nomeCliente) {
    sessionStorage.setItem('idCliente', idCliente);
    setIdCliente(idCliente);
    sessionStorage.setItem('nomeCliente', nomeCliente);
    setNomeCliente(nomeCliente);
    setSigned(true);
  }
  async function signOut() {
    setSigned(false);
    sessionStorage.removeItem('idCliente');
    sessionStorage.removeItem('nomeCliente');
    setIdCliente(false);
    setNomeCliente(false);
  }

  return (
    <AuthContext.Provider
      value={{
        signed,
        saveUserSate,
        signOut,
        idCliente,
        nomeCliente
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