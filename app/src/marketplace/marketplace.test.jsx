import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '../contexts/Auth';
import SearchPage from '../pages/Busca';
import ProfilePage from '../pages/Profile';
import { createServiceRequest, whatsappURL } from './data';

const originalFetch = global.fetch;
const originalLocation = window.location;
const showModal = HTMLDialogElement.prototype.showModal;
const close = HTMLDialogElement.prototype.close;

function LocationDisplay() { const location = useLocation(); return <output data-testid="location">{location.pathname}{location.search}</output>; }
function renderScreen(path) {
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider><Routes><Route path="/busca" element={<SearchPage />} /><Route path="/profile/:id" element={<ProfilePage />} /></Routes><LocationDisplay /></AuthProvider></MemoryRouter>);
}

beforeEach(() => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Offline'));
  process.env.REACT_APP_API_URL_DEV = 'http://localhost/api';
  process.env.REACT_APP_API_URL_PROD = 'https://api.example.test';
  sessionStorage.clear(); localStorage.clear();
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});
afterAll(() => {
  global.fetch = originalFetch;
  HTMLDialogElement.prototype.showModal = showModal;
  HTMLDialogElement.prototype.close = close;
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

test('filtros do endereço limitam os exemplos e limpar recupera a vitrine', async () => {
  renderScreen('/busca?q=Pintura&cidade=Nova+Friburgo&estado=RJ');
  expect(await screen.findByRole('heading', { name: '1 profissional' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Mariana Costa' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Rafael Almeida' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
  expect(await screen.findByRole('heading', { name: '4 profissionais' })).toBeInTheDocument();
  expect(screen.getByTestId('location')).toHaveTextContent('/busca');
});

test('favoritos ficam salvos e o filtro mostra só os perfis escolhidos', async () => {
  renderScreen('/busca');
  await screen.findByRole('heading', { name: 'Mariana Costa' });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar Mariana Costa nos favoritos' }));
  fireEvent.click(screen.getByLabelText('Só meus favoritos'));
  expect(screen.getByRole('heading', { name: '1 profissional' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Rafael Almeida' })).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('match:favorites:v1'))).toEqual(['preview-pintura']);
});

test('a navegação abre o perfil e preserva os filtros na volta', async () => {
  renderScreen('/busca?q=Pintura&cidade=Nova+Friburgo');
  await screen.findByRole('heading', { name: '1 profissional' });
  fireEvent.click(screen.getByRole('link', { name: 'Ver perfil' }));
  expect(await screen.findByRole('heading', { level: 1, name: 'Mariana Costa' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Continuar buscando talentos' }));
  expect(await screen.findByRole('heading', { name: '1 profissional' })).toBeInTheDocument();
  expect(screen.getByLabelText('O que você precisa?')).toHaveValue('Pintura');
  expect(screen.getByLabelText('Sua cidade')).toHaveValue('Nova Friburgo');
});

test('o contato demonstrativo não envia requisições nem abre WhatsApp', async () => {
  renderScreen('/profile/preview-montagem');
  await screen.findByRole('heading', { level: 1, name: 'Rafael Almeida' });
  fireEvent.click(screen.getByRole('button', { name: 'Experimentar o contato' }));
  expect(screen.getByRole('dialog')).toHaveTextContent('Nenhuma mensagem será enviada e nenhuma solicitação será criada.');
  expect(global.fetch).not.toHaveBeenCalled();
  expect(screen.queryByRole('link', { name: /Abrir conversa no WhatsApp/ })).not.toBeInTheDocument();
});

test('portfólio amplia o trabalho e avaliações são identificadas como exemplos', async () => {
  renderScreen('/profile/preview-pintura');
  await screen.findByRole('heading', { level: 1, name: 'Mariana Costa' });
  fireEvent.click(screen.getByRole('button', { name: /Sala com novo acabamento/ }));
  expect(screen.getByRole('dialog')).toHaveTextContent('não representam trabalhos realizados');
  fireEvent.click(screen.getByRole('button', { name: 'Fechar janela' }));
  fireEvent.click(screen.getByRole('tab', { name: /Avaliações/ }));
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Comentários fictícios');
  expect(screen.getAllByText('Avaliação ilustrativa')).toHaveLength(2);
});

test('erro ao registrar contato impede WhatsApp e uma nova tentativa pode concluir', async () => {
  sessionStorage.setItem('idCliente', '91');
  const person = { id: 7, nome: 'Profissional real', servicosPrestados: 'Montagem de móveis', whatsapp: '(22) 99999-0000', imagem: [], endereco: [] };
  global.fetch.mockReset().mockResolvedValueOnce({ ok: true, json: async () => ({ cliente: person }) })
    .mockResolvedValueOnce({ ok: true, text: async () => JSON.stringify({ excecao: 'Erro ao salvar' }) })
    .mockResolvedValueOnce({ ok: true, text: async () => 'Ordem de Serviço criada.' });
  renderScreen('/profile/7');
  await screen.findByRole('heading', { name: 'Profissional real', level: 1 });
  fireEvent.click(screen.getByRole('button', { name: 'Conversar pelo WhatsApp' }));
  fireEvent.click(screen.getByRole('button', { name: 'Continuar para o WhatsApp' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não conseguimos registrar o contato');
  expect(screen.queryByRole('link', { name: /Abrir conversa no WhatsApp/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Continuar para o WhatsApp' }));
  expect(await screen.findByRole('link', { name: /Abrir conversa no WhatsApp/ })).toHaveAttribute('href', expect.stringContaining('https://wa.me/5522999990000'));
  expect(JSON.parse(global.fetch.mock.calls[1][1].body)).toEqual({ idTrabalhador: 7, idCliente: '91' });
});

test('produção indisponível não substitui resultados por exemplos', async () => {
  Object.defineProperty(window, 'location', { configurable: true, value: { hostname: 'match.example.test' } });
  renderScreen('/busca');
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Não conseguimos carregar os profissionais.' })).toBeInTheDocument());
  expect(screen.queryByRole('heading', { name: 'Mariana Costa' })).not.toBeInTheDocument();
});

test('telefone e mensagem são normalizados sem duplicar o código do país', () => {
  const link = whatsappURL('+55 (22) 99999-0000', 'Rafael', 'Pintura & reparos');
  expect(new URL(link).pathname).toBe('/5522999990000');
  expect(new URL(link).searchParams.get('text')).toBe('Pintura & reparos');
  expect(whatsappURL('123', 'Rafael')).toBeNull();
});

test('resposta HTML com status 200 não é aceita como contato registrado', async () => {
  global.fetch.mockResolvedValue({ ok: true, text: async () => '<html>erro PHP</html>' });
  await expect(createServiceRequest(7, 91)).rejects.toThrow('Não conseguimos registrar o contato');
});

test('resultados reais de outro estado não passam pelo filtro regional', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ cliente: [{ id: 8, nome: 'Outro estado', servicosPrestados: 'Pintura', endereco: [{ cidade: 'Nova Friburgo', estado: 'SP' }] }] }) });
  renderScreen('/busca?q=Pintura&cidade=Nova+Friburgo&estado=RJ');
  await screen.findByRole('heading', { name: 'Esse encontro ainda não aconteceu.' });
  expect(screen.queryByRole('heading', { name: 'Outro estado' })).not.toBeInTheDocument();
});

test('endereços de perfis fictícios não funcionam fora do ambiente local', async () => {
  Object.defineProperty(window, 'location', { configurable: true, value: { hostname: 'match.example.test' } });
  renderScreen('/profile/preview-pintura');
  await screen.findByRole('heading', { name: 'Não conseguimos abrir este perfil.' });
  expect(screen.queryByRole('heading', { name: 'Mariana Costa', level: 1 })).not.toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});
