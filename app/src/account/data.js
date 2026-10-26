import { digitsOnly, isEmail, validateRegistration } from '../auth/data';
import { fetchJSON, getApiURL } from '../marketplace/data';

export const statusOptions = [{ value: 0, label: 'Em aberto', tone: 'open' }, { value: 1, label: 'Em andamento', tone: 'working' }, { value: 2, label: 'Concluído', tone: 'done' }, { value: 3, label: 'Cancelado', tone: 'cancelled' }];
export const isProfessional = value => value === true || value === 'true' || value === 1 || value === '1';
export const imageURL = file => file?.nomeArquivo ? `${getApiURL()}/imagem/ler/${encodeURIComponent(file.nomeArquivo)}` : null;
const text = value => typeof value === 'string' ? value : '';
const validStatus = value => [0,1,2,3,'0','1','2','3'].includes(value);
export function normalizeAccount(person) {
  if (!person || !/^\d+$/.test(String(person.id)) || Number(person.id) <= 0 || typeof person.nome !== 'string') throw new Error('Conta indisponível');
  const address = Array.isArray(person.endereco) ? person.endereco[0] || {} : {};
  return { id: String(person.id), nome: person.nome, email: text(person.email), whatsapp: text(person.whatsapp), genero: text(person.genero), professional: isProfessional(person.prestadorDeServicos), services: text(person.servicosPrestados), image: imageURL(person.imagemPerfil?.[0]), images: Array.isArray(person.imagem) ? person.imagem.filter(item => item.nomeArquivo) : [], cep: text(address.cep), rua: text(address.rua), numero: text(address.numero), complemento: text(address.complemento), bairro: text(address.bairro), cidade: text(address.cidade), estado: text(address.estado) };
}
export async function loadAccount(id, signal) { return normalizeAccount((await fetchJSON(`/clientes/obter/${encodeURIComponent(id)}`, signal)).cliente); }
export function normalizeOrders(data) {
  if (!Array.isArray(data.ordens)) throw new Error('Solicitações indisponíveis');
  return data.ordens.filter(order => /^\d+$/.test(String(order.id)) && Number(order.id) > 0).map(order => ({ ...order, id: String(order.id), status: validStatus(order.status) ? Number(order.status) : null, valor: Number.isFinite(Number(order.valor)) && Number(order.valor) > 0 ? Number(order.valor) : null }));
}
export async function loadOrders(profile, signal) { return normalizeOrders(await fetchJSON(`/ordemServico/${profile.professional ? 'obterPorTrabalhador' : 'obterPorSolicitante'}/${encodeURIComponent(profile.id)}`, signal)); }
export function orderDate(value) {
  const match = String(value || '').match(/^(\d{2})-(\d{2})-(\d{4})$/);
  const iso = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}/${match[2]}/${match[3]}` : iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : 'Data não informada';
}
export function newestOrders(orders) {
  const dateKey = value => { const match = String(value || '').match(/^(\d{2})-(\d{2})-(\d{4})$/); return match ? `${match[3]}-${match[2]}-${match[1]}` : String(value || ''); };
  return [...orders].sort((a,b) => dateKey(b.dataCriacao).localeCompare(dateKey(a.dataCriacao)) || Number(b.id) - Number(a.id));
}
export const currency = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export function validateProfile(form) {
  const errors = validateRegistration(form, 2);
  if (!form.nome.trim()) errors.nome = 'Informe seu nome.';
  if (!isEmail(form.email)) errors.email = 'Informe um e-mail válido.';
  if (![10,11].includes(digitsOnly(form.whatsapp).length)) errors.whatsapp = 'Informe o telefone com DDD.';
  if (form.professional && !form.services.trim()) errors.services = 'Informe pelo menos um serviço.';
  return errors;
}
export function profilePayload(profile) {
  return { id: profile.id, nome: profile.nome.trim(), email: profile.email.trim(), whatsapp: profile.whatsapp, genero: profile.genero, ehPrestadorDeServicos: profile.professional, servicosPrestados: profile.professional ? profile.services.trim() : '', cep: profile.cep, rua: profile.rua.trim(), endereco: profile.rua.trim(), numero: profile.numero.trim(), complemento: profile.complemento.trim(), bairro: profile.bairro.trim(), cidade: profile.cidade.trim(), estado: profile.estado };
}
async function accountRequest(path, options, check, fallback) {
  let response, body;
  try { response = await fetch(`${getApiURL()}${path}`, options); body = await response.text(); }
  catch (error) { throw new Error(error.name === 'AbortError' ? 'A conexão demorou mais que o esperado. Tente novamente.' : 'Não conseguimos conectar. Seus dados foram mantidos; tente novamente.'); }
  let data;
  try { data = JSON.parse(body); } catch (error) { data = null; }
  if (!response.ok || data?.excecao || !check(data, body.trim())) {
    const friendly = typeof data?.excecao === 'string' && /e-?mail|CPF|CNPJ|senha|inválid|preencha|cadastrad/i.test(data.excecao) && !/SQLSTATE|PDO|\.php|Stack trace|database/i.test(data.excecao) ? data.excecao : fallback;
    throw new Error(friendly);
  }
  return data;
}
const jsonPost = (payload, signal) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal });
export async function saveProfile(profile, signal) {
  return accountRequest('/clientes/atualizar', jsonPost(profilePayload(profile), signal), data => data && String(data.id) === profile.id && typeof data.nome === 'string' && data.nome.trim(), 'Não conseguimos salvar seu perfil. Confira os dados e tente novamente.');
}
export async function changeOrderStatus(id, status, signal) {
  if (!validStatus(status)) throw new Error('Selecione uma situação válida.');
  return accountRequest('/ordemServico/modificarStatus', jsonPost({ ordemId: id, novoStatus: String(status) }, signal), data => data && String(data.id) === String(id), 'Não conseguimos atualizar este serviço. A situação anterior foi mantida.');
}
export async function saveOrderValue(id, value, signal) {
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value) || !Number.isFinite(Number(value.replace(',', '.'))) || Number(value.replace(',', '.')) <= 0) throw new Error('Informe um valor maior que zero, com até duas casas decimais.');
  const form = new FormData(); form.append('ordemId', id); form.append('valor', value.replace(',', '.'));
  await accountRequest('/ordemServico/atualizarValor', { method: 'POST', body: form, signal }, data => data?.resposta === true || data?.resposta === 1, 'Não conseguimos registrar o valor. Tente novamente.');
  return Number(value.replace(',', '.'));
}
export function validateImage(file) {
  if (!file) return 'Escolha uma imagem para enviar.';
  if (!['image/jpeg','image/png','image/gif'].includes(file.type)) return 'Escolha uma imagem JPG, PNG ou GIF.';
  if (file.size > 5 * 1024 * 1024) return 'Escolha uma imagem de até 5 MB.';
  return '';
}
export async function uploadImage(profile, file, portrait, signal) {
  const error = validateImage(file); if (error) throw new Error(error);
  const form = new FormData(); form.append('idCliente', profile.id); form.append('image', file);
  await accountRequest(`/imagem/${portrait ? 'uploadPerfil' : 'upload'}`, { method: 'POST', body: form, signal }, (data, body) => portrait ? body === 'Imagem criada.' : data?.resposta === 'Imagem criada', 'Não conseguimos enviar a foto. Tente novamente.');
  // O servidor antigo pode confirmar mesmo se o arquivo não for salvo. Conferimos os registros antes de mostrar sucesso.
  let refreshed;
  try { refreshed = await loadAccount(profile.id, signal); }
  catch (error) { throw new Error('Não conseguimos conferir a nova foto. Recarregue a conta antes de tentar enviar novamente.'); }
  const changed = portrait ? refreshed.image && refreshed.image !== profile.image : refreshed.images.some(image => !profile.images.some(previous => previous.nomeArquivo === image.nomeArquivo));
  if (!changed) throw new Error('Não conseguimos confirmar a nova foto. Recarregue a conta antes de tentar enviar novamente.');
  return refreshed;
}

// Dados fictícios disponíveis somente na prévia local explícita, sem sessão ou gravações.
export function demoAccount(professional) {
  return { id: 'account-preview', nome: professional ? 'Rafael Almeida' : 'Camila Ribeiro', professional, email: 'exemplo@example.test', whatsapp: '', genero: '', services: professional ? 'Montagem de móveis, Instalação de prateleiras' : '', image: null, images: [], cep: '', rua: '', numero: '', complemento: '', bairro: 'Centro', cidade: 'Nova Friburgo', estado: 'RJ', demo: true };
}
export function demoOrders(professional) {
  return [
    { id: '1042', status: 0, title: 'Montagem de uma estante', solicitante: 'Camila Ribeiro', trabalhador: 'Rafael Almeida', idTrabalhador: 'preview-montagem', dataCriacao: '14-10-2026', valor: null },
    { id: '1038', status: 1, title: 'Prateleiras para o escritório', solicitante: 'Bruno Santos', trabalhador: 'Rafael Almeida', idTrabalhador: 'preview-montagem', dataCriacao: '12-10-2026', valor: null },
    { id: '1031', status: 2, title: professional ? 'Montagem de um aparador' : 'Pintura da sala', solicitante: 'Ana Martins', trabalhador: 'Mariana Costa', idTrabalhador: 'preview-pintura', dataCriacao: '09-10-2026', valor: 280 },
    { id: '1025', status: 3, title: 'Instalação de suporte para TV', solicitante: 'Pedro Lima', trabalhador: 'Lucas Ferreira', idTrabalhador: 'preview-eletrica', dataCriacao: '06-10-2026', valor: null },
  ];
}
