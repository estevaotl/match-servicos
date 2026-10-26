import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/Auth';
import HomePage from './pages/Home';
import { mapProfessional } from './pages/Home/catalog';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: () => mockNavigate }));
const originalLocation = window.location;
const originalFetch = global.fetch;
const originalMatchMedia = window.matchMedia;

function renderHome() {
  return render(<MemoryRouter><AuthProvider><HomePage /></AuthProvider></MemoryRouter>);
}

beforeEach(() => {
  mockNavigate.mockReset();
  global.fetch = jest.fn();
  process.env.REACT_APP_API_URL_DEV = 'http://localhost/api';
  process.env.REACT_APP_API_URL_PROD = 'https://api.example.test';
  window.matchMedia = jest.fn(() => ({ matches: true }));
  Element.prototype.scrollIntoView = jest.fn();
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  sessionStorage.clear();
});

afterAll(() => {
  global.fetch = originalFetch;
  window.matchMedia = originalMatchMedia;
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

test('busca digitada preserva caracteres especiais e cidade na navegação real', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ cliente: [] }) });
  renderHome();
  await screen.findByRole('button', { name: /Encontrar meu match/ });
  fireEvent.change(screen.getByLabelText('O que vamos resolver hoje?'), { target: { value: 'Pintura & reparos' } });
  fireEvent.change(screen.getByLabelText('Em qual cidade?'), { target: { value: 'Nova Friburgo' } });
  fireEvent.click(screen.getByRole('button', { name: /Encontrar meu match/ }));
  const destination = mockNavigate.mock.calls[0][0];
  const query = new URLSearchParams(destination.split('?')[1]);
  expect(query.get('q')).toBe('Pintura & reparos');
  expect(query.get('cidade')).toBe('Nova Friburgo');
});

test('prévia mantém categorias e leva a busca digitada para a tela de resultados', async () => {
  global.fetch.mockRejectedValue(new Error('API offline'));
  renderHome();
  expect(await screen.findByText(/Prévia com perfis e avaliações fictícios/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Pintura', exact: true }));
  expect(screen.getByRole('heading', { name: 'Mariana Costa' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Lucas Ferreira' })).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('O que vamos resolver hoje?'), { target: { value: 'um vazamento' } });
  fireEvent.click(screen.getByRole('button', { name: /Encontrar meu match/ }));
  expect(new URLSearchParams(mockNavigate.mock.calls[0][0].split('?')[1]).get('q')).toBe('um vazamento');
});

test('falha em produção nunca apresenta prestadores ou avaliações fictícios', async () => {
  Object.defineProperty(window, 'location', { configurable: true, value: { hostname: 'match.example.test' } });
  global.fetch.mockRejectedValue(new Error('API offline'));
  renderHome();
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Não conseguimos carregar os profissionais.' })).toBeInTheDocument());
  expect(screen.queryByText(/Prévia com perfis/)).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Mariana Costa' })).not.toBeInTheDocument();
});

test('cadastro incompleto na API não fabrica nota ou localização', () => {
  const person = mapProfessional({ id: 17, nome: 'José Silva', servicosPrestados: 'Reparos elétricos', imagemPerfil: [] }, 'http://localhost/api');
  expect(person.category).toBe('eletrica');
  expect(person.rating).toBeNull();
  expect(person.location).toBe('');
  expect(person.image).toBeNull();
  expect(person.demo).toBe(false);
});
