import { useRef, useState } from 'react';
import { FiArrowUpRight, FiCheck, FiMapPin, FiTool } from 'react-icons/fi';
import { useAuth } from '../contexts/Auth';
import { FormField } from '../auth/components';
import { formatPhone, formatPostcode } from '../auth/data';
import { stateOptions } from '../marketplace/data';
import { isProfessional, saveProfile, validateProfile } from './data';
import { useAccountAction, usePostcodeLookup } from './hooks';

export default function ProfileEditor({ profile, onSaved }) {
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const action = useAccountAction();
  const postal = usePostcodeLookup(setForm, setErrors);
  const { saveUserSate } = useAuth();
  function update(name, value) { setForm(current => ({ ...current, [name]: value })); setErrors(current => ({ ...current, [name]: '' })); action.clear(); }
  function props(name) { return { id: `account-${name}`, 'data-field': name, value: form[name], disabled: action.busy || profile.demo, onChange: event => update(name, event.target.value), 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `account-${name}-error` : undefined }; }
  const field = (name, label, attributes = {}) => <FormField id={`account-${name}`} label={label} error={errors[name]}><input {...props(name)} {...attributes} /></FormField>;
  async function submit(event) {
    event.preventDefault(); if (profile.demo || postal.status === 'loading') return;
    const nextErrors = validateProfile(form);
    if (postal.status === 'invalid') nextErrors.cep = 'Confira o CEP antes de salvar.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { formRef.current.querySelector(`[data-field="${Object.keys(nextErrors)[0]}"]`)?.focus(); return; }
    await action.run(signal => saveProfile(form, signal), session => {
      const professional = isProfessional(session.ehPrestadorServicos);
      saveUserSate(session.id, session.nome, professional, session.estado || form.estado, session.cidade || form.cidade);
      onSaved({ ...profile, ...form, nome: session.nome, professional, services: professional ? form.services : '' });
    }, 'Seu perfil foi atualizado.');
  }
  return <div className="account-editor">
    <div className="account-section-heading"><div><h2>Seu perfil, do seu jeito.</h2><p>Mantenha seus contatos e sua região de atendimento atualizados.</p></div></div>
    {profile.demo && <p className="account-inline-note">Dados ilustrativos. A edição fica disponível na sua conta real.</p>}
    <form ref={formRef} className="account-profile-form" noValidate onSubmit={submit} aria-busy={action.busy}>
      <fieldset disabled={action.busy || profile.demo}><legend><FiTool aria-hidden="true" />Sobre você</legend>
        <div className="auth-field-grid">{field('nome', 'Seu nome', { autoComplete: 'name', required: true })}{field('email', 'E-mail', { type: 'email', autoComplete: 'email', required: true })}{field('whatsapp', 'WhatsApp', { type: 'tel', autoComplete: 'tel-national', onChange: event => update('whatsapp', formatPhone(event.target.value)), required: true })}<FormField id="account-genero" label="Gênero (opcional)"><select {...props('genero')}><option value="">Prefiro não informar</option><option value="feminino">Feminino</option><option value="masculino">Masculino</option></select></FormField></div>
        <FormField id="account-professional" label="Como você usa o Match?"><select id="account-professional" value={form.professional ? 'profissional' : 'cliente'} onChange={event => update('professional', event.target.value === 'profissional')}><option value="cliente">Encontro profissionais</option><option value="profissional">Ofereço serviços</option></select></FormField>
        {form.professional && <FormField id="account-services" label="Serviços que você oferece" error={errors.services} hint="Separe os serviços por vírgula. Eles aparecem no seu perfil público."><textarea {...props('services')} rows={3} required /></FormField>}
      </fieldset>
      <fieldset disabled={action.busy || profile.demo}><legend><FiMapPin aria-hidden="true" />Seu endereço</legend><div className="account-postcode">{field('cep', 'CEP', { inputMode: 'numeric', autoComplete: 'postal-code', onChange: event => { postal.change(formatPostcode(event.target.value)); action.clear(); }, required: true })}<button className="auth-secondary" type="button" onClick={() => postal.find(form.cep)} disabled={postal.status === 'loading'}>{postal.status === 'loading' ? 'Buscando…' : 'Buscar endereço'}</button></div><p className="auth-field-hint">A consulta usa o ViaCEP. Você também pode preencher os campos abaixo.</p>
        {postal.message && <p className={`account-feedback ${postal.status === 'invalid' ? 'is-error' : ''}`} role={postal.status === 'invalid' ? 'alert' : 'status'}>{postal.message}</p>}
        <div className="auth-field-grid">{field('rua', 'Rua ou avenida', { autoComplete: 'address-line1', required: true })}{field('numero', 'Número', { placeholder: '123 ou S/N', required: true })}{field('bairro', 'Bairro', { required: true })}{field('complemento', 'Complemento (opcional)', { autoComplete: 'address-line2' })}{field('cidade', 'Cidade', { autoComplete: 'address-level2', required: true })}<FormField id="account-estado" label="Estado" error={errors.estado}><select {...props('estado')} autoComplete="address-level1" required><option value="">Selecione</option>{stateOptions.map(([code,name]) => <option key={code} value={code}>{name}</option>)}</select></FormField></div>
      </fieldset>
      {action.error && <p className="account-feedback is-error" role="alert">{action.error}</p>}{action.notice && <p className="account-feedback is-success" role="status"><FiCheck aria-hidden="true" />{action.notice}</p>}
      <div className="account-form-footer"><span>As alterações aparecem depois de salvar.</span><button className="auth-primary" disabled={profile.demo || action.busy || postal.status === 'loading'}>{action.busy ? 'Salvando…' : 'Salvar meu perfil'}<FiArrowUpRight aria-hidden="true" /></button></div>
    </form>
  </div>;
}
