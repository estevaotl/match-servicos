import React, { useState } from 'react';
import { FiArrowUpRight, FiEye, FiEyeOff, FiTool } from 'react-icons/fi';
import './styles.css';

export function AuthStory({ registration = false, professional = false }) {
  return <aside className={`auth-story ${registration ? 'auth-story--register' : ''}`} aria-label="Sobre o Match Serviços">
    <div className="auth-story-top"><span className="auth-story-symbol" aria-hidden="true"><FiTool /></span><span>Você imagina. Alguém faz.</span></div>
    <h2>{registration ? professional ? <>Seu talento.<br />Novos encontros.</> : <>Uma ideia.<br />Um bom encontro.</> : <>Bom te ver<br />por aqui.</>}</h2>
    <p>{registration ? professional ? 'Apresente o que você sabe fazer e encontre pessoas que precisam do seu talento.' : 'Encontre profissionais, salve seus favoritos e acompanhe suas solicitações.' : 'Entre para encontrar quem resolve, guardar seus favoritos e acompanhar seus próximos projetos.'}</p>
    <div className="auth-story-collage" aria-hidden="true"><div className="auth-story-photo"><img src="/images/match-workshop.webp" alt="" /></div><span className="auth-story-sticker">Bons encontros.<br /><strong>Coisas bem feitas.</strong><FiArrowUpRight /></span></div>
    <span className="auth-story-end">Feito por gente. Feito pra você.</span>
  </aside>;
}

export function FormField({ id, label, error, hint, children, className = '' }) {
  return <div className={`auth-field ${className}`}><label htmlFor={id}>{label}</label>{children}{hint && <span className="auth-field-hint" id={`${id}-hint`}>{hint}</span>}{error && <span className="auth-field-error" id={`${id}-error`}>{error}</span>}</div>;
}

export function PasswordField({ id, label = 'Senha', value, onChange, error, hint, autoComplete = 'current-password', disabled = false, fieldName }) {
  const [visible, setVisible] = useState(false);
  const description = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  return <FormField id={id} label={label} error={error} hint={hint}><div className="auth-password"><input id={id} data-field={fieldName} type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} required disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={description} /><button type="button" onClick={() => setVisible(!visible)} aria-pressed={visible} aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`} disabled={disabled}>{visible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}</button></div></FormField>;
}

export function FormErrors({ errors }) {
  if (!errors.length) return null;
  return <div className="auth-server-errors" role="alert"><strong>Vamos conferir isso.</strong><ul>{errors.map((error, index) => <li key={index}>{error}</li>)}</ul></div>;
}
