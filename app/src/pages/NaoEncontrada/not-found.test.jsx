import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../../App';

const originalFetch = global.fetch;
const originalScroll = window.scrollTo;
const originalURL = window.location.pathname + window.location.search;
beforeEach(() => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Offline'));
  window.scrollTo = jest.fn(); sessionStorage.clear();
});
afterEach(() => { window.history.replaceState({}, '', originalURL); });
afterAll(() => { global.fetch = originalFetch; window.scrollTo = originalScroll; });

test('rota desconhecida apresenta uma saída útil e permite voltar para o início', async () => {
  window.history.replaceState({}, '', '/caminho-que-nao-existe');
  render(<App />);
  const main = within(screen.getByRole('main'));
  expect(main.getByRole('heading', { name: 'Esse caminho não deu match.' })).toBeInTheDocument();
  expect(main.getByRole('link', { name: 'Encontrar um profissional' })).toHaveAttribute('href', '/busca');
  expect(main.getByRole('link', { name: /Fale com a equipe/ })).toHaveAttribute('href', '/contato');
  expect(global.fetch).not.toHaveBeenCalled();
  fireEvent.click(main.getByRole('link', { name: 'Voltar ao início' }));
  expect(await screen.findByRole('button', { name: /Encontrar meu match/ })).toBeInTheDocument();
});
