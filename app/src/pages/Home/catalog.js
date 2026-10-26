export const categories = [
  { id: 'todos', label: 'Todos os serviços', icon: 'grid' },
  { id: 'eletrica', label: 'Elétrica', icon: 'zap' },
  { id: 'hidraulica', label: 'Hidráulica', icon: 'droplet' },
  { id: 'pintura', label: 'Pintura', icon: 'brush' },
  { id: 'montagem', label: 'Montagem', icon: 'tool' },
  { id: 'reformas', label: 'Reformas', icon: 'home' },
  { id: 'jardinagem', label: 'Jardinagem', icon: 'sun' },
];

// Perfis fictícios para a prévia local, nunca apresentados como cadastros reais.
export const previewProfessionals = [
  { id: 'preview-pintura', nome: 'Mariana Costa', initials: 'MC', category: 'pintura', title: 'Pintura e novos começos', services: 'Pintura de paredes e tetos', detail: 'Acabamento cuidadoso, do primeiro rolo ao último detalhe.', rating: '4,9', reviews: 32, scene: 'paint', demo: true },
  { id: 'preview-montagem', nome: 'Rafael Almeida', initials: 'RA', category: 'montagem', title: 'Tudo no seu lugar', services: 'Montagem de móveis e instalação de prateleiras', detail: 'Móveis montados e ideias que saem do papel.', rating: '5,0', reviews: 24, scene: 'shelf', demo: true },
  { id: 'preview-eletrica', nome: 'Lucas Ferreira', initials: 'LF', category: 'eletrica', title: 'Uma boa ideia acesa', services: 'Instalação de luminárias e troca de tomadas', detail: 'Iluminação e pequenos reparos para sua casa.', rating: '4,8', reviews: 41, scene: 'light', demo: true },
  { id: 'preview-hidraulica', nome: 'André Santos', initials: 'AS', category: 'hidraulica', title: 'Deixa que eu resolvo', services: 'Conserto de vazamentos de torneiras e canos', detail: 'Cuidado com os reparos que não podem esperar.', rating: '4,9', reviews: 18, scene: 'water', demo: true },
];

export const normalizeText = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function categoryFor(services) {
  const text = normalizeText(services);
  if (/pint|lixar|primer/.test(text)) return 'pintura';
  if (/eletri|lumin|tomada|disjunt|ventilador/.test(text)) return 'eletrica';
  if (/torneira|vazam|cano|ralo|hidraul|pia/.test(text)) return 'hidraulica';
  if (/monta|move|prateleira|carpint/.test(text)) return 'montagem';
  if (/jardin|grama|planta/.test(text)) return 'jardinagem';
  return 'reformas';
}

export function mapProfessional(person, apiURL) {
  const services = Array.isArray(person.servicosPrestados) ? person.servicosPrestados.join(', ') : person.servicosPrestados || 'Serviços gerais';
  const address = person.endereco?.[0];
  const file = person.imagemPerfil?.[0]?.nomeArquivo;
  return {
    id: person.id,
    nome: person.nome || 'Profissional',
    initials: (person.nome || 'Profissional').split(' ').filter(Boolean).slice(0, 2).map(name => name[0]).join(''),
    category: categoryFor(services), services, title: services,
    location: address ? [address.cidade, address.estado].filter(Boolean).join(', ') : '',
    image: file ? `${apiURL}/imagem/ler/${encodeURIComponent(file)}` : null,
    rating: Number(person.media_avaliacao) > 0 ? Number(person.media_avaliacao).toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : null,
    demo: false,
  };
}
