import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowUpRight, FiArrowRight, FiHeart, FiMapPin, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { categories } from '../Home/catalog';
import { ProfessionalCard, categoryIcons } from '../../marketplace/components';
import { demoProfessionals, fetchJSON, isLocalPreview, matchesProfessional, stateOptions, toProfessional } from '../../marketplace/data';
import { useFavorites, useMarketplaceResource } from '../../marketplace/hooks';
import { serviceOptions } from '../../marketplace/services';
import './styles.css';
import '../../marketplace/styles.css';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const city = params.get('cidade') || '';
  const state = params.get('estado') || '';
  const profession = params.get('profissaoEspecifica') || '';
  const category = params.get('categoria') || 'todos';
  const order = params.get('ordem') || 'padrao';
  const onlyFavorites = params.get('favoritos') === '1';
  const [form, setForm] = useState({ q, cidade: city, estado: state, profissaoEspecifica: profession });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  useEffect(() => setForm({ q, cidade: city, estado: state, profissaoEspecifica: profession }), [q, city, state, profession]);

  const requestKey = JSON.stringify([q, city, state, profession]);
  const loader = useCallback(async signal => {
    const query = new URLSearchParams({ q });
    if (city) query.set('cidade', city);
    if (state) query.set('estado', state);
    if (profession) query.set('profissaoEspecifica', profession);
    try {
      const data = await fetchJSON(`/clientes/busca?${query.toString()}`, signal);
      if (!Array.isArray(data.cliente)) throw new Error('Resposta inválida');
      return { people: data.cliente.map(toProfessional), demo: false };
    } catch (error) {
      if (!isLocalPreview()) throw error;
      return { people: demoProfessionals, demo: true };
    }
  }, [q, city, state, profession]);
  const resource = useMarketplaceResource(requestKey, loader);
  const data = resource.value;
  const people = useMemo(() => {
    let result = data?.people || [];
    const filters = { q, cidade: city, estado: state, profissaoEspecifica: profession, categoria: category };
    result = result.filter(person => matchesProfessional(person, filters) && (!onlyFavorites || favorites.includes(String(person.id))));
    if (order === 'nome') result = [...result].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    if (order === 'avaliacao') result = [...result].sort((a, b) => Number((b.rating || '0').replace(',', '.')) - Number((a.rating || '0').replace(',', '.')));
    return result;
  }, [data, q, city, state, profession, category, onlyFavorites, favorites, order]);

  function updateParam(name, value) {
    const next = new URLSearchParams(params);
    if (value && value !== 'todos' && value !== 'padrao') next.set(name, value); else next.delete(name);
    setParams(next);
  }
  function applyFilters(event) {
    event.preventDefault();
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(form)) { if (value.trim()) next.set(key, value.trim()); else next.delete(key); }
    setParams(next); setFiltersOpen(false);
  }
  function clearFilters() { setParams({}); setFiltersOpen(false); }
  const hasFilters = Boolean(q || city || state || profession || category !== 'todos' || onlyFavorites);

  return <div className="marketplace-page search-page">
    <nav className="market-breadcrumb" aria-label="Caminho da página"><Link to="/">Início</Link><span>/</span><span>Encontrar um profissional</span></nav>
    <section className="search-heading"><div><h1>Alguém aí<br />sabe fazer.</h1><p>Encontre quem transforma o seu próximo projeto em coisa feita.</p></div><div className="search-heading-art" aria-hidden="true"><FiSearch /><span>Seu próximo<br /><strong>bom encontro.</strong></span><FiArrowUpRight /></div></section>
    <form className="market-search-bar" onSubmit={applyFilters}>
      <div className="market-field"><FiSearch aria-hidden="true" /><div><label htmlFor="search-query">O que você precisa?</label><input type="search" id="search-query" value={form.q} onChange={event => setForm({ ...form, q: event.target.value })} placeholder="Pintura, montagem, um vazamento…" /></div></div>
      <div className="market-field market-field--city"><FiMapPin aria-hidden="true" /><div><label htmlFor="search-city">Sua cidade</label><input id="search-city" value={form.cidade} onChange={event => setForm({ ...form, cidade: event.target.value })} placeholder="Onde vamos resolver?" /></div></div>
      <button className="market-primary" type="submit">Buscar profissionais <FiArrowUpRight aria-hidden="true" /></button>
    </form>
    <div className="search-categories" aria-label="Especialidades">{categories.map(item => { const Icon = categoryIcons[item.icon]; return <button key={item.id} aria-pressed={category === item.id} className={category === item.id ? 'is-active' : ''} onClick={() => updateParam('categoria', item.id)}><Icon aria-hidden="true" />{item.label}</button>; })}</div>
    <div className="search-layout">
      <aside className="search-filters"><button className="filter-mobile-toggle" aria-expanded={filtersOpen} aria-controls="search-filter-content" onClick={() => setFiltersOpen(!filtersOpen)}><FiSliders aria-hidden="true" />Refinar a busca {filtersOpen ? <FiX /> : <FiArrowRight />}</button>
        <div id="search-filter-content" className={filtersOpen ? 'filter-content is-open' : 'filter-content'}>
          <div className="filter-title"><h2>Do seu jeito.</h2><FiSliders aria-hidden="true" /></div>
          <form onSubmit={applyFilters}>
            <label htmlFor="filter-service">Serviço específico</label><select id="filter-service" value={form.profissaoEspecifica} onChange={event => setForm({ ...form, profissaoEspecifica: event.target.value })}><option value="">Todos os serviços</option>{serviceOptions.map(service => <option value={service} key={service}>{service}</option>)}</select>
            <label htmlFor="filter-state">Estado</label><select id="filter-state" value={form.estado} onChange={event => setForm({ ...form, estado: event.target.value, cidade: '' })}><option value="">Todos os estados</option>{stateOptions.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select>
            <label htmlFor="filter-city">Cidade</label><input id="filter-city" value={form.cidade} onChange={event => setForm({ ...form, cidade: event.target.value })} placeholder="Digite a cidade" />
            <p className="filter-helper">O serviço específico tem prioridade sobre o texto da busca.</p>
            <button type="submit" className="market-primary">Aplicar filtros <FiArrowRight aria-hidden="true" /></button>
            {hasFilters && <button type="button" className="market-subtle" onClick={clearFilters}>Limpar filtros</button>}
          </form>
          <div className="filter-favorites"><label><input type="checkbox" checked={onlyFavorites} onChange={event => updateParam('favoritos', event.target.checked ? '1' : '')} />Só meus favoritos <FiHeart aria-hidden="true" /></label><p>Seus favoritos ficam salvos neste navegador.</p></div>
          <div className="filter-tip"><span className="filter-tip-symbol" aria-hidden="true">↗</span><h3>Um bom match começa na conversa.</h3><p>Compare os trabalhos e combine escopo, prazo e valor diretamente com o profissional.</p></div>
        </div>
      </aside>
      <section className="search-results" aria-label="Resultados da busca">
        <div className="search-results-toolbar"><div><h2>{resource.state === 'loading' ? 'Encontrando talentos…' : `${people.length} ${people.length === 1 ? 'profissional' : 'profissionais'}`}</h2><p>{city ? `Para projetos em ${city}${state ? `, ${state}` : ''}` : 'Seu projeto merece estar em boas mãos.'}</p></div><div><label className="visually-hidden" htmlFor="result-order">Ordenar profissionais</label><select id="result-order" value={order} onChange={event => updateParam('ordem', event.target.value)}><option value="padrao">Ordem padrão</option><option value="avaliacao">Mais avaliados</option><option value="nome">Nome, de A a Z</option></select></div></div>
        {data?.demo && <div className="market-preview-note">Prévia local: perfis, localização, portfólios e avaliações são fictícios. Experimente os exemplos de Nova Friburgo, RJ.</div>}
        <div aria-live="polite" aria-busy={resource.state === 'loading'}>{resource.state === 'loading' ? <div className="results-skeleton" aria-label="Carregando profissionais">{[1,2,3].map(item => <div key={item} />)}</div> : resource.state === 'error' ? <div className="market-empty"><FiSearch /><h3>Não conseguimos carregar os profissionais.</h3><p>O serviço está indisponível neste momento. Tente recarregar a página em instantes.</p></div> : people.length ? <div className="search-results-grid">{people.map(person => <div className="result-tile" key={person.id}><ProfessionalCard person={person} returnQuery={params.toString()} /><button className={`favorite-button ${favorites.includes(String(person.id)) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(person.id)} aria-pressed={favorites.includes(String(person.id))} aria-label={`${favorites.includes(String(person.id)) ? 'Remover' : 'Salvar'} ${person.nome} ${favorites.includes(String(person.id)) ? 'dos' : 'nos'} favoritos`}><FiHeart aria-hidden="true" /></button></div>)}</div> : <div className="market-empty"><FiSearch aria-hidden="true" /><h3>{onlyFavorites ? 'Nenhum favorito nesta busca.' : 'Esse encontro ainda não aconteceu.'}</h3><p>{onlyFavorites ? 'Salve os perfis que você gostou ou desative o filtro de favoritos.' : 'Experimente outra especialidade ou amplie a região da busca.'}</p><button className="market-subtle" onClick={clearFilters}>Ver todos os profissionais <FiArrowRight aria-hidden="true" /></button></div>}</div>
      </section>
    </div>
    <section className="search-pro-callout"><div><h2>É você quem sabe fazer?</h2><p>Seu talento também pode aparecer por aqui.</p></div><Link to="/cadastrar?tipo=profissional">Criar meu perfil <FiArrowUpRight aria-hidden="true" /></Link></section>
  </div>;
}
