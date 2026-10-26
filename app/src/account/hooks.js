import { useEffect, useRef, useState } from 'react';

export function useAccountAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const pending = useRef(false);
  const active = useRef(true);
  const controller = useRef(null);
  useEffect(() => { active.current = true; return () => { active.current = false; controller.current?.abort(); }; }, []);
  async function run(operation, onSuccess, successMessage) {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError(''); setNotice('');
    const request = new AbortController(); controller.current = request;
    const timeout = setTimeout(() => request.abort(), 15000);
    try { const result = await operation(request.signal); if (active.current) { onSuccess(result); setNotice(successMessage); } }
    catch (failure) { if (active.current) setError(failure.message); }
    finally { clearTimeout(timeout); pending.current = false; if (active.current) setBusy(false); }
  }
  return { busy, error, notice, run, clear: () => { setError(''); setNotice(''); } };
}

export function usePostcodeLookup(setForm, setErrors) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const version = useRef(0);
  const request = useRef(null);
  useEffect(() => () => { version.current += 1; request.current?.abort(); }, []);
  function change(value) {
    version.current += 1; request.current?.abort(); setStatus('idle'); setMessage('');
    setForm(current => ({ ...current, cep: value, rua: '', bairro: '', cidade: '', estado: '' }));
    setErrors(current => ({ ...current, cep: '' }));
  }
  async function find(postcode) {
    const digits = postcode.replace(/\D/g, '');
    if (digits.length !== 8) { setErrors(current => ({ ...current, cep: 'Informe um CEP com 8 números.' })); return; }
    request.current?.abort(); const currentVersion = ++version.current;
    const controller = new AbortController(); request.current = controller;
    const timer = setTimeout(() => controller.abort(), 8000);
    setStatus('loading'); setMessage('');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal });
      if (!response.ok) throw new Error('Consulta indisponível');
      const data = await response.json(); if (currentVersion !== version.current) return;
      if (data.erro) { setStatus('invalid'); setMessage('CEP não encontrado. Confira os números.'); return; }
      if (typeof data.localidade !== 'string' || !data.localidade || typeof data.uf !== 'string' || data.uf.length !== 2) throw new Error('Endereço indisponível');
      setForm(current => ({ ...current, rua: data.logradouro || '', bairro: data.bairro || '', cidade: data.localidade, estado: data.uf }));
      setErrors(current => ({ ...current, cep: '', rua: '', bairro: '', cidade: '', estado: '' }));
      setStatus('found'); setMessage('Endereço encontrado. Confira e complete os dados.');
    } catch (error) { if (currentVersion === version.current) { setStatus('unavailable'); setMessage('A consulta está indisponível. Preencha o endereço manualmente.'); } }
    finally { clearTimeout(timer); }
  }
  return { status, message, change, find };
}
