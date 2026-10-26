import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiCheck, FiHeart, FiImage, FiMapPin, FiMessageCircle, FiStar, FiTool } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../../contexts/Auth';
import { categories } from '../Home/catalog';
import { Avatar, WorkScene, categoryIcons } from '../../marketplace/components';
import MarketplaceDialog from '../../marketplace/Dialog';
import { createServiceRequest, demoProfessionals, fetchJSON, isLocalPreview, toProfessional, whatsappURL } from '../../marketplace/data';
import { useFavorites, useMarketplaceResource } from '../../marketplace/hooks';
import '../../marketplace/styles.css';
import './styles.css';

function ProjectImage({ project, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (project.demo) return <div className={`project-illustration ${className}`}><WorkScene variant={project.scene} /></div>;
  return project.image && !failed ? <img className={className} src={project.image} alt={project.title} loading="lazy" onError={() => setFailed(true)} /> : <div className={`project-image-unavailable ${className}`}><FiImage aria-hidden="true" /><span>Imagem indisponível</span></div>;
}

export default function ProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const loginURL = `/login?${new URLSearchParams({ redirect: location.pathname + location.search })}`;
  const [params] = useSearchParams();
  const { signed, idCliente, ehPrestadorServicos } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactStatus, setContactStatus] = useState('idle');
  const [tab, setTab] = useState('trabalhos');
  const [preparedURL, setPreparedURL] = useState(null);
  const attempt = useRef(0);
  const submitting = useRef(false);
  useEffect(() => {
    setModal(null); setMessage(''); setContactError(''); setContactStatus('idle'); setPreparedURL(null); setTab('trabalhos'); submitting.current = false;
    return () => { attempt.current += 1; };
  }, [id]);

  const loader = useCallback(async signal => {
    if (id.startsWith('preview-')) {
      const example = isLocalPreview() && demoProfessionals.find(person => person.id === id);
      if (!example) throw new Error('Perfil não encontrado');
      return example;
    }
    const data = await fetchJSON(`/clientes/obter/${encodeURIComponent(id)}`, signal);
    if (!data.cliente || !data.cliente.id) throw new Error('Perfil não encontrado');
    return toProfessional(data.cliente);
  }, [id]);
  const resource = useMarketplaceResource(id, loader);
  const person = resource.value;
  const category = person && categories.find(item => item.id === person.category);
  const Icon = categoryIcons[category?.icon] || FiTool;
  const isFavorite = favorites.includes(String(id));
  const returnParams = new URLSearchParams(params.get('voltar') || '');
  const returnURL = `/busca${returnParams.toString() ? `?${returnParams.toString()}` : ''}`;
  const services = useMemo(() => person ? person.services.split(/[;\n]+/).map(service => service.trim()).filter(Boolean) : [], [person]);
  const contactURL = person && !person.demo ? whatsappURL(person.whatsapp, person.nome, message) : null;

  function requestContact() {
    setContactError('');
    if (person.demo) { setModal({ type: 'contact' }); return; }
    if (!signed || !idCliente) { setContactError('Entre na sua conta para iniciar o contato e acompanhar a solicitação.'); return; }
    if (ehPrestadorServicos === true || ehPrestadorServicos === 'true') { setContactError('Esta opção está disponível para contas de clientes.'); return; }
    if (!contactURL) { setContactError('Este profissional ainda não informou um número válido de WhatsApp.'); return; }
    setModal({ type: 'contact' });
  }
  async function prepareContact() {
    if (person.demo || submitting.current || !contactURL || !signed || !idCliente) return;
    submitting.current = true;
    const generation = attempt.current;
    setContactStatus('sending'); setContactError('');
    try {
      await createServiceRequest(person.id, idCliente);
      if (attempt.current === generation) { setPreparedURL(contactURL); setContactStatus('ready'); }
    } catch (error) {
      if (attempt.current === generation) { setContactError(error.message); setContactStatus('idle'); }
    } finally { if (attempt.current === generation) submitting.current = false; }
  }

  if (resource.state === 'loading') return <div className="marketplace-page profile-page"><Link className="market-back" to={returnURL}><FiArrowLeft />Voltar à busca</Link><div className="profile-loading" role="status">Preparando o perfil…</div></div>;
  if (!person) return <div className="marketplace-page profile-page"><Link className="market-back" to={returnURL}><FiArrowLeft />Voltar à busca</Link><div className="market-empty"><FiSearchFallback /><h1>Não conseguimos abrir este perfil.</h1><p>Ele pode não estar disponível ou o serviço está temporariamente fora do ar.</p><Link className="market-primary" to={returnURL}>Encontrar outro profissional <FiArrowRight aria-hidden="true" /></Link></div></div>;

  return <div className="marketplace-page profile-page">
    <nav className="market-breadcrumb" aria-label="Caminho da página"><Link to="/">Início</Link><span>/</span><Link to={returnURL}>Profissionais</Link><span>/</span><span>{person.nome}</span></nav>
    {person.demo && <div className="market-preview-note">Perfil demonstrativo. Identidade, trabalhos, localização e avaliações são fictícios. Nenhum contato ou solicitação será enviado.</div>}
    <section className={`profile-hero profile-hero--${person.category}`}>
      <div className="profile-hero-info"><div className="profile-specialty"><Icon aria-hidden="true" />{category?.label || 'Serviços gerais'}</div><Avatar person={person} className="profile-main-avatar" /><h1>{person.nome}</h1><p>{person.title}</p><div className="profile-hero-meta">{person.location && <span><FiMapPin aria-hidden="true" />{person.location}</span>}<span><FiStar aria-hidden="true" />{person.rating ? `${person.rating}${person.demo ? ' · nota ilustrativa' : ' de avaliação'}` : 'Ainda sem avaliações'}</span></div></div>
      <div className="profile-hero-art" aria-hidden="true"><div className="profile-art-frame">{person.demo ? <WorkScene variant={person.scene} /> : <Icon />}</div><span className="profile-art-note">Ideias que encontram<br /><strong>quem sabe fazer.</strong></span></div>
      <button className={`profile-save ${isFavorite ? 'is-favorite' : ''}`} aria-pressed={isFavorite} onClick={() => toggleFavorite(id)}><FiHeart aria-hidden="true" />{isFavorite ? 'Perfil salvo' : 'Salvar perfil'}</button>
    </section>
    <div className="profile-layout">
      <div className="profile-main-content">
        <section className="profile-about" aria-labelledby="about-heading"><h2 id="about-heading">Um pouco sobre {person.nome.split(' ')[0]}.</h2><p>{person.bio || `Conheça os serviços de ${person.nome}, explore os trabalhos publicados e converse sobre o que você precisa.`}</p></section>
        <section className="profile-services" aria-labelledby="services-heading"><h2 id="services-heading">O que posso fazer por você.</h2><ul>{services.map(service => <li key={service}><span><FiCheck aria-hidden="true" /></span>{service}</li>)}</ul></section>
        <section className="profile-showcase" aria-labelledby="showcase-heading">
          <div className="profile-tabs" role="tablist" aria-label="Conheça o profissional"><button id="works-tab" role="tab" aria-selected={tab === 'trabalhos'} aria-controls="works-panel" tabIndex={tab === 'trabalhos' ? 0 : -1} onClick={() => setTab('trabalhos')} onKeyDown={event => { if (['ArrowRight','ArrowLeft'].includes(event.key)) { event.preventDefault(); setTab('avaliacoes'); document.getElementById('reviews-tab')?.focus(); } }}>Trabalhos <span>{person.projects.length}</span></button><button id="reviews-tab" role="tab" aria-selected={tab === 'avaliacoes'} aria-controls="reviews-panel" tabIndex={tab === 'avaliacoes' ? 0 : -1} onClick={() => setTab('avaliacoes')} onKeyDown={event => { if (['ArrowRight','ArrowLeft'].includes(event.key)) { event.preventDefault(); setTab('trabalhos'); document.getElementById('works-tab')?.focus(); } }}>Avaliações{person.demo && <span>Exemplos</span>}</button></div>
          <div id="works-panel" role="tabpanel" aria-labelledby="works-tab" hidden={tab !== 'trabalhos'} tabIndex={0}><div className="profile-section-title"><h2 id="showcase-heading">Ideias que viraram trabalho.</h2><p>{person.demo ? 'Uma amostra ilustrativa de como o portfólio pode aparecer.' : 'Imagens compartilhadas pelo profissional.'}</p></div>{person.projects.length ? <div className="profile-projects">{person.projects.map((project, index) => <button className={`project-card project-card--${index % 3}`} key={project.id} onClick={() => setModal({ type: 'project', project })}><div><ProjectImage project={project} />{project.demo && <span className="project-example">Ilustração</span>}<span className="project-expand"><FiArrowUpRight aria-hidden="true" /></span></div><h3>{project.title}</h3><span>Ver detalhes <FiArrowRight aria-hidden="true" /></span></button>)}</div> : <div className="profile-section-empty"><FiImage aria-hidden="true" /><h3>O portfólio ainda está chegando.</h3><p>Peça exemplos de trabalhos ao conversar com o profissional.</p></div>}</div>
          <div id="reviews-panel" role="tabpanel" aria-labelledby="reviews-tab" hidden={tab !== 'avaliacoes'} tabIndex={0}><div className="profile-section-title"><h2>Quem contratou, conta.</h2><p>{person.demo ? 'Comentários fictícios para demonstrar esta área.' : 'As avaliações aparecerão aqui quando estiverem disponíveis.'}</p></div>{person.testimonials.length ? <div className="profile-reviews">{person.testimonials.map(review => <article key={review.id}><div className="review-heading"><strong>{review.name}</strong><span aria-label={`${review.rating} de 5 estrelas`}>{Array.from({ length: review.rating }, (_, index) => <FiStar key={index} aria-hidden="true" />)}</span></div><p>{review.text}</p><span className="review-example">Avaliação ilustrativa</span></article>)}</div> : <div className="profile-section-empty"><FiStar aria-hidden="true" /><h3>Ainda sem avaliações disponíveis.</h3><p>Explore os serviços e o portfólio para conhecer melhor este profissional.</p></div>}</div>
        </section>
      </div>
      <aside className="profile-contact-panel" aria-labelledby="contact-heading"><span className="contact-panel-icon"><FiMessageCircle aria-hidden="true" /></span><h2 id="contact-heading">Toda boa ideia<br /> começa numa conversa.</h2><p>Conte o que você precisa e combine os próximos passos diretamente com {person.nome.split(' ')[0]}.</p><div className="contact-summary"><Icon aria-hidden="true" /><div><strong>{category?.label || 'Serviços gerais'}</strong><span>{person.location || 'Consulte a região de atendimento'}</span></div></div><button className="market-primary contact-whatsapp" onClick={requestContact}><FaWhatsapp aria-hidden="true" />{person.demo ? 'Experimentar o contato' : 'Conversar pelo WhatsApp'}<FiArrowUpRight aria-hidden="true" /></button>{contactError && !modal && <div className="market-form-error" role="alert">{contactError}{!signed && <Link to={loginURL}>Entrar na minha conta <FiArrowRight aria-hidden="true" /></Link>}</div>}<span className="contact-helper">{person.demo ? 'Demonstração sem envio de mensagens.' : 'Valores e prazos são combinados com o profissional.'}</span><div className="contact-hint"><FiTool aria-hidden="true" /><p>Uma descrição do serviço e algumas fotos ajudam a começar a conversa.</p></div></aside>
    </div>
    <Link className="market-back profile-bottom-back" to={returnURL}><FiArrowLeft aria-hidden="true" />Continuar buscando talentos</Link>
    {modal?.type === 'project' && <MarketplaceDialog wide title={modal.project.title} onClose={() => setModal(null)}><div className="project-lightbox"><ProjectImage project={modal.project} /><p>{modal.project.description}</p></div></MarketplaceDialog>}
    {modal?.type === 'contact' && <MarketplaceDialog title={person.demo ? 'Assim começa um bom encontro.' : `Converse com ${person.nome.split(' ')[0]}`} onClose={() => setModal(null)}>
      <div className="contact-dialog-content">{person.demo ? <><div className="contact-demo-art" aria-hidden="true"><FiMessageCircle /><FiArrowUpRight /></div><p>Nos perfis reais, você poderá contar o que precisa, registrar a solicitação e abrir a conversa no WhatsApp.</p><div className="market-preview-note">Você está em uma demonstração. Nenhuma mensagem será enviada e nenhuma solicitação será criada.</div><Link className="market-primary" to="/cadastrar">Criar minha conta <FiArrowRight aria-hidden="true" /></Link></> : contactStatus === 'ready' ? <><span className="contact-ready-icon" aria-hidden="true"><FiCheck /></span><h3>Contato registrado.</h3><p>Agora abra o WhatsApp para combinar os detalhes com o profissional.</p><a className="market-primary" href={preparedURL} target="_blank" rel="noopener noreferrer"><FaWhatsapp aria-hidden="true" />Abrir conversa no WhatsApp <FiArrowUpRight aria-hidden="true" /></a></> : <><label htmlFor="contact-message">O que você gostaria de resolver?</label><textarea id="contact-message" value={message} onChange={event => setMessage(event.target.value)} placeholder="Conte um pouco sobre seu projeto…" maxLength={1500} /><p className="contact-dialog-info">Ao continuar, uma solicitação será registrada na sua conta. Você poderá acompanhar o serviço e abrir a conversa no WhatsApp. Valores e contratação serão combinados diretamente com o profissional.</p>{contactError && <p className="market-form-error" role="alert">{contactError}</p>}<button className="market-primary" disabled={contactStatus === 'sending'} onClick={prepareContact}>{contactStatus === 'sending' ? 'Registrando contato…' : 'Continuar para o WhatsApp'}<FiArrowRight aria-hidden="true" /></button></>}</div>
    </MarketplaceDialog>}
  </div>;
}

function FiSearchFallback() { return <FiTool aria-hidden="true" />; }
