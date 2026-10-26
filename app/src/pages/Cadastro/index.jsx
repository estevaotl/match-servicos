import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiCheck, FiHome, FiTool, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/Auth';
import { AuthStory, FormErrors, FormField, PasswordField } from '../../auth/components';
import { digitsOnly, formatDocument, formatPhone, formatPostcode, registrationPayload, safeDestination, validateRegistration } from '../../auth/data';
import { useAuthSubmission } from '../../auth/hooks';
import { stateOptions } from '../../marketplace/data';
import { serviceOptions } from '../../marketplace/services';
import './styles.css';

const stepNames = ['Sua conta', 'Seu perfil', 'Seu endereço'];
const stepTitles = ['Vamos criar sua conta.', 'Seu perfil, do seu jeito.', 'Onde vai ser seu match?'];
const stepDescriptions = ['Escolha como você quer começar e preencha seus dados de acesso.', 'Complete sua identificação e conte um pouco mais sobre você.', 'Informe seu endereço para encontrar bons encontros na sua região.'];

export default function CadastroPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ tipo: params.get('tipo') === 'profissional' ? 'profissional' : 'cliente', entidade: 'pessoa', nome: '', email: '', whatsapp: '', senha: '', confirmacao: '', documento: '', dataNascimento: '', genero: '', razaoSocial: '', situacaoTributaria: '', inscricaoEstadual: '', servicos: [], cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [postalStatus, setPostalStatus] = useState('idle');
  const [postalMessage, setPostalMessage] = useState('');
  const { submitting, serverErrors, submit, clearServerErrors } = useAuthSubmission();
  const { saveUserSate } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const heading = useRef(null);
  const previousStep = useRef(0);
  const lookup = useRef(null);
  const lookupVersion = useRef(0);
  const destination = safeDestination(params.get('redirect'));
  const loginURL = `/login${destination !== '/' ? `?${new URLSearchParams({ redirect: destination })}` : ''}`;

  useEffect(() => () => { lookupVersion.current += 1; lookup.current?.abort(); }, []);
  useEffect(() => {
    if (previousStep.current !== step) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      previousStep.current = step;
    }
  }, [step]);

  function update(name, value) {
    setForm(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: '' })); clearServerErrors();
  }
  function changeEntity(entity) {
    setForm(current => ({ ...current, entidade: entity, documento: '', dataNascimento: '', genero: '', razaoSocial: '', situacaoTributaria: '', inscricaoEstadual: '' }));
    setErrors({}); clearServerErrors();
  }
  function changePostcode(value) {
    lookupVersion.current += 1; lookup.current?.abort();
    setPostalStatus('idle'); setPostalMessage('');
    setForm(current => ({ ...current, cep: formatPostcode(value), rua: '', bairro: '', cidade: '', estado: '' }));
    setErrors(current => ({ ...current, cep: '', rua: '', bairro: '', cidade: '', estado: '' })); clearServerErrors();
  }
  async function lookupPostcode() {
    const postcode = digitsOnly(form.cep);
    if (postcode.length !== 8) { setErrors(current => ({ ...current, cep: 'Informe um CEP com 8 números.' })); formRef.current?.querySelector('[data-field="cep"]')?.focus(); return; }
    lookup.current?.abort();
    const version = ++lookupVersion.current;
    const controller = new AbortController(); lookup.current = controller;
    const timeout = setTimeout(() => controller.abort(), 8000);
    setPostalStatus('loading'); setPostalMessage('');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${postcode}/json/`, { signal: controller.signal });
      if (!response.ok) throw new Error('Consulta indisponível');
      const data = await response.json();
      if (version !== lookupVersion.current) return;
      if (data.erro) { setPostalStatus('invalid'); setPostalMessage('CEP não encontrado. Confira os números e tente novamente.'); return; }
      if (!data.localidade || !data.uf) throw new Error('Resposta inválida');
      setForm(current => ({ ...current, rua: data.logradouro || '', bairro: data.bairro || '', cidade: data.localidade, estado: data.uf }));
      setPostalStatus('found'); setPostalMessage('Endereço encontrado. Confira e complete os dados abaixo.');
      setErrors(current => ({ ...current, cep: '', rua: '', bairro: '', cidade: '', estado: '' }));
    } catch (error) {
      if (version === lookupVersion.current) { setPostalStatus('unavailable'); setPostalMessage('Não conseguimos consultar o CEP. Você pode preencher o endereço abaixo.'); }
    } finally { clearTimeout(timeout); }
  }
  function addService(value) { if (value) update('servicos', form.servicos.includes(value) ? form.servicos : [...form.servicos, value]); }
  function inputProps(name) { return { id: `register-${name}`, 'data-field': name, value: form[name], onChange: event => update(name, event.target.value), disabled: submitting, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `register-${name}-error` : undefined }; }
  function focusError(nextErrors) { formRef.current?.querySelector(`[data-field="${Object.keys(nextErrors)[0]}"]`)?.focus(); }

  async function handleSubmit(event) {
    event.preventDefault(); clearServerErrors();
    const nextErrors = validateRegistration(form, step);
    if (step === 2 && postalStatus === 'invalid') nextErrors.cep = 'Confira o CEP antes de criar sua conta.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { focusError(nextErrors); return; }
    if (step < 2) { setStep(step + 1); return; }
    for (let previous = 0; previous < 2; previous += 1) {
      const previousErrors = validateRegistration(form, previous);
      if (Object.keys(previousErrors).length) { setErrors(previousErrors); setStep(previous); return; }
    }
    if (postalStatus === 'loading') return;
    await submit('criar', registrationPayload(form), session => {
      saveUserSate(session.id, session.nome, session.ehPrestadorServicos, session.estado, session.cidade);
      navigate(destination === '/' ? '/minha-conta' : destination, { replace: true });
    });
  }

  return <div className="auth-page register-page">
    <Link className="auth-back" to="/"><FiArrowLeft aria-hidden="true" />Voltar ao início</Link>
    <div className="auth-layout auth-layout--register">
      <AuthStory registration professional={form.tipo === 'profissional'} />
      <section className="auth-content" aria-labelledby="register-heading">
        <ol className="register-progress" aria-label="Etapas do cadastro">{stepNames.map((name, index) => <li key={name}><button type="button" disabled={index > step || submitting} aria-current={index === step ? 'step' : undefined} onClick={() => { setStep(index); setErrors({}); }}><span>{index < step ? <FiCheck aria-hidden="true" /> : index + 1}</span><span>{name}</span></button></li>)}</ol>
        <div className="auth-form-heading"><span className="register-step-label">Passo {step + 1} de 3</span><h1 ref={heading} id="register-heading" tabIndex={-1}>{stepTitles[step]}</h1><p>{stepDescriptions[step]}</p></div>
        <FormErrors errors={serverErrors} />
        {serverErrors.some(error => /CPF|CNPJ|razão|inscrição|e-?mail|senha|idade|cadastrado/i.test(error)) && <button className="auth-text-button register-review" onClick={() => setStep(serverErrors.some(error => /e-?mail|senha/i.test(error)) ? 0 : 1)}>Revisar meus dados <FiArrowRight aria-hidden="true" /></button>}
        <form ref={formRef} className="auth-form register-form" noValidate onSubmit={handleSubmit} aria-busy={submitting}>
          {step === 0 && <div className="register-step-content">
            <fieldset className="auth-role-group"><legend>Como você quer usar o Match?</legend><div>{[['cliente','Quero contratar','Encontrar quem resolve.',FiHome],['profissional','Quero oferecer serviços','Apresentar o meu talento.',FiTool]].map(([value,title,description,Icon]) => <label key={value} className={`auth-role-option ${form.tipo === value ? 'is-selected' : ''}`}><input type="radio" name="account-type" value={value} checked={form.tipo === value} onChange={() => update('tipo', value)} aria-label={title} disabled={submitting} /><span className="role-icon"><Icon aria-hidden="true" /></span><strong>{title}</strong><span>{description}</span><span className="role-selected" aria-hidden="true">{form.tipo === value && <FiCheck />}</span></label>)}</div></fieldset>
            <FormField id="register-nome" label={form.entidade === 'empresa' ? 'Nome de contato' : 'Seu nome'} error={errors.nome}><input {...inputProps('nome')} autoComplete="name" placeholder="Como podemos chamar você?" required /></FormField>
            <div className="auth-field-grid"><FormField id="register-email" label="E-mail" error={errors.email}><input {...inputProps('email')} type="email" autoComplete="email" placeholder="Seu e-mail" required /></FormField><FormField id="register-whatsapp" label="WhatsApp" error={errors.whatsapp}><input {...inputProps('whatsapp')} onChange={event => update('whatsapp', formatPhone(event.target.value))} type="tel" autoComplete="tel-national" placeholder="(00) 00000-0000" required /></FormField></div>
            <div className="auth-field-grid"><PasswordField id="register-senha" fieldName="senha" value={form.senha} onChange={event => update('senha', event.target.value)} hint="Pelo menos 8 caracteres." error={errors.senha} autoComplete="new-password" disabled={submitting} /><PasswordField id="register-confirmacao" fieldName="confirmacao" label="Confirmar senha" value={form.confirmacao} onChange={event => update('confirmacao', event.target.value)} error={errors.confirmacao} autoComplete="new-password" disabled={submitting} /></div>
          </div>}
          {step === 1 && <div className="register-step-content">
            <fieldset className="auth-entity-group"><legend>Tipo de cadastro</legend><label className={form.entidade === 'pessoa' ? 'is-selected' : ''}><input type="radio" name="entity-type" value="pessoa" checked={form.entidade === 'pessoa'} onChange={() => changeEntity('pessoa')} />Pessoa física</label><label className={form.entidade === 'empresa' ? 'is-selected' : ''}><input type="radio" name="entity-type" value="empresa" checked={form.entidade === 'empresa'} onChange={() => changeEntity('empresa')} />Empresa</label></fieldset>
            <FormField id="register-documento" label={form.entidade === 'empresa' ? 'CNPJ' : 'CPF'} error={errors.documento}><input {...inputProps('documento')} onChange={event => update('documento', formatDocument(event.target.value, form.entidade))} inputMode="numeric" placeholder={form.entidade === 'empresa' ? '00.000.000/0000-00' : '000.000.000-00'} required /></FormField>
            {form.entidade === 'pessoa' ? <div className="auth-field-grid"><FormField id="register-dataNascimento" label="Data de nascimento" error={errors.dataNascimento}><input {...inputProps('dataNascimento')} type="date" autoComplete="bday" required /></FormField><FormField id="register-genero" label="Gênero (opcional)"><select {...inputProps('genero')}><option value="">Prefiro não informar</option><option value="feminino">Feminino</option><option value="masculino">Masculino</option></select></FormField></div> : <><FormField id="register-razaoSocial" label="Razão social" error={errors.razaoSocial}><input {...inputProps('razaoSocial')} autoComplete="organization" required /></FormField><div className="auth-field-grid"><FormField id="register-situacaoTributaria" label="Situação tributária" error={errors.situacaoTributaria}><select {...inputProps('situacaoTributaria')} required><option value="">Selecione</option><option value="contribuinte">Contribuinte</option><option value="naoContribuinte">Não contribuinte</option><option value="isento">Isento</option></select></FormField>{form.situacaoTributaria !== 'isento' && <FormField id="register-inscricaoEstadual" label={`Inscrição estadual${form.situacaoTributaria === 'contribuinte' ? '' : ' (opcional)'}`} error={errors.inscricaoEstadual}><input {...inputProps('inscricaoEstadual')} /></FormField>}</div></>}
            {form.tipo === 'profissional' && <div className="register-services"><FormField id="register-service" label="Quais serviços você oferece?" error={errors.servicos}><select id="register-service" data-field="servicos" value="" onChange={event => addService(event.target.value)} aria-invalid={Boolean(errors.servicos)} aria-describedby={errors.servicos ? 'register-service-error' : 'register-service-hint'}><option value="">Adicionar um serviço</option>{serviceOptions.map(service => <option value={service} key={service}>{service}</option>)}</select></FormField><span className="auth-field-hint" id="register-service-hint">Você pode adicionar mais de um serviço.</span><ul className="register-service-tags">{form.servicos.map(service => <li key={service}><span>{service}</span><button type="button" aria-label={`Remover serviço: ${service}`} onClick={() => update('servicos', form.servicos.filter(item => item !== service))}><FiX aria-hidden="true" /></button></li>)}</ul></div>}
          </div>}
          {step === 2 && <div className="register-step-content">
            <FormField id="register-cep" label="CEP" error={errors.cep}><div className="register-postcode"><input {...inputProps('cep')} onChange={event => changePostcode(event.target.value)} inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" required /><button type="button" onClick={lookupPostcode} disabled={postalStatus === 'loading' || submitting}>{postalStatus === 'loading' ? 'Buscando…' : 'Buscar endereço'}</button></div></FormField>
            <span className="auth-field-hint">A consulta usa o ViaCEP. Você também pode preencher o endereço manualmente.</span>
            {postalMessage && <p className={`register-postal-message ${postalStatus === 'invalid' ? 'is-error' : ''}`} role={postalStatus === 'invalid' ? 'alert' : 'status'}>{postalMessage}</p>}
            <div className="auth-field-grid auth-field-grid--address"><FormField id="register-rua" label="Rua ou avenida" error={errors.rua}><input {...inputProps('rua')} autoComplete="address-line1" required /></FormField><FormField id="register-numero" label="Número" error={errors.numero}><input {...inputProps('numero')} placeholder="123 ou S/N" required /></FormField></div>
            <div className="auth-field-grid"><FormField id="register-bairro" label="Bairro" error={errors.bairro}><input {...inputProps('bairro')} required /></FormField><FormField id="register-complemento" label="Complemento (opcional)"><input {...inputProps('complemento')} autoComplete="address-line2" placeholder="Apartamento, bloco…" /></FormField></div>
            <div className="auth-field-grid"><FormField id="register-cidade" label="Cidade" error={errors.cidade}><input {...inputProps('cidade')} autoComplete="address-level2" required /></FormField><FormField id="register-estado" label="Estado" error={errors.estado}><select {...inputProps('estado')} autoComplete="address-level1" required><option value="">Selecione</option>{stateOptions.map(([code,name]) => <option key={code} value={code}>{name}</option>)}</select></FormField></div>
            <div className="register-account-summary"><FiCheck aria-hidden="true" /><span>{form.tipo === 'profissional' ? 'Perfil para oferecer serviços' : 'Conta para encontrar profissionais'}<strong>{form.nome} · {form.entidade === 'pessoa' ? 'Pessoa física' : 'Empresa'}</strong></span></div>
          </div>}
          <div className="register-actions">{step > 0 && <button className="auth-secondary" type="button" disabled={submitting} onClick={() => { setErrors({}); setStep(step - 1); }}><FiArrowLeft aria-hidden="true" />Voltar</button>}<button className="auth-primary" type="submit" disabled={submitting || (step === 2 && postalStatus === 'loading')}>{submitting ? 'Criando sua conta…' : step < 2 ? 'Continuar' : 'Criar minha conta'}<FiArrowUpRight aria-hidden="true" /></button></div>
        </form>
        <div className="auth-switch"><span>Já tem uma conta?</span><Link to={loginURL}>Entrar <FiArrowRight aria-hidden="true" /></Link></div>
      </section>
    </div>
  </div>;
}
