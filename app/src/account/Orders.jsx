import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiChevronDown, FiClock, FiClipboard, FiX } from 'react-icons/fi';
import { changeOrderStatus, currency, newestOrders, orderDate, saveOrderValue, statusOptions } from './data';
import { useAccountAction } from './hooks';

export function StatusBadge({ status }) {
  const option = statusOptions.find(item => item.value === status);
  return <span className={`order-status order-status--${option?.tone || 'unknown'}`}><span aria-hidden="true" />{option?.label || 'Situação não informada'}</span>;
}
function OrderCard({ order, professional, demo, onUpdated }) {
  const unique = useId();
  const detailsId = `order-details-${unique}`;
  const statusId = `status-${unique}`;
  const valueId = `value-${unique}`;
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(String(order.status ?? ''));
  const [value, setValue] = useState('');
  const action = useAccountAction();
  async function submitStatus(event) {
    event.preventDefault(); if (!professional || demo || Number(status) === order.status) return;
    await action.run(signal => changeOrderStatus(order.id, status, signal), () => onUpdated({ ...order, status: Number(status) }), 'Situação do serviço atualizada.');
  }
  async function submitValue(event) {
    event.preventDefault(); if (!professional || demo || order.status !== 2) return;
    await action.run(signal => saveOrderValue(order.id, value.trim(), signal), amount => { onUpdated({ ...order, valor: amount }); setValue(''); }, 'Valor registrado neste serviço.');
  }
  const counterpart = professional ? order.solicitante : order.trabalhador;
  return <li className={`account-order ${expanded ? 'is-expanded' : ''}`}>
    <div className="account-order-summary"><span className="order-person-avatar" aria-hidden="true">{(counterpart || '?').split(' ').map(word => word[0]).slice(0,2).join('')}</span><div className="order-main"><span className="order-reference">Solicitação #{order.id}</span><h3>{order.title || counterpart || 'Solicitação de serviço'}</h3><p>{professional ? 'Cliente' : 'Profissional'}: {counterpart || 'Nome não informado'}</p></div><div className="order-meta"><StatusBadge status={order.status} /><span><FiClock aria-hidden="true" />{orderDate(order.dataCriacao)}</span></div><button className="order-expand" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={detailsId} aria-label={`${expanded ? 'Fechar' : 'Ver'} detalhes da solicitação ${order.id}`}><FiChevronDown aria-hidden="true" /></button></div>
    {expanded && <div className="account-order-details" id={detailsId}>
      {order.status === 3 ? <p className="order-cancel-note"><FiX aria-hidden="true" />Este serviço está cancelado.</p> : order.status !== null && <ol className="order-progress" aria-label={`Etapas da solicitação ${order.id}`}>{['Em aberto', 'Em andamento', 'Concluído'].map((name, index) => <li key={name} className={index <= order.status ? 'is-reached' : ''} aria-current={index === order.status ? 'step' : undefined}><span>{index < order.status ? <FiCheck aria-hidden="true" /> : index + 1}</span>{name}</li>)}</ol>}
      <div className="order-detail-info"><div><span>Valor combinado</span><strong>{order.valor ? currency(order.valor) : 'Ainda não informado'}</strong></div>{!professional && order.idTrabalhador && <Link to={`/profile/${encodeURIComponent(order.idTrabalhador)}`}>Ver perfil do profissional <FiArrowRight aria-hidden="true" /></Link>}</div>
      {professional ? <div className="order-management"><form onSubmit={submitStatus}><label htmlFor={statusId}>Situação do serviço</label><div><select id={statusId} value={status} onChange={event => { setStatus(event.target.value); action.clear(); }} disabled={demo || action.busy}>{order.status === null && <option value="">Selecione</option>}{statusOptions.map(item => <option value={item.value} key={item.value}>{item.label}</option>)}</select><button className="auth-secondary" disabled={demo || action.busy || status === '' || Number(status) === order.status}>{action.busy ? 'Salvando…' : 'Salvar situação'}</button></div></form>{order.status === 2 && !order.valor && <form onSubmit={submitValue}><label htmlFor={valueId}>Valor combinado (R$)</label><div><input id={valueId} inputMode="decimal" value={value} placeholder="0,00" disabled={demo || action.busy} onChange={event => { setValue(event.target.value); action.clear(); }} /><button className="auth-secondary" disabled={demo || action.busy}>Registrar valor</button></div></form>}</div> : <p className="order-detail-helper">O profissional registra a situação do serviço. Combine os detalhes diretamente com ele.</p>}
      {demo && <p className="account-inline-note">Serviço ilustrativo. Esta prévia não altera situações ou valores.</p>}
      {action.error && <p className="account-feedback is-error" role="alert">{action.error}</p>}{action.notice && <p className="account-feedback is-success" role="status">{action.notice}</p>}
    </div>}
  </li>;
}
export default function Orders({ resource, professional, demo, onUpdated, filter = 'todos', setFilter, compact = false, onRetry }) {
  const orders = newestOrders(resource.value || []);
  const filtered = filter === 'todos' ? orders : orders.filter(order => String(order.status) === filter);
  const visible = compact ? filtered.slice(0,3) : filtered;
  return <div className="account-orders">
    {!compact && <div className="order-filter-bar"><label htmlFor="order-filter">Situação</label><select id="order-filter" value={filter} onChange={event => setFilter(event.target.value)}><option value="todos">Todos os serviços</option>{statusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{resource.state === 'ready' && <span role="status">{filtered.length} {filtered.length === 1 ? 'serviço' : 'serviços'}</span>}</div>}
    {resource.state === 'loading' ? <div className="account-loading" role="status">Carregando seus serviços…</div> : resource.state === 'error' ? <div className="account-empty"><FiClipboard aria-hidden="true" /><h3>Não conseguimos carregar seus serviços.</h3><p>Seu perfil está disponível. Tente carregar as solicitações novamente.</p><button className="auth-secondary" onClick={onRetry}>Tentar novamente</button></div> : visible.length ? <ul className="account-order-list">{visible.map(order => <OrderCard key={order.id} order={order} professional={professional} demo={demo} onUpdated={onUpdated} />)}</ul> : <div className="account-empty"><FiClipboard aria-hidden="true" /><h3>{orders.length ? 'Nenhum serviço nesta situação.' : professional ? 'Seu próximo trabalho começa numa conversa.' : 'Seu próximo projeto pode começar aqui.'}</h3><p>{orders.length ? 'Escolha outra situação para ver seus serviços.' : professional ? 'As solicitações de clientes vão aparecer aqui para você acompanhar.' : 'Encontre um profissional e inicie um contato para acompanhar sua solicitação.'}</p>{orders.length ? <button className="auth-secondary" onClick={() => setFilter('todos')}>Ver todos os serviços</button> : !professional && <Link className="market-primary" to="/busca">Encontrar um profissional <FiArrowRight aria-hidden="true" /></Link>}</div>}
  </div>;
}
