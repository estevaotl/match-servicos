import { categories, mapProfessional, normalizeText, previewProfessionals } from '../pages/Home/catalog';

export const stateOptions = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'], ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'], ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'], ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins'],
];

const projectTitles = {
  pintura: ['Sala com novo acabamento', 'Uma parede, outra história', 'Cuidado nos detalhes'],
  montagem: ['Prateleiras para organizar', 'Cada peça no seu lugar', 'Um canto que ganhou vida'],
  eletrica: ['Luz para um novo ambiente', 'Iluminação com personalidade', 'Detalhes que fazem diferença'],
  hidraulica: ['Um novo ponto de água', 'Reparo com acabamento', 'Funcionalidade no dia a dia'],
};

export const demoProfessionals = previewProfessionals.map(person => ({
  ...person,
  city: 'Nova Friburgo', state: 'RJ', location: 'Nova Friburgo, RJ',
  bio: person.detail + ' Este é um perfil ilustrativo para conhecer a experiência do Match Serviços.',
  projects: projectTitles[person.category].map((title, index) => ({ id: `${person.id}-work-${index}`, title, scene: person.scene, description: 'Projeto ilustrativo para demonstrar a apresentação do portfólio. As imagens são desenhos e não representam trabalhos realizados.', demo: true })),
  testimonials: [
    { id: 'review-1', name: 'Camila R.', rating: 5, text: 'Gostei do cuidado com os detalhes e da clareza na conversa. O resultado ficou como eu imaginava.' },
    { id: 'review-2', name: 'Pedro M.', rating: 5, text: 'Tudo bem combinado desde o começo. Foi uma boa experiência do primeiro contato à entrega.' },
  ],
}));

export const isLocalPreview = () => ['localhost', '127.0.0.1'].includes(window.location.hostname);
export const getApiURL = () => isLocalPreview() ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

export async function fetchJSON(path, signal) {
  const apiURL = getApiURL();
  if (!apiURL) throw new Error('Serviço indisponível');
  const response = await fetch(`${apiURL}${path}`, { signal });
  if (!response.ok) throw new Error(response.status === 404 ? 'Perfil não encontrado' : 'Serviço indisponível');
  const data = await response.json();
  if (data.excecao) throw new Error('Não foi possível carregar os dados');
  return data;
}

export function toProfessional(person) {
  const mapped = mapProfessional(person, getApiURL());
  const address = person.endereco?.[0];
  return {
    ...mapped,
    city: address?.cidade || '', state: address?.estado || '', whatsapp: person.whatsapp,
    bio: person.descricao || person.sobre || '',
    projects: (Array.isArray(person.imagem) ? person.imagem : []).filter(item => item.nomeArquivo).map((item, index) => ({ id: item.id || index, title: item.descricao || `Trabalho ${index + 1}`, image: `${getApiURL()}/imagem/ler/${encodeURIComponent(item.nomeArquivo)}`, description: item.descricao || 'Imagem compartilhada pelo profissional.' })),
    testimonials: [],
  };
}

export function matchesProfessional(person, filters) {
  const categoryName = categories.find(item => item.id === person.category)?.label || '';
  const text = normalizeText(`${person.nome} ${person.services} ${categoryName} ${person.title}`);
  const words = normalizeText(filters.profissaoEspecifica || filters.q).split(/\s+/).filter(word => word && !['de','da','do','das','dos','um','uma','e','para'].includes(word));
  return words.every(word => text.includes(word)) &&
    (!filters.categoria || filters.categoria === 'todos' || filters.categoria === person.category) &&
    (!filters.cidade || normalizeText(person.city).includes(normalizeText(filters.cidade))) &&
    (!filters.estado || filters.estado === person.state);
}

export function whatsappURL(phone, name, message = '') {
  let digits = String(phone || '').replace(/\D/g, '');
  if ([10, 11].includes(digits.length)) digits = '55' + digits;
  if (!/^55\d{10,11}$/.test(digits)) return null;
  const text = message.trim() || `Olá ${name}. Encontrei seu perfil no Match Serviços e gostaria de conversar sobre um orçamento.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export async function createServiceRequest(professionalId, clientId) {
  const response = await fetch(`${getApiURL()}/ordemServico/criar`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idTrabalhador: professionalId, idCliente: clientId }),
  });
  // A API existente retorna texto no sucesso e JSON com excecao na falha.
  const body = await response.text();
  let data;
  try { data = JSON.parse(body); } catch (error) { data = null; }
  if (!response.ok || data?.excecao || (body.trim() !== 'Ordem de Serviço criada.' && data?.success !== true)) throw new Error('Não conseguimos registrar o contato. Tente novamente em instantes.');
}
