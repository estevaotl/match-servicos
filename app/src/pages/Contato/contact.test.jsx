import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContatoPage from './index';

const originalFetch = global.fetch;
const response = body => ({ ok: true, json: async () => body });
function showContact() { return render(<MemoryRouter><ContatoPage /></MemoryRouter>); }
function fillForm() {
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Pessoa de teste' } });
  fireEvent.change(screen.getByLabelText(/e-?mail/i), { target: { value: 'teste@example.test' } });
  fireEvent.change(screen.getByLabelText('Mensagem'), { target: { value: 'Gostaria de ajuda para usar minha conta.' } });
}
function submit() { fireEvent.submit(screen.getByRole('button', { name: /Enviar/ }).closest('form')); }
beforeEach(() => { global.fetch = jest.fn(); process.env.REACT_APP_API_URL_DEV = 'http://localhost/api'; });
afterAll(() => { global.fetch = originalFetch; });

test('erro JSON com HTTP 200 mantém o formulário e não anuncia sucesso', async () => {
  global.fetch.mockResolvedValue(response({ excecao: 'Falha SMTP' })); showContact(); fillForm(); submit();
  await screen.findByRole('alert');
  expect(screen.getByLabelText(/e-?mail/i)).toHaveValue('teste@example.test');
  expect(screen.getByLabelText('Mensagem')).toHaveValue('Gostaria de ajuda para usar minha conta.');
  expect(screen.queryByText('Mensagem enviada.')).not.toBeInTheDocument();
});

test('campos inválidos recebem orientação e foco sem enviar', () => {
  showContact(); submit();
  expect(screen.getByLabelText('Nome')).toHaveFocus();
  expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('sucesso exige confirmação explícita e permite começar outra mensagem', async () => {
  global.fetch.mockResolvedValue(response({ resposta: true })); showContact(); fillForm(); submit();
  await screen.findByRole('heading', { name: 'Mensagem enviada.' });
  expect(global.fetch.mock.calls[0][0]).toBe('http://localhost/api/contato/enviar');
  expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({ name: 'Pessoa de teste', email: 'teste@example.test', message: 'Gostaria de ajuda para usar minha conta.' });
  fireEvent.click(screen.getByRole('button', { name: 'Enviar outra mensagem' }));
  expect(screen.getByLabelText('Nome')).toHaveValue('');
});

test.each([{ resposta: false }, {}, { success: true }])('resposta sem a confirmação esperada %p não confirma envio', async body => {
  global.fetch.mockResolvedValue(response(body)); showContact(); fillForm(); submit();
  expect(await screen.findByRole('alert')).toHaveTextContent('Não conseguimos confirmar o envio');
  expect(screen.getByLabelText('Nome')).toHaveValue('Pessoa de teste');
});

test('falha de conexão permite nova tentativa e impede envio duplicado enquanto aguarda', async () => {
  let rejectRequest; global.fetch.mockImplementation(() => new Promise((resolve,reject) => { rejectRequest = reject; }));
  showContact(); fillForm(); submit(); fireEvent.submit(screen.getByLabelText('Nome').closest('form'));
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
  await act(async () => rejectRequest(new TypeError('Failed to fetch')));
  expect(await screen.findByRole('alert')).toHaveTextContent('Sua mensagem foi mantida');
  expect(screen.getByLabelText('Nome')).toHaveValue('Pessoa de teste');
});

test('desmontar o formulário interrompe a requisição em andamento', async () => {
  global.fetch.mockImplementation((url, options) => new Promise((resolve,reject) => options.signal.addEventListener('abort', () => reject(Object.assign(new Error('Abortado'), { name: 'AbortError' })))));
  const { unmount } = showContact(); fillForm(); submit();
  const signal = global.fetch.mock.calls[0][1].signal; unmount();
  await waitFor(() => expect(signal.aborted).toBe(true));
});
