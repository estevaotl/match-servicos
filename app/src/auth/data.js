import { getApiURL } from '../marketplace/data';

export const digitsOnly = value => String(value || '').replace(/\D/g, '');
export const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export function safeDestination(value) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || Array.from(value).some(character => character.charCodeAt(0) < 32)) return '/';
  try {
    const url = new URL(value, 'https://match.invalid');
    if (url.origin !== 'https://match.invalid' || !/^\/(?:|busca|contato|minha-conta|profile\/[^/]+)$/.test(url.pathname)) return '/';
    return url.pathname + url.search + url.hash;
  } catch (error) { return '/'; }
}

export function formatDocument(value, entity) {
  const number = digitsOnly(value).slice(0, entity === 'empresa' ? 14 : 11);
  return entity === 'empresa' ? number.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/(\d{3})(\d{4})/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2') : number.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
export function formatPhone(value) {
  const number = digitsOnly(value).slice(0, 11);
  if (number.length < 3) return number;
  const middle = number.length > 10 ? 5 : 4;
  return `(${number.slice(0, 2)}) ${number.slice(2, 2 + middle)}${number.length > 2 + middle ? '-' + number.slice(2 + middle) : ''}`;
}
export function formatPostcode(value) { return digitsOnly(value).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2'); }

// O backend existente aceita documentos numéricos. A conferência final do documento é feita por ele.
export function validateRegistration(form, step, today = new Date()) {
  const errors = {};
  if (step === 0) {
    if (!form.nome.trim()) errors.nome = 'Informe seu nome.';
    if (!isEmail(form.email)) errors.email = 'Informe um e-mail válido.';
    if (![10,11].includes(digitsOnly(form.whatsapp).length)) errors.whatsapp = 'Informe o telefone com DDD.';
    if (Array.from(form.senha).length < 8) errors.senha = 'Use pelo menos 8 caracteres.';
    if (form.confirmacao !== form.senha || !form.confirmacao) errors.confirmacao = 'As senhas precisam ser iguais.';
  }
  if (step === 1) {
    const expectedLength = form.entidade === 'empresa' ? 14 : 11;
    if (digitsOnly(form.documento).length !== expectedLength) errors.documento = `Informe o ${form.entidade === 'empresa' ? 'CNPJ' : 'CPF'} completo.`;
    if (form.entidade === 'pessoa') {
      const [year, month, day] = form.dataNascimento.split('-').map(Number);
      const birthday = new Date(year, month - 1, day);
      const valid = year > 1900 && birthday.getFullYear() === year && birthday.getMonth() === month - 1 && birthday.getDate() === day;
      let age = today.getFullYear() - year;
      if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) age -= 1;
      if (!valid) errors.dataNascimento = 'Informe uma data de nascimento válida.';
      else if (age < 18) errors.dataNascimento = 'O cadastro está disponível a partir dos 18 anos.';
    } else {
      if (!form.razaoSocial.trim()) errors.razaoSocial = 'Informe a razão social.';
      if (!form.situacaoTributaria) errors.situacaoTributaria = 'Selecione a situação tributária.';
      if (form.situacaoTributaria === 'contribuinte' && !form.inscricaoEstadual.trim()) errors.inscricaoEstadual = 'Informe a inscrição estadual.';
    }
    if (form.tipo === 'profissional' && form.servicos.length === 0) errors.servicos = 'Escolha pelo menos um serviço que você oferece.';
  }
  if (step === 2) {
    if (digitsOnly(form.cep).length !== 8) errors.cep = 'Informe um CEP com 8 números.';
    if (!form.rua.trim()) errors.rua = 'Informe a rua ou avenida.';
    if (!form.numero.trim()) errors.numero = 'Informe o número ou S/N.';
    if (!form.bairro.trim()) errors.bairro = 'Informe o bairro.';
    if (!form.cidade.trim()) errors.cidade = 'Informe a cidade.';
    if (!form.estado) errors.estado = 'Selecione o estado.';
  }
  return errors;
}

export function registrationPayload(form) {
  return {
    nome: form.nome.trim(), email: form.email.trim(), senha: form.senha,
    whatsapp: form.whatsapp, documento: form.documento,
    dataNascimento: form.entidade === 'pessoa' ? form.dataNascimento : '',
    genero: form.entidade === 'pessoa' ? form.genero : '',
    ehPrestadorDeServicos: form.tipo === 'profissional',
    servicosPrestados: form.tipo === 'profissional' ? form.servicos.join(', ') : '',
    cep: form.cep, rua: form.rua.trim(), endereco: form.rua.trim(), numero: form.numero.trim(),
    complemento: form.complemento.trim(), bairro: form.bairro.trim(), cidade: form.cidade.trim(), estado: form.estado,
    razaoSocial: form.entidade === 'empresa' ? form.razaoSocial.trim() : '',
    situacaoTributaria: form.entidade === 'empresa' ? form.situacaoTributaria : '',
    inscricaoEstadual: form.entidade === 'empresa' ? (form.situacaoTributaria === 'isento' ? 'ISENTO' : form.inscricaoEstadual.trim()) : '',
  };
}

function friendlyErrors(exception, fallback) {
  const messages = typeof exception === 'string' ? exception.split('\n').map(line => line.trim()).filter(line => /e-?mail|senha|CPF|CNPJ|idade|anos|razão|inscrição|preencha|inválid|cadastrad|incorret/i.test(line) && !/SQLSTATE|PDO|Stack trace|\.php|database/i.test(line)).slice(0, 6) : [];
  return messages.length ? messages : [fallback];
}

export async function authenticate(action, payload, signal) {
  const fallback = action === 'logar' ? 'Não foi possível entrar. Confira seus dados e tente novamente.' : 'Não foi possível criar a conta. Confira os dados e tente novamente.';
  const apiURL = getApiURL();
  if (!apiURL) throw new Error('O serviço de contas está indisponível. Tente novamente em instantes.');
  let response;
  try { response = await fetch(`${apiURL}/clientes/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal }); }
  catch (error) { throw new Error(error.name === 'AbortError' ? 'A conexão demorou mais que o esperado. Tente novamente.' : 'Não conseguimos conectar ao serviço de contas. Tente novamente em instantes.'); }
  let data;
  try { data = await response.json(); } catch (error) { throw new Error('O serviço de contas está indisponível. Tente novamente em instantes.'); }
  if (!response.ok || data?.excecao) {
    const error = new Error(fallback);
    error.messages = friendlyErrors(data?.excecao, fallback);
    throw error;
  }
  const id = data?.id;
  const validIdentifier = (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) && Number.isSafeInteger(Number(id)) && Number(id) > 0;
  if (!validIdentifier || typeof data.nome !== 'string' || !data.nome.trim()) throw new Error('Não conseguimos confirmar o acesso. Tente novamente em instantes.');
  return { id: String(Number(id)), nome: data.nome, ehPrestadorServicos: data.ehPrestadorServicos === true || data.ehPrestadorServicos === 'true' || data.ehPrestadorServicos === 1, estado: typeof data.estado === 'string' ? data.estado : '', cidade: typeof data.cidade === 'string' ? data.cidade : '' };
}
