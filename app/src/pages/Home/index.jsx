import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiArrowRight, FiCheck, FiDroplet, FiGrid, FiHome, FiMapPin, FiMessageCircle, FiSearch, FiSun, FiTool, FiX, FiZap } from 'react-icons/fi';
import { LuPaintbrush } from 'react-icons/lu';
import { useAuth } from '../../contexts/Auth';
import { categories, categoryFor, mapProfessional, previewProfessionals } from './catalog';
import { WorkScene, ProfessionalCard } from '../../marketplace/components';
import './styles.css';

const icons = { grid: FiGrid, zap: FiZap, droplet: FiDroplet, brush: LuPaintbrush, tool: FiTool, home: FiHome, sun: FiSun };

function Spark() {
  return <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true"><path d="M20 3v34M3 20h34M8 8l24 24M8 32L32 8" /></svg>;
}

const HomePage = () => {
  const { cidade, estado } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchError, setSearchError] = useState('');
  const [city, setCity] = useState(typeof cidade === 'string' ? cidade : '');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [professionals, setProfessionals] = useState([]);
  const [status, setStatus] = useState('loading');
  const [preview, setPreview] = useState(null);
  const [heroFailed, setHeroFailed] = useState(false);
  const dialog = useRef(null);
  const searchInput = useRef(null);
  const previousFocus = useRef(null);
  const apiURL = ['localhost', '127.0.0.1'].includes(window.location.hostname) ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  useEffect(() => { if (cidade && typeof cidade === 'string') setCity(cidade); }, [cidade]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let current = true;
    async function loadProfessionals() {
      try {
        if (!apiURL) throw new Error('API não configurada');
        const response = await fetch(`${apiURL}/clientes/obterParaCarrossel`, { signal: controller.signal });
        if (!response.ok) throw new Error('Não foi possível carregar os profissionais');
        const data = await response.json();
        if (!Array.isArray(data.cliente)) throw new Error('Resposta inválida');
        if (current) { setProfessionals(data.cliente.map(person => mapProfessional(person, apiURL))); setStatus('live'); }
      } catch (error) {
        if (current) {
          const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
          setProfessionals(isLocal ? previewProfessionals : []);
          setStatus(isLocal ? 'preview' : 'error');
        }
      } finally { clearTimeout(timeout); }
    }
    loadProfessionals();
    return () => { current = false; clearTimeout(timeout); controller.abort(); };
  }, [apiURL]);

  useEffect(() => { if (preview && dialog.current && !dialog.current.open) dialog.current.showModal(); }, [preview]);

  const filteredProfessionals = useMemo(() => professionals.filter(person => activeCategory === 'todos' || person.category === activeCategory), [professionals, activeCategory]);

  function focusSearch() { searchInput.current?.focus(); }
  function showPreview(person) { previousFocus.current = document.activeElement; setPreview(person); }
  function closePreview() { dialog.current?.close(); }
  function finishPreview() { setPreview(null); previousFocus.current?.focus(); }
  function selectCategory(category) { setActiveCategory(category.id); setSearch(''); setSearchError(''); }

  function handleSearch(event) {
    event.preventDefault();
    if (!search.trim()) { setSearchError('Conte qual serviço você está procurando.'); focusSearch(); return; }
    setSearchError('');
    const params = new URLSearchParams({ q: search.trim() });
    if (city.trim()) params.set('cidade', city.trim());
    if (estado && city.trim() === cidade) params.set('estado', estado);
    navigate(`/busca?${params.toString()}`);
  }

  return <div className="match-home">
    <section className="match-hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <span className="hero-intro"><span className="intro-spark"><Spark /></span> Você imagina. Alguém faz.</span>
        <h1 id="hero-heading">Bora tirar<br />isso do<br />papel?</h1>
        <p>Daquele pequeno reparo à próxima grande ideia. Encontre quem sabe fazer e dê um novo jeito à sua casa.</p>
        <div className="hero-reassurance"><span><FiCheck aria-hidden="true" /> Talentos da sua região</span><span><FiCheck aria-hidden="true" /> Contato direto</span></div>
      </div>
      <div className="hero-art">
        <div className="hero-blue-shape" />
        <div className="hero-photo-wrap">
          {!heroFailed ? <img className="hero-photo" src="/images/match-workshop.webp" alt="Imagem ilustrativa de um marceneiro em sua oficina" fetchpriority="high" onError={() => setHeroFailed(true)} /> : <div className="hero-photo-fallback"><FiTool aria-hidden="true" /><span>Talento que<br />faz acontecer.</span></div>}
        </div>
        <div className="match-stamp"><FiArrowUpRight aria-hidden="true" /><span>Feito por gente.<br /><strong>Feito pra você.</strong></span></div>
        <div className="hero-job-note"><span className="job-note-icon"><FiTool aria-hidden="true" /></span><div><span>Sua ideia merece sair do papel</span><strong>Vamos encontrar seu match?</strong></div><FiCheck className="job-note-check" aria-hidden="true" /></div>
        <span className="hero-doodle" aria-hidden="true"><svg viewBox="0 0 90 90"><path d="M8 75C20 25 35 6 48 13S60 60 41 67s-9-48 40-44M69 16l14 7-7 14" /></svg></span>
      </div>
    </section>

    <section className="match-search-section" aria-label="Buscar um serviço">
      <form className="match-search" onSubmit={handleSearch}>
        <div className="search-service-field"><FiSearch aria-hidden="true" /><div><label htmlFor="match-service">O que vamos resolver hoje?</label><input ref={searchInput} id="match-service" type="search" value={search} onChange={event => { setSearch(event.target.value); setSearchError(''); }} placeholder="Pintura, montagem, um vazamento…" aria-invalid={Boolean(searchError)} aria-describedby={searchError ? 'match-search-error' : undefined} /></div></div>
        <div className="search-city-field"><FiMapPin aria-hidden="true" /><div><label htmlFor="match-city">Em qual cidade?</label><input id="match-city" value={city} onChange={event => setCity(event.target.value)} placeholder="Digite sua cidade" /></div></div>
        <button type="submit" className="match-primary" disabled={status === 'loading'}>{status === 'loading' ? 'Carregando…' : 'Encontrar meu match'}<FiArrowUpRight aria-hidden="true" /></button>
      </form>
      {searchError && <p id="match-search-error" className="search-error" role="alert">{searchError}</p>}
      <div className="popular-searches"><span>Precisa de uma ideia?</span>{['Montar um móvel', 'Pintar a casa', 'Instalar uma luminária'].map((label, index) => <button key={label} onClick={() => { setSearch(['Montagem', 'Pintura', 'luminárias'][index]); focusSearch(); }}>{label}</button>)}</div>
    </section>

    <div className="match-ribbon" aria-label="Pequenos reparos. Grandes ideias. Bons encontros."><div className="ribbon-track" aria-hidden="true">{[0, 1, 2, 3].map(index => <span key={index}>Pequenos reparos <Spark /> Grandes ideias <Spark /> Bons encontros <Spark /></span>)}</div></div>

    <section className="match-categories" id="servicos" aria-labelledby="categories-heading">
      <div className="section-heading"><h2 id="categories-heading">Para cada tarefa, um talento.</h2><span>Qual é o seu próximo projeto?</span></div>
      <div className="category-list">{categories.map(category => { const Icon = icons[category.icon]; return <button className={`category-button ${activeCategory === category.id ? 'is-active' : ''}`} key={category.id} onClick={() => selectCategory(category)} aria-pressed={activeCategory === category.id}><span className={`category-icon category-icon--${category.id}`}><Icon aria-hidden="true" /></span><span>{category.label}</span></button>; })}</div>
    </section>

    <section className="match-professionals" id="profissionais" aria-labelledby="professionals-heading">
      <div className="section-heading"><div><h2 id="professionals-heading">Gente boa no que faz.</h2><p>Conheça os serviços. Descubra quem combina com o seu projeto.</p></div><Link className="match-text-button" to="/busca">Explorar todos <FiArrowRight aria-hidden="true" /></Link></div>
      {status === 'preview' && <div className="preview-notice"><FiGrid aria-hidden="true" /><span>Prévia com perfis e avaliações fictícios. Explore os filtros e os portfólios na busca de profissionais.</span></div>}
      <div aria-live="polite">{status === 'loading' ? <div className="professionals-loading">Buscando profissionais…</div> : filteredProfessionals.length ? <div className="professionals-grid">{filteredProfessionals.map(person => <ProfessionalCard key={person.id} person={person} onPreview={showPreview} />)}</div> : <div className="professionals-empty"><FiSearch aria-hidden="true" /><h3>{status === 'error' ? 'Não conseguimos carregar os profissionais.' : 'Ainda não encontramos esse talento por aqui.'}</h3><p>{status === 'preview' ? 'Experimente pintura, montagem, elétrica ou hidráulica para explorar os exemplos.' : 'Tente outra especialidade ou volte em alguns instantes.'}</p><button className="match-text-button" onClick={() => selectCategory(categories[0])}>Ver todos os serviços <FiArrowRight aria-hidden="true" /></button></div>}</div>
    </section>

    <section className="match-how" id="como-funciona" aria-labelledby="how-heading">
      <div className="how-intro"><span className="how-symbol"><Spark /></span><h2 id="how-heading">Menos procura.<br />Mais resolvido.</h2><p>Um caminho simples entre o que você precisa e quem sabe fazer.</p></div>
      <ol className="how-steps"><li><span className="step-number">1</span><div><h3>Conte o que precisa</h3><p>Busque pelo serviço e escolha sua região.</p></div></li><li><span className="step-number">2</span><div><h3>Encontre seu profissional</h3><p>Explore perfis, trabalhos e avaliações.</p></div></li><li><span className="step-number">3</span><div><h3>Converse e combine</h3><p>Entre em contato pelo WhatsApp e acerte os detalhes.</p></div></li></ol>
    </section>

    <section className="match-pro-cta"><div className="pro-cta-icon"><FiTool aria-hidden="true" /></div><div><h2>Seu talento merece ser encontrado.</h2><p>É profissional? Crie seu perfil e apresente o que você sabe fazer.</p></div><Link to="/cadastrar?tipo=profissional">Quero oferecer serviços <FiArrowUpRight aria-hidden="true" /></Link></section>

    <dialog ref={dialog} className="professional-dialog" onClose={finishPreview} aria-labelledby="preview-name">
      {preview && <><button className="dialog-close" onClick={closePreview} aria-label="Fechar perfil"><FiX aria-hidden="true" /></button><div className="dialog-work"><WorkScene variant={preview.scene} /><span className="example-tag">Perfil de exemplo</span></div><div className="dialog-content"><span className="dialog-specialty">{categories.find(category => category.id === categoryFor(preview.services))?.label}</span><h2 id="preview-name">{preview.nome}</h2><p>{preview.detail}</p><h3>Serviços que oferece</h3><p>{preview.services}</p><div className="dialog-demo-message"><FiMessageCircle aria-hidden="true" /><p>Este perfil é fictício, criado para você experimentar a nova interface. Nos perfis reais, você poderá ver o portfólio e iniciar o contato pelo WhatsApp.</p></div><Link className="match-primary" to={`/profile/${preview.id}`} onClick={closePreview}>Ver perfil completo <FiArrowUpRight aria-hidden="true" /></Link></div></>}
    </dialog>
  </div>;
};

export default HomePage;
