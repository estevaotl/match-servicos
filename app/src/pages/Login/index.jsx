import React, { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { useAuth } from '../../contexts/Auth';
import { AuthStory, FormErrors, FormField, PasswordField } from '../../auth/components';
import { isEmail, safeDestination } from '../../auth/data';
import { useAuthSubmission } from '../../auth/hooks';
import MarketplaceDialog from '../../marketplace/Dialog';
import './styles.css';

export default function LoginPage() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState({});
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const { saveUserSate } = useAuth();
  const { submitting, serverErrors, submit, clearServerErrors } = useAuthSubmission();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const destination = safeDestination(params.get('redirect'));
  const registerURL = `/cadastrar${destination !== '/' ? `?${new URLSearchParams({ redirect: destination })}` : ''}`;

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!isEmail(email)) nextErrors.email = 'Informe um e-mail válido.';
    if (!senha) nextErrors.senha = 'Informe sua senha.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { (nextErrors.email ? emailRef.current : passwordRef.current?.querySelector('input'))?.focus(); return; }
    await submit('logar', { email: email.trim(), senha }, session => {
      saveUserSate(session.id, session.nome, session.ehPrestadorServicos, session.estado, session.cidade);
      navigate(destination, { replace: true });
    });
  }

  return <div className="auth-page login-page">
    <Link className="auth-back" to="/"><FiArrowLeft aria-hidden="true" />Voltar ao início</Link>
    <div className="auth-layout">
      <AuthStory />
      <section className="auth-content" aria-labelledby="login-heading">
        <div className="auth-form-heading"><h1 id="login-heading">Entre na sua conta.</h1><p>Seu próximo bom encontro começa aqui.</p></div>
        <FormErrors errors={serverErrors} />
        <form className="auth-form" noValidate onSubmit={handleSubmit} aria-busy={submitting}>
          <FormField id="login-email" label="E-mail" error={errors.email}><input ref={emailRef} id="login-email" type="email" value={email} onChange={event => { setEmail(event.target.value); setErrors({ ...errors, email: '' }); clearServerErrors(); }} autoComplete="username" placeholder="Seu e-mail" disabled={submitting} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'login-email-error' : undefined} /></FormField>
          <div ref={passwordRef}><PasswordField id="login-password" value={senha} onChange={event => { setSenha(event.target.value); setErrors({ ...errors, senha: '' }); clearServerErrors(); }} error={errors.senha} disabled={submitting} /></div>
          <div className="login-help-row"><button type="button" className="auth-text-button" onClick={() => setRecoveryOpen(true)}>Esqueceu sua senha?</button></div>
          <button className="auth-primary" type="submit" disabled={submitting}>{submitting ? 'Entrando…' : 'Entrar na minha conta'}<FiArrowUpRight aria-hidden="true" /></button>
        </form>
        <div className="auth-switch"><span>Ainda não tem uma conta?</span><Link to={registerURL}>Criar minha conta <FiArrowRight aria-hidden="true" /></Link></div>
      </section>
    </div>
    {recoveryOpen && <MarketplaceDialog title="Precisa de ajuda para entrar?" onClose={() => setRecoveryOpen(false)}><div className="login-recovery"><p>A recuperação automática por e-mail ainda não está disponível. Entre em contato com a equipe do Match Serviços para receber orientação sobre o acesso à sua conta.</p><Link className="auth-primary" to="/contato">Falar com a equipe <FiArrowUpRight aria-hidden="true" /></Link></div></MarketplaceDialog>}
  </div>;
}
