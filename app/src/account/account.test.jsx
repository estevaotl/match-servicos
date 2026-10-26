import { useState } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '../contexts/Auth';
import MinhaContaPage from '../pages/MinhaConta';
import Orders from './Orders';
import Photos from './Photos';
import { changeOrderStatus, normalizeAccount, normalizeOrders, saveOrderValue, uploadImage } from './data';

const originalFetch = global.fetch;
const originalLocation = window.location;
const originalCreateURL = URL.createObjectURL;
const originalRevokeURL = URL.revokeObjectURL;
const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;
const person = { id: 7, nome: 'Pessoa de teste', email: 'teste@example.test', whatsapp: '(22) 99999-0000', genero: '', prestadorDeServicos: false, servicosPrestados: '', imagem: [], imagemPerfil: [], endereco: [{ cep: '28600-000', rua: 'Rua de teste', numero: 'S/N', bairro: 'Centro', complemento: '', cidade: 'Nova Friburgo', estado: 'RJ' }] };
const order = { id: '101', status: 0, solicitante: 'Cliente de teste', trabalhador: 'Profissional de teste', idTrabalhador: 9, dataCriacao: '14-10-2026', valor: null };
const apiResponse = (body, ok = true) => ({ ok, json: async () => body, text: async () => typeof body === 'string' ? body : JSON.stringify(body) });
function LocationDisplay() { const location = useLocation(); return <output data-testid="location">{location.pathname}{location.search}</output>; }
function renderPage(path = '/minha-conta') { return render(<MemoryRouter initialEntries={[path]}><AuthProvider><Routes><Route path="/minha-conta" element={<MinhaContaPage />} /><Route path="/login" element={<p>Entrada da conta</p>} /></Routes><LocationDisplay /></AuthProvider></MemoryRouter>); }
function OrderHarness({ initialOrders = [order], professional = true }) {
  const [orders, setOrders] = useState(initialOrders);
  return <MemoryRouter><Orders resource={{ state: 'ready', value: orders }} professional={professional} onUpdated={updated => setOrders(current => current.map(item => item.id === updated.id ? updated : item))} setFilter={() => {}} onRetry={() => {}} /></MemoryRouter>;
}
function initialAPI(profile = person, orders = []) { global.fetch.mockImplementation(url => Promise.resolve(apiResponse(url.includes('/clientes/obter/') ? { cliente: profile } : { ordens: orders }))); }
function signed() { sessionStorage.setItem('idCliente', '7'); sessionStorage.setItem('nomeCliente', person.nome); }

beforeEach(() => {
  sessionStorage.clear(); localStorage.clear();
  global.fetch = jest.fn().mockRejectedValue(new Error('Offline'));
  process.env.REACT_APP_API_URL_DEV = 'http://localhost/api'; process.env.REACT_APP_API_URL_PROD = 'https://api.example.test';
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  URL.createObjectURL = jest.fn(() => 'blob:preview-test'); URL.revokeObjectURL = jest.fn();
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});
afterAll(() => {
  global.fetch = originalFetch; URL.createObjectURL = originalCreateURL; URL.revokeObjectURL = originalRevokeURL;
  HTMLDialogElement.prototype.showModal = originalShowModal; HTMLDialogElement.prototype.close = originalClose;
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

test('a sessão é carregada antes de buscar a conta e usa o endpoint de cliente', async () => {
  signed(); initialAPI(); renderPage();
  await screen.findByRole('heading', { name: 'Vamos tirar ideias do papel.' });
  await screen.findByRole('heading', { name: 'Seu próximo projeto pode começar aqui.' });
  expect(global.fetch.mock.calls.map(([url]) => url)).toEqual(['http://localhost/api/clientes/obter/7', 'http://localhost/api/ordemServico/obterPorSolicitante/7']);
  expect(screen.queryByText('Entrada da conta')).not.toBeInTheDocument();
});

test('a prévia permite filtrar e explorar detalhes sem gravar nem criar uma sessão', async () => {
  renderPage('/minha-conta?preview=profissional');
  await screen.findByRole('heading', { name: 'Seu talento, em movimento.' });
  fireEvent.click(screen.getByRole('button', { name: 'Ver serviços: Em andamento' }));
  expect(await screen.findByRole('heading', { name: 'Prateleiras para o escritório' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Montagem de uma estante' })).not.toBeInTheDocument();
  expect(screen.getByTestId('location')).toHaveTextContent('secao=servicos&situacao=1');
  fireEvent.click(screen.getByRole('button', { name: 'Ver detalhes da solicitação 1038' }));
  expect(screen.getByLabelText('Situação do serviço')).toBeDisabled();
  expect(global.fetch).not.toHaveBeenCalled(); expect(sessionStorage.getItem('idCliente')).toBeNull();
});

test('a prévia não abre em produção e uma conta real indisponível não mostra dados fictícios', async () => {
  Object.defineProperty(window, 'location', { configurable: true, value: { hostname: 'match.example.test' } });
  const { unmount } = renderPage('/minha-conta?preview=profissional');
  await screen.findByRole('link', { name: 'Entrar na minha conta' });
  expect(screen.queryByText('Rafael Almeida')).not.toBeInTheDocument(); expect(global.fetch).not.toHaveBeenCalled();
  unmount(); signed(); renderPage();
  await screen.findByRole('heading', { name: 'Não conseguimos abrir sua conta.' });
  expect(screen.queryByText('Rafael Almeida')).not.toBeInTheDocument(); expect(sessionStorage.getItem('idCliente')).toBe('7');
});

test('erro nas solicitações preserva o perfil e permite carregar somente os serviços de novo', async () => {
  signed(); global.fetch.mockResolvedValueOnce(apiResponse({ cliente: person })).mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(apiResponse({ ordens: [order] }));
  renderPage('/minha-conta?secao=servicos');
  await screen.findByRole('heading', { name: 'Não conseguimos carregar seus serviços.' });
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByRole('heading', { name: 'Profissional de teste' });
  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(global.fetch.mock.calls[2][0]).toContain('/obterPorSolicitante/7');
});

test('cliente acompanha a situação e abre o profissional, sem alterar status ou valor', () => {
  render(<OrderHarness professional={false} initialOrders={[{ ...order, status: 2 }]} />);
  fireEvent.click(screen.getByRole('button', { name: 'Ver detalhes da solicitação 101' }));
  expect(screen.getByRole('link', { name: 'Ver perfil do profissional' })).toHaveAttribute('href', '/profile/9');
  expect(screen.queryByLabelText('Situação do serviço')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Registrar valor' })).not.toBeInTheDocument();
});

test('erro JSON com status HTTP 200 não muda a situação e uma nova tentativa confirma só esse serviço', async () => {
  global.fetch.mockResolvedValueOnce(apiResponse({ excecao: 'Erro ao gravar' })).mockResolvedValueOnce(apiResponse({ id: '101' }));
  render(<OrderHarness />); fireEvent.click(screen.getByRole('button', { name: 'Ver detalhes da solicitação 101' }));
  fireEvent.change(screen.getByLabelText('Situação do serviço'), { target: { value: '1' } }); fireEvent.click(screen.getByRole('button', { name: 'Salvar situação' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('A situação anterior foi mantida');
  expect(screen.getByText('Em aberto', { selector: '.order-status' })).toBeInTheDocument();
  expect(screen.queryByText('Situação do serviço atualizada.')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Salvar situação' })); await screen.findByText('Situação do serviço atualizada.');
  expect(screen.getByText('Em andamento', { selector: '.order-status' })).toBeInTheDocument();
  expect(JSON.parse(global.fetch.mock.calls[1][1].body)).toEqual({ ordemId: '101', novoStatus: '1' });
});

test('cada serviço concluído mantém seu próprio valor e envia a quantia à ordem certa', async () => {
  global.fetch.mockResolvedValue(apiResponse({ resposta: 1 }));
  render(<OrderHarness initialOrders={[{ ...order, status: 2 }, { ...order, id: '102', status: 2 }]} />);
  fireEvent.click(screen.getByRole('button', { name: 'Ver detalhes da solicitação 101' })); fireEvent.click(screen.getByRole('button', { name: 'Ver detalhes da solicitação 102' }));
  const firstRow = screen.getByRole('button', { name: 'Fechar detalhes da solicitação 101' }).closest('li');
  const secondRow = screen.getByRole('button', { name: 'Fechar detalhes da solicitação 102' }).closest('li');
  fireEvent.change(within(firstRow).getByLabelText('Valor combinado (R$)'), { target: { value: '111,50' } }); fireEvent.change(within(secondRow).getByLabelText('Valor combinado (R$)'), { target: { value: '222' } });
  fireEvent.click(within(firstRow).getByRole('button', { name: 'Registrar valor' })); await within(firstRow).findByText('Valor registrado neste serviço.');
  expect(within(secondRow).getByLabelText('Valor combinado (R$)')).toHaveValue('222');
  fireEvent.click(within(secondRow).getByRole('button', { name: 'Registrar valor' })); await within(secondRow).findByText('Valor registrado neste serviço.');
  expect(global.fetch.mock.calls.map(([,request]) => [request.body.get('ordemId'), request.body.get('valor')])).toEqual([['101','111.50'],['102','222']]);
});

test('salvar perfil usa a opção profissional correta e atualiza a identidade da sessão', async () => {
  signed(); initialAPI(); renderPage('/minha-conta?secao=perfil');
  await screen.findByLabelText('Seu nome');
  fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Novo nome' } });
  fireEvent.change(screen.getByLabelText('Como você usa o Match?'), { target: { value: 'profissional' } });
  fireEvent.change(screen.getByLabelText('Serviços que você oferece'), { target: { value: 'Montagem de móveis' } });
  global.fetch.mockImplementation((url, request) => Promise.resolve(apiResponse(url.includes('/clientes/atualizar') ? { id: 7, nome: 'Novo nome', ehPrestadorServicos: true, cidade: 'Nova Friburgo', estado: 'RJ' } : { ordens: [] })));
  fireEvent.click(screen.getByRole('button', { name: 'Salvar meu perfil' })); await screen.findByText('Seu perfil foi atualizado.');
  const [,request] = global.fetch.mock.calls.find(([url]) => url.includes('/clientes/atualizar'));
  expect(JSON.parse(request.body)).toMatchObject({ id: '7', nome: 'Novo nome', ehPrestadorDeServicos: true, servicosPrestados: 'Montagem de móveis', rua: 'Rua de teste' });
  expect(sessionStorage.getItem('nomeCliente')).toBe('Novo nome'); expect(sessionStorage.getItem('ehPrestadorServicos')).toBe('true');
});

test('falha ao salvar mantém os campos e envio repetido faz uma única requisição', async () => {
  signed(); initialAPI(); const { container } = renderPage('/minha-conta?secao=perfil');
  await screen.findByLabelText('Seu nome'); fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Nome em edição' } });
  let rejectRequest; global.fetch.mockImplementation(() => new Promise((resolve,reject) => { rejectRequest = reject; }));
  const form = container.querySelector('.account-profile-form'); fireEvent.submit(form); fireEvent.submit(form);
  expect(global.fetch.mock.calls.filter(([url]) => url.includes('/clientes/atualizar'))).toHaveLength(1);
  await act(async () => rejectRequest(new Error('Offline')));
  expect(await screen.findByRole('alert')).toHaveTextContent('Seus dados foram mantidos');
  expect(screen.getByLabelText('Seu nome')).toHaveValue('Nome em edição'); expect(sessionStorage.getItem('nomeCliente')).toBe(person.nome);
});

test('a foto de perfil aceita a resposta em texto e confirma o novo registro antes do sucesso', async () => {
  const onUploaded = jest.fn(); global.fetch.mockResolvedValueOnce(apiResponse('Imagem criada.')).mockResolvedValueOnce(apiResponse({ cliente: { ...person, imagemPerfil: [{ nomeArquivo: 'nova-foto.jpg' }] } }));
  render(<Photos profile={normalizeAccount(person)} onUploaded={onUploaded} />);
  fireEvent.change(screen.getByLabelText('Escolher imagem'), { target: { files: [new File(['foto'], 'foto.jpg', { type: 'image/jpeg' })] } });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar foto de perfil' })); await screen.findByText('Sua foto de perfil foi atualizada.');
  expect(global.fetch.mock.calls[0][0]).toContain('/uploadPerfil'); expect(onUploaded).toHaveBeenCalledWith(expect.objectContaining({ image: 'http://localhost/api/imagem/ler/nova-foto.jpg' }));
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview-test');
});

test('confirmação de upload sem nova imagem não apresenta sucesso; arquivo inválido não é enviado', async () => {
  const onUploaded = jest.fn(); const profile = normalizeAccount(person);
  global.fetch.mockResolvedValueOnce(apiResponse('Imagem criada.')).mockResolvedValueOnce(apiResponse({ cliente: person }));
  render(<Photos profile={profile} onUploaded={onUploaded} />);
  fireEvent.change(screen.getByLabelText('Escolher imagem'), { target: { files: [new File(['script'], 'teste.svg', { type: 'image/svg+xml' })] } });
  expect(screen.getByRole('alert')).toHaveTextContent('JPG, PNG ou GIF'); expect(global.fetch).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText('Escolher imagem'), { target: { files: [new File(['foto'], 'foto.png', { type: 'image/png' })] } });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar foto de perfil' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não conseguimos confirmar a nova foto'); expect(onUploaded).not.toHaveBeenCalled();
});

test('HTML e confirmações de outro serviço não são aceitos como atualização', async () => {
  global.fetch.mockResolvedValueOnce(apiResponse('<html>Erro PHP</html>')).mockResolvedValueOnce(apiResponse({ id: 999 }));
  await expect(changeOrderStatus('101', '1')).rejects.toThrow('Não conseguimos atualizar');
  await expect(changeOrderStatus('101', '1')).rejects.toThrow('Não conseguimos atualizar');
});

test('valor inválido ou confirmação sem linhas alteradas não é anunciado como salvo', async () => {
  for (const amount of ['-1','1e2','12,345','0']) await expect(saveOrderValue('101', amount)).rejects.toThrow('valor maior que zero');
  expect(global.fetch).not.toHaveBeenCalled(); global.fetch.mockResolvedValue(apiResponse({ resposta: 0 }));
  await expect(saveOrderValue('101', '125,50')).rejects.toThrow('Não conseguimos registrar o valor');
});

test('portfólio só confirma imagem nova e preserva os metadados do perfil', async () => {
  const profile = normalizeAccount({ ...person, prestadorDeServicos: true });
  global.fetch.mockResolvedValueOnce(apiResponse({ resposta: 'Imagem criada' })).mockResolvedValueOnce(apiResponse({ cliente: { ...person, prestadorDeServicos: true, imagem: [{ id: 3, nomeArquivo: 'trabalho.png' }] } }));
  const result = await uploadImage(profile, new File(['foto'], 'trabalho.png', { type: 'image/png' }), false);
  expect(result.images).toEqual([{ id: 3, nomeArquivo: 'trabalho.png' }]); expect(result.professional).toBe(true);
});

test('situação desconhecida não vira uma solicitação em aberto', () => {
  const orders = normalizeOrders({ ordens: [{ ...order, status: null }, { ...order, id: 102, status: '9' }] });
  expect(orders.map(item => item.status)).toEqual([null,null]);
});

test('envio confirmado com consulta indisponível pede conferir a conta sem anunciar sucesso', async () => {
  global.fetch.mockResolvedValueOnce(apiResponse('Imagem criada.')).mockRejectedValueOnce(new Error('Failed to fetch'));
  await expect(uploadImage(normalizeAccount(person), new File(['foto'], 'foto.jpg', { type: 'image/jpeg' }), true)).rejects.toThrow('Recarregue a conta antes de tentar enviar novamente');
});
