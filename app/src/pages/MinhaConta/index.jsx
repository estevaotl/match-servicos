import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiCamera, FiCheck, FiClipboard, FiHeart, FiHome, FiMapPin, FiTool, FiUser } from 'react-icons/fi';
import { useAuth } from '../../contexts/Auth';
import { isLocalPreview } from '../../marketplace/data';
import { useFavorites, useMarketplaceResource } from '../../marketplace/hooks';
import { demoAccount, demoOrders, loadAccount, loadOrders, statusOptions } from '../../account/data';
import Orders from '../../account/Orders';
import Photos, { AccountAvatar } from '../../account/Photos';
import ProfileEditor from '../../account/ProfileEditor';
import '../../marketplace/styles.css';
import './styles.css';

const sections = [{ id: 'inicio', name: 'Visão geral', Icon: FiHome }, { id: 'servicos', name: 'Serviços', Icon: FiClipboard }, { id: 'perfil', name: 'Meu perfil', Icon: FiUser }, { id: 'fotos', name: 'Fotos e portfólio', Icon: FiCamera }];

function AccountWorkspace({ initialProfile, preview }) {
  const [profile, setProfile] = useState(initialProfile);
  const [params, setParams] = useSearchParams();
  const section = sections.some(item => item.id === params.get('secao')) ? params.get('secao') : 'inicio';
  const filter = ['0','1','2','3'].includes(params.get('situacao')) ? params.get('situacao') : 'todos';
  const [retry, setRetry] = useState(0);
  const [updates, setUpdates] = useState({});
  const { favorites } = useFavorites();
  const accountId = profile.id;
  const professional = profile.professional;
  const loader = useCallback(signal => preview ? Promise.resolve(demoOrders(professional)) : loadOrders({ id: accountId, professional }, signal), [preview, accountId, professional]);
  const resource = useMarketplaceResource(`${profile.id}:${profile.professional}:${retry}`, loader);
  const orders = resource.value?.map(order => updates[order.id] || order) || [];
  const orderResource = { ...resource, value: orders };
  useEffect(() => setUpdates({}), [profile.professional]);
  function navigateSection(next, status) {
    const nextParams = new URLSearchParams(params); nextParams.set('secao', next);
    if (status && status !== 'todos') nextParams.set('situacao', status); else nextParams.delete('situacao');
    setParams(nextParams);
  }
  function updateOrder(order) { setUpdates(current => ({ ...current, [order.id]: order })); }
  function retryOrders() { setUpdates({}); setRetry(current => current + 1); }
  const publicProfile = profile.demo ? '/profile/preview-montagem' : `/profile/${encodeURIComponent(profile.id)}`;
  const activeCount = resource.state === 'ready' ? orders.filter(order => [0,1].includes(order.status)).length : null;
  const orderProps = { resource: orderResource, professional: profile.professional, demo: profile.demo, onUpdated: updateOrder, filter, setFilter: value => navigateSection('servicos', value), onRetry: retryOrders };
  return <div className="account-page">
    <div className="account-page-top"><h1>Minha conta</h1><Link to="/busca">Encontrar profissionais <FiArrowUpRight aria-hidden="true" /></Link></div>
    {profile.demo && <div className="account-preview-banner"><div><FiTool aria-hidden="true" /><p><strong>Prévia da área de {profile.professional ? 'profissional' : 'cliente'}.</strong> Pessoas, serviços e valores são fictícios. Nenhum dado será enviado ou alterado.</p></div><div><Link aria-current={!profile.professional ? 'page' : undefined} to="/minha-conta?preview=cliente">Cliente</Link><Link aria-current={profile.professional ? 'page' : undefined} to="/minha-conta?preview=profissional">Profissional</Link></div></div>}
    <div className="account-layout"><aside className="account-sidebar"><div className="account-identity"><AccountAvatar profile={profile} /><div><strong>{profile.nome}</strong><span>{profile.professional ? 'Profissional' : 'Cliente'}</span></div></div><nav className="account-navigation" aria-label="Área da conta">{sections.map(({ id, name, Icon }) => <Link key={id} to={`?${new URLSearchParams({ ...(preview ? { preview } : {}), secao: id })}`} aria-current={section === id ? 'page' : undefined}><Icon aria-hidden="true" /><span>{id === 'fotos' && !profile.professional ? 'Foto do perfil' : name}</span>{id === 'servicos' && activeCount !== null && activeCount > 0 && <span className="account-nav-count" aria-label={`${activeCount} serviços ativos`}>{activeCount}</span>}</Link>)}<Link to="/busca?favoritos=1"><FiHeart aria-hidden="true" /><span>Meus favoritos</span>{favorites.length > 0 && <span className="account-nav-count">{favorites.length}</span>}</Link></nav><div className="account-location"><FiMapPin aria-hidden="true" /><span>{profile.cidade ? `${profile.cidade}${profile.estado ? `, ${profile.estado}` : ''}` : 'Complete seu endereço no perfil'}</span></div>{profile.professional && <Link className="account-public-link" to={publicProfile}>Ver meu perfil público <FiArrowUpRight aria-hidden="true" /></Link>}</aside>
    <div className="account-main"><section className="account-section" hidden={section !== 'inicio'} aria-label="Visão geral">
      <div className="account-hero"><div><span className="account-greeting">Olá, {profile.nome.split(' ')[0]}.</span><h2>{profile.professional ? <>Seu talento,<br />em movimento.</> : <>Vamos tirar<br />ideias do papel.</>}</h2><p>{profile.professional ? 'Acompanhe seus trabalhos e cuide dos próximos bons encontros.' : 'Seus contatos e projetos ficam reunidos aqui, do primeiro encontro ao serviço feito.'}</p><button onClick={() => navigateSection('servicos')} className="market-primary">{profile.professional ? 'Acompanhar meus trabalhos' : 'Acompanhar meus serviços'}<FiArrowUpRight aria-hidden="true" /></button></div><div className="account-hero-art" aria-hidden="true"><div className="account-paper"><FiClipboard /><span>Coisas boas<br />pela frente.</span><span className="account-paper-lines"><i /><i /><i /></span></div><span className="account-paper-sticker"><FiCheck />Bora fazer.</span><FiTool className="account-hero-tool" /></div></div>
      <div className="account-overview-status" aria-label="Resumo dos serviços">{statusOptions.map(option => <button key={option.value} onClick={() => navigateSection('servicos', String(option.value))} aria-label={`Ver serviços: ${option.label}`}><strong>{resource.state === 'ready' ? orders.filter(order => order.status === option.value).length : '—'}</strong><span><i className={`status-dot status-dot--${option.tone}`} aria-hidden="true" />{option.label}</span></button>)}</div>
      <div className="account-section-heading"><div><h2>{profile.professional ? 'Seus encontros mais recentes' : 'Seus serviços mais recentes'}</h2><p>{profile.professional ? 'Cada conversa pode virar um trabalho bem feito.' : 'Veja como estão as suas últimas solicitações.'}</p></div><button onClick={() => navigateSection('servicos')} className="account-text-button">Ver todos <FiArrowRight aria-hidden="true" /></button></div>
      <Orders {...orderProps} filter="todos" compact />
      <div className="account-next-step"><span><FiHeart aria-hidden="true" /></span><div><h3>{profile.professional ? 'Seu perfil também trabalha por você.' : 'Gostou de um profissional? Guarde esse encontro.'}</h3><p>{profile.professional ? 'Fotos e serviços atualizados ajudam as pessoas a conhecer seu trabalho.' : 'Os perfis que você salva ficam nos favoritos deste navegador.'}</p></div>{profile.professional ? <button onClick={() => navigateSection('fotos')}>Cuidar do meu portfólio <FiArrowRight aria-hidden="true" /></button> : <Link to="/busca?favoritos=1">Ver meus favoritos <FiArrowRight aria-hidden="true" /></Link>}</div>
    </section>
    <section className="account-section" hidden={section !== 'servicos'} aria-label="Meus serviços"><div className="account-section-heading"><div><h2>{profile.professional ? 'Do primeiro contato ao trabalho feito.' : 'Cada projeto tem seu próximo passo.'}</h2><p>{profile.professional ? 'Acompanhe suas solicitações, registre a situação e informe os valores combinados.' : 'Acompanhe a situação registrada pelos profissionais e volte aos seus perfis.'}</p></div></div><Orders {...orderProps} /></section>
    <section className="account-section" hidden={section !== 'perfil'} aria-label="Meu perfil"><ProfileEditor profile={profile} onSaved={setProfile} /></section>
    <section className="account-section" hidden={section !== 'fotos'} aria-label={profile.professional ? 'Fotos e portfólio' : 'Foto do perfil'}><Photos profile={profile} onUploaded={setProfile} /></section>
    </div></div>
  </div>;
}
function AccountLoader({ id, preview }) {
  const [retry, setRetry] = useState(0);
  const loader = useCallback(signal => preview ? Promise.resolve(demoAccount(preview === 'profissional')) : loadAccount(id, signal), [id, preview]);
  const resource = useMarketplaceResource(`${id}:${preview}:${retry}`, loader);
  if (resource.state === 'loading') return <div className="account-page"><div className="account-loading" role="status">Preparando sua conta…</div></div>;
  if (resource.state === 'error') return <div className="account-page"><div className="account-empty"><FiUser aria-hidden="true" /><h1>Não conseguimos abrir sua conta.</h1><p>O serviço está temporariamente indisponível. Sua sessão foi mantida para você tentar novamente.</p><button className="market-primary" onClick={() => setRetry(retry + 1)}>Tentar novamente</button><Link className="market-subtle" to="/">Voltar ao início</Link></div></div>;
  return <AccountWorkspace initialProfile={resource.value} preview={preview} />;
}
export default function MinhaContaPage() {
  const { idCliente, signed, ready } = useAuth();
  const [params] = useSearchParams();
  const preview = isLocalPreview() && ['cliente','profissional'].includes(params.get('preview')) ? params.get('preview') : '';
  if (!ready) return <div className="account-page"><div className="account-loading" role="status">Preparando sua conta…</div></div>;
  if (preview || (signed && /^\d+$/.test(String(idCliente)) && Number(idCliente) > 0)) return <AccountLoader key={preview || idCliente} id={idCliente} preview={preview} />;
  return <div className="account-page"><div className="account-entry"><span className="account-entry-icon"><FiUser aria-hidden="true" /></span><h1>Seu próximo encontro<br />tem um lugar aqui.</h1><p>Entre para acompanhar seus serviços, atualizar seu perfil e cuidar dos próximos projetos.</p><Link className="market-primary" to="/login?redirect=%2Fminha-conta">Entrar na minha conta <FiArrowUpRight aria-hidden="true" /></Link><Link className="market-subtle" to="/cadastrar?redirect=%2Fminha-conta">Criar minha conta <FiArrowRight aria-hidden="true" /></Link>{isLocalPreview() && <div className="account-entry-preview"><span>Conheça a prévia com dados fictícios:</span><Link to="?preview=cliente">Área de cliente</Link><Link to="?preview=profissional">Área de profissional</Link></div>}</div></div>;
}
