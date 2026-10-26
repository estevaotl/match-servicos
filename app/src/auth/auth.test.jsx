import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '../contexts/Auth';
import LoginPage from '../pages/Login';
import CadastroPage from '../pages/Cadastro';
import { authenticate, safeDestination, validateRegistration } from './data';

const originalFetch = global.fetch;
const originalMatchMedia = window.matchMedia;
const originalScroll = Element.prototype.scrollIntoView;
const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;
function LocationDisplay() { const location = useLocation(); return <output data-testid="location">{location.pathname}{location.search}</output>; }
function renderScreen(path) {
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider><Routes><Route path="/login" element={<LoginPage />} /><Route path="/cadastrar" element={<CadastroPage />} /><Route path="/profile/:id" element={<p>Perfil de destino</p>} /><Route path="/minha-conta" element={<p>Minha conta</p>} /><Route path="/" element={<p>Início</p>} /></Routes><LocationDisplay /></AuthProvider></MemoryRouter>);
}
function fill(label, value) { fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } }); }
function fillAccess() {
  fill('Seu nome', 'Pessoa de teste'); fill('E-mail', 'teste@example.test'); fill('WhatsApp', '22999990000'); fill('Senha', 'senha-teste'); fill('Confirmar senha', 'senha-teste');
}
function advanceToAddress() {
  fillAccess(); fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
  fill('CPF', '00000000000'); fill('Data de nascimento', '2000-01-01');
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
}
function fillAddress(postcode = '28600000') {
  fill('CEP', postcode); fill('Rua ou avenida', 'Rua de teste'); fill('Número', 'S/N'); fill('Bairro', 'Centro'); fill('Cidade', 'Nova Friburgo'); fill('Estado', 'RJ');
}
function success(professional = false) { return { ok: true, json: async () => ({ id: 42, nome: 'Pessoa de teste', ehPrestadorServicos: professional, cidade: [], estado: [] }) }; }

beforeEach(() => {
  sessionStorage.clear(); localStorage.clear();
  global.fetch = jest.fn().mockRejectedValue(new Error('Offline'));
  process.env.REACT_APP_API_URL_DEV = 'http://localhost/api';
  window.matchMedia = jest.fn(() => ({ matches: true }));
  Element.prototype.scrollIntoView = jest.fn();
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});
afterAll(() => {
  global.fetch = originalFetch; window.matchMedia = originalMatchMedia; Element.prototype.scrollIntoView = originalScroll;
  HTMLDialogElement.prototype.showModal = originalShowModal; HTMLDialogElement.prototype.close = originalClose;
});

test('login inválido fica no formulário; mostrar senha e pedir ajuda não autenticam', () => {
  renderScreen('/login');
  fireEvent.click(screen.getByRole('button', { name: 'Entrar na minha conta' }));
  expect(screen.getByLabelText('E-mail')).toHaveFocus();
  expect(screen.getByText('Informe sua senha.')).toBeInTheDocument();
  fill('Senha', 'teste'); fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));
  expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'text');
  fireEvent.click(screen.getByRole('button', { name: 'Esqueceu sua senha?' }));
  expect(screen.getByRole('dialog')).toHaveTextContent('recuperação automática por e-mail ainda não está disponível');
  expect(screen.getByRole('link', { name: 'Falar com a equipe' })).toHaveAttribute('href', '/contato');
  expect(global.fetch).not.toHaveBeenCalled();
});

test('login confirmado normaliza a sessão e volta ao perfil com os filtros', async () => {
  global.fetch.mockResolvedValue(success());
  renderScreen('/login?redirect=%2Fprofile%2F7%3Fvoltar%3Dq%253DPintura');
  fill('E-mail', 'teste@example.test'); fill('Senha', 'senha-teste');
  fireEvent.click(screen.getByRole('button', { name: 'Entrar na minha conta' }));
  await screen.findByText('Perfil de destino');
  expect(screen.getByTestId('location')).toHaveTextContent('/profile/7?voltar=q%3DPintura');
  expect(sessionStorage.getItem('idCliente')).toBe('42');
  expect(sessionStorage.getItem('cidade')).toBe('');
  expect(sessionStorage.getItem('ehPrestadorServicos')).toBe('false');
});

test('erro de conta permite tentar novamente e resposta incompleta nunca autentica', async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ excecao: 'E-mail ou senha incorretos.\nSQLSTATE erro database.php' }) }).mockResolvedValueOnce({ ok: true, json: async () => ({ mensagem: 'ok' }) });
  renderScreen('/login'); fill('E-mail', 'teste@example.test'); fill('Senha', 'senha-teste');
  fireEvent.click(screen.getByRole('button', { name: 'Entrar na minha conta' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.');
  expect(screen.getByRole('alert')).not.toHaveTextContent('SQLSTATE');
  fireEvent.click(screen.getByRole('button', { name: 'Entrar na minha conta' }));
  await screen.findByText('Não conseguimos confirmar o acesso. Tente novamente em instantes.');
  expect(sessionStorage.getItem('idCliente')).toBeNull();
  expect(screen.getByTestId('location')).toHaveTextContent('/login');
});

test('envio em andamento impede pedidos duplicados e conserva os campos após falha de conexão', async () => {
  let rejectRequest; global.fetch.mockImplementation(() => new Promise((resolve, reject) => { rejectRequest = reject; }));
  const { container } = renderScreen('/login'); fill('E-mail', 'teste@example.test'); fill('Senha', 'senha-teste');
  fireEvent.submit(container.querySelector('form')); fireEvent.submit(container.querySelector('form'));
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText('E-mail')).toBeDisabled();
  await act(async () => rejectRequest(new Error('Offline')));
  await screen.findByText('Não conseguimos conectar ao serviço de contas. Tente novamente em instantes.');
  expect(screen.getByLabelText('E-mail')).toHaveValue('teste@example.test');
  expect(screen.getByRole('button', { name: 'Entrar na minha conta' })).toBeEnabled();
});

test('cadastro não avança com confirmação diferente e foca o campo de senha', () => {
  renderScreen('/cadastrar'); fillAccess(); fill('Senha', 'curta'); fill('Confirmar senha', 'outra');
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
  expect(screen.getByLabelText('Senha')).toHaveFocus();
  expect(screen.getByText('As senhas precisam ser iguais.')).toBeInTheDocument();
  expect(screen.queryByLabelText('CPF')).not.toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('profissional precisa escolher serviços e o cadastro envia os dados de pessoa física', async () => {
  global.fetch.mockResolvedValue(success(true)); renderScreen('/cadastrar?tipo=profissional');
  expect(screen.getByRole('radio', { name: 'Quero oferecer serviços' })).toBeChecked();
  fillAccess(); fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
  fill('CPF', '00000000000'); fill('Data de nascimento', '2000-01-01');
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
  expect(screen.getByLabelText('Quais serviços você oferece?')).toHaveFocus();
  const service = screen.getByLabelText('Quais serviços você oferece?').options[1].value;
  fill('Quais serviços você oferece?', service); fireEvent.click(screen.getByRole('button', { name: 'Continuar' })); fillAddress();
  fireEvent.click(screen.getByRole('button', { name: 'Criar minha conta' })); await screen.findByText('Minha conta');
  expect(global.fetch).toHaveBeenCalledTimes(1);
  const [url, request] = global.fetch.mock.calls[0];
  expect(url).toBe('http://localhost/api/clientes/criar');
  expect(JSON.parse(request.body)).toMatchObject({ ehPrestadorDeServicos: true, servicosPrestados: service, documento: '000.000.000-00', dataNascimento: '2000-01-01', razaoSocial: '', endereco: 'Rua de teste', estado: 'RJ' });
  expect(JSON.parse(request.body)).not.toHaveProperty('confirmacao');
});

test('trocar para empresa limpa identificação pessoal e envia a situação de isenção', async () => {
  global.fetch.mockResolvedValue(success()); renderScreen('/cadastrar'); fillAccess();
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' })); fill('CPF', '00000000000'); fill('Data de nascimento', '2000-01-01'); fill('Gênero (opcional)', 'feminino');
  fireEvent.click(screen.getByRole('radio', { name: 'Empresa' })); expect(screen.getByLabelText('CNPJ')).toHaveValue('');
  fill('CNPJ', '00000000000000'); fill('Razão social', 'Empresa de teste'); fill('Situação tributária', 'isento');
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' })); fillAddress();
  fireEvent.click(screen.getByRole('button', { name: 'Criar minha conta' })); await screen.findByText('Minha conta');
  expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toMatchObject({ documento: '00.000.000/0000-00', dataNascimento: '', genero: '', razaoSocial: 'Empresa de teste', situacaoTributaria: 'isento', inscricaoEstadual: 'ISENTO', ehPrestadorDeServicos: false, servicosPrestados: '' });
});

test('falha na consulta do CEP permite preencher o endereço manualmente', async () => {
  global.fetch.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(success());
  renderScreen('/cadastrar'); advanceToAddress(); fill('CEP', '28600000'); fireEvent.click(screen.getByRole('button', { name: 'Buscar endereço' }));
  await screen.findByText('Não conseguimos consultar o CEP. Você pode preencher o endereço abaixo.');
  fillAddress(); fireEvent.click(screen.getByRole('button', { name: 'Criar minha conta' })); await screen.findByText('Minha conta');
  expect(JSON.parse(global.fetch.mock.calls[1][1].body)).toMatchObject({ cep: '28600-000', cidade: 'Nova Friburgo' });
});

test('CEP que foi consultado e não existe bloqueia a criação', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ erro: true }) });
  renderScreen('/cadastrar'); advanceToAddress(); fillAddress('00000000'); fireEvent.click(screen.getByRole('button', { name: 'Buscar endereço' }));
  await screen.findByText('CEP não encontrado. Confira os números e tente novamente.'); fireEvent.click(screen.getByRole('button', { name: 'Criar minha conta' }));
  expect(screen.getByLabelText('CEP')).toHaveFocus(); expect(screen.getByText('Confira o CEP antes de criar sua conta.')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1); expect(sessionStorage.getItem('idCliente')).toBeNull();
});

test('resposta antiga de CEP não sobrescreve o endereço após mudar os números', async () => {
  let resolveRequest; global.fetch.mockImplementation(() => new Promise(resolve => { resolveRequest = resolve; }));
  renderScreen('/cadastrar'); advanceToAddress(); fill('CEP', '28600000'); fireEvent.click(screen.getByRole('button', { name: 'Buscar endereço' }));
  fill('CEP', '01001000'); fill('Rua ou avenida', 'Rua escolhida');
  await act(async () => resolveRequest({ ok: true, json: async () => ({ logradouro: 'Rua antiga', bairro: 'Antigo', localidade: 'Cidade antiga', uf: 'RJ' }) }));
  expect(screen.getByLabelText('Rua ou avenida')).toHaveValue('Rua escolhida'); expect(screen.getByLabelText('Cidade')).toHaveValue(''); expect(screen.getByLabelText('CEP')).toHaveValue('01001-000');
});

test('retorno só aceita destinos internos e mantém o link entre login e cadastro', () => {
  ['https://outro.test', '//outro.test', '/\\outro.test', '/login', '/profile/7/extra', '/%2e%2e//outro.test'].forEach(url => expect(safeDestination(url)).toBe('/'));
  renderScreen('/login?redirect=%2Fprofile%2F7'); expect(screen.getByRole('link', { name: 'Criar minha conta' })).toHaveAttribute('href', '/cadastrar?redirect=%2Fprofile%2F7');
});

test('conta exige maioridade e rejeita datas impossíveis', () => {
  const profile = { entidade: 'pessoa', documento: '00000000000', dataNascimento: '2008-10-15', tipo: 'cliente' };
  expect(validateRegistration(profile, 1, new Date(2026, 9, 14))).toHaveProperty('dataNascimento');
  expect(validateRegistration({ ...profile, dataNascimento: '2008-10-14' }, 1, new Date(2026, 9, 14))).toEqual({});
  expect(validateRegistration({ ...profile, dataNascimento: '2000-02-31' }, 1)).toHaveProperty('dataNascimento');
});

test('resposta HTML com status 200 não é aceita como sessão', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => { throw new SyntaxError('HTML'); } });
  await expect(authenticate('logar', { email: 'teste@example.test', senha: 'senha-teste' })).rejects.toThrow('serviço de contas está indisponível');
});

test.each([true, [42], '4e1'])('identificador inesperado %p não confirma acesso', async id => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id, nome: 'Pessoa de teste' }) });
  await expect(authenticate('logar', {})).rejects.toThrow('Não conseguimos confirmar o acesso');
});
