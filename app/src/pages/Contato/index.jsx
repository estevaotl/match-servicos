import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiCheck, FiChevronDown, FiSend, FiTool } from 'react-icons/fi';
import { FormField } from '../../auth/components';
import { isEmail } from '../../auth/data';
import { getApiURL } from '../../marketplace/data';
import { useAccountAction } from '../../account/hooks';
import '../../marketplace/styles.css';
import './styles.css';

const emptyForm = { name: '', email: '', message: '' };
const unconfirmed = 'Não conseguimos confirmar o envio. Sua mensagem foi mantida. Tente novamente em instantes.';
async function sendContact(form, signal) {
  const apiURL = getApiURL();
  if (!apiURL) throw new Error(unconfirmed);
  let response, data;
  try {
    response = await fetch(`${apiURL}/contato/enviar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() }), signal });
    data = await response.json();
  } catch (error) {
    throw new Error(error.name === 'AbortError' ? 'A conexão demorou mais que o esperado. Sua mensagem foi mantida; tente novamente.' : 'Não conseguimos conectar ao serviço de contato. Sua mensagem foi mantida; tente novamente.');
  }
  if (!response.ok || data?.excecao || data?.resposta !== true) throw new Error(unconfirmed);
}
function LetterArt() {
  return <div className="contact-letter-art" aria-hidden="true"><div className="contact-letter-paper"><span>Bons encontros<br />começam assim.</span><i /><i /><i /><span className="contact-letter-stamp"><FiTool /></span></div><div className="contact-envelope"><FiSend /></div><span className="contact-letter-note">De gente.<br /><strong>Para gente.</strong></span></div>;
}
export default function ContatoPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const action = useAccountAction();
  const formRef = useRef(null);
  const confirmation = useRef(null);
  useEffect(() => { if (action.notice) confirmation.current?.focus({ preventScroll: true }); }, [action.notice]);
  function change(name, value) { setForm(current => ({ ...current, [name]: value })); setErrors(current => ({ ...current, [name]: '' })); action.clear(); }
  function inputProps(name) { return { id: `contact-${name}`, name, value: form[name], onChange: event => change(name, event.target.value), disabled: action.busy, required: true, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': [name === 'email' ? 'contact-email-hint' : '', errors[name] ? `contact-${name}-error` : ''].filter(Boolean).join(' ') || undefined }; }
  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Informe seu nome.';
    if (!isEmail(form.email)) nextErrors.email = 'Informe um e-mail válido.';
    if (!form.message.trim()) nextErrors.message = 'Conte como podemos ajudar.';
    if (form.name.trim().length > 120) nextErrors.name = 'Use até 120 caracteres para o nome.';
    if (form.email.trim().length > 254) nextErrors.email = 'Confira o tamanho do e-mail.';
    if (form.message.trim().length > 4000) nextErrors.message = 'Use até 4.000 caracteres na mensagem.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { formRef.current?.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus(); return; }
    await action.run(signal => sendContact(form, signal), () => setForm(emptyForm), 'Mensagem enviada.');
  }
  return <div className="contact-page">
    <Link className="market-back contact-back" to="/"><FiArrowLeft aria-hidden="true" />Voltar ao início</Link>
    <div className="contact-layout"><section className="contact-intro" aria-labelledby="contact-heading"><h1 id="contact-heading">Vamos<br />conversar.</h1><p>Uma dúvida sobre sua conta ou uma ideia para melhorar o Match? Escreva pra gente.</p><LetterArt /></section>
      <section className="contact-form-panel" aria-labelledby="contact-form-heading">{action.notice ? <div className="contact-confirmation" role="status"><span className="contact-confirmation-icon"><FiCheck aria-hidden="true" /></span><h2 ref={confirmation} tabIndex={-1} id="contact-form-heading">Mensagem enviada.</h2><p>Sua mensagem foi encaminhada à equipe. O retorno será pelo e-mail que você informou.</p><button className="market-primary" type="button" onClick={() => { action.clear(); setErrors({}); }}>Enviar outra mensagem <FiSend aria-hidden="true" /></button><Link className="market-subtle" to="/">Voltar ao início <FiArrowRight aria-hidden="true" /></Link></div> : <><div className="contact-form-heading"><h2 id="contact-form-heading">Fale com a equipe.</h2><p>Conte o que aconteceu e como podemos ajudar.</p></div><form ref={formRef} noValidate onSubmit={submit} aria-busy={action.busy}>
        <FormField id="contact-name" label="Nome" error={errors.name}><input {...inputProps('name')} autoComplete="name" placeholder="Como podemos chamar você?" maxLength={120} /></FormField>
        <FormField id="contact-email" label="E-mail" error={errors.email} hint="Vamos usar este e-mail para responder à sua mensagem."><input {...inputProps('email')} type="email" autoComplete="email" placeholder="Seu e-mail" maxLength={254} /></FormField>
        <FormField id="contact-message" label="Mensagem" error={errors.message}><textarea {...inputProps('message')} placeholder="Descreva sua dúvida ou ideia…" rows={6} maxLength={4000} /></FormField><span className="contact-character-count">{form.message.length.toLocaleString('pt-BR')} / 4.000 caracteres</span>
        {action.error && <p className="contact-feedback" role="alert">{action.error}</p>}
        <button className="market-primary contact-submit" type="submit" disabled={action.busy}>{action.busy ? 'Enviando…' : 'Enviar mensagem'}<FiArrowUpRight aria-hidden="true" /></button>
      </form></>}</section>
    </div>
    <section className="contact-help" aria-labelledby="contact-help-heading"><div><h2 id="contact-help-heading">Talvez a resposta<br /> já esteja por aqui.</h2><p>Alguns caminhos para continuar seu próximo projeto.</p></div><div className="contact-questions">
      <details><summary>Quero contratar um profissional. Por onde começo?<FiChevronDown aria-hidden="true" /></summary><p>Busque pelo serviço e pela sua cidade, conheça os perfis e inicie uma conversa. Valores e prazos são combinados diretamente com o profissional. <Link to="/busca">Encontrar um profissional <FiArrowRight aria-hidden="true" /></Link></p></details>
      <details><summary>Não consigo entrar na minha conta.<FiChevronDown aria-hidden="true" /></summary><p>Confira o e-mail usado no cadastro e a senha. Se o problema continuar, conte o que aconteceu no formulário acima para a equipe orientar você. <Link to="/login">Ir para o login <FiArrowRight aria-hidden="true" /></Link></p></details>
      <details><summary>Onde acompanho meus serviços?<FiChevronDown aria-hidden="true" /></summary><p>Na área da conta, abra Serviços para consultar suas solicitações e a situação registrada pelo profissional. <Link to="/minha-conta">Abrir minha conta <FiArrowRight aria-hidden="true" /></Link></p></details>
    </div></section>
  </div>;
}
