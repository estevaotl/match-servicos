import { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiCamera, FiCheck, FiImage, FiUpload } from 'react-icons/fi';
import { WorkScene } from '../marketplace/components';
import MarketplaceDialog from '../marketplace/Dialog';
import { imageURL, uploadImage, validateImage } from './data';
import { useAccountAction } from './hooks';

export function AccountAvatar({ profile, large = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [profile.image]);
  return <span className={`account-avatar ${large ? 'account-avatar--large' : ''}`}>{profile.image && !failed ? <img src={profile.image} alt={`Foto de ${profile.nome}`} onError={() => setFailed(true)} /> : <span aria-label={`Perfil de ${profile.nome}`}>{profile.nome.split(' ').filter(Boolean).map(word => word[0]).slice(0,2).join('')}</span>}</span>;
}
function UploadForm({ profile, portrait, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  const input = useRef(null);
  const action = useAccountAction();
  useEffect(() => { if (!file) { setPreview(''); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  function select(event) {
    const selected = event.target.files[0]; action.clear();
    const error = validateImage(selected); setFileError(error); setFile(error ? null : selected);
  }
  async function submit(event) {
    event.preventDefault(); if (profile.demo) return;
    const error = validateImage(file); setFileError(error); if (error) { input.current?.focus(); return; }
    await action.run(signal => uploadImage(profile, file, portrait, signal), refreshed => { onUploaded(refreshed); setFile(null); input.current.value = ''; }, portrait ? 'Sua foto de perfil foi atualizada.' : 'Foto adicionada ao seu portfólio.');
  }
  const id = portrait ? 'account-portrait' : 'account-work-photo';
  return <form className="account-upload-form" onSubmit={submit} aria-busy={action.busy}>
    <div className="account-upload-selection"><div className={`account-upload-preview ${portrait ? 'is-portrait' : ''}`}>{preview ? <img src={preview} alt="Prévia da imagem selecionada" /> : portrait ? <AccountAvatar profile={profile} large /> : <FiImage aria-hidden="true" />}</div><div><h3>{portrait ? 'Sua foto de perfil' : 'Mostre o que você sabe fazer'}</h3><p>{portrait ? 'Escolha uma foto em que as pessoas possam reconhecer você.' : 'Adicione fotos de trabalhos realizados. Elas aparecem no seu perfil público.'}</p><label className="account-file-label" htmlFor={id}><FiUpload aria-hidden="true" />{file ? 'Escolher outra imagem' : 'Escolher imagem'}<input ref={input} id={id} type="file" accept="image/jpeg,image/png,image/gif" onChange={select} disabled={profile.demo || action.busy} aria-describedby={`${id}-hint`} /></label><span className="auth-field-hint" id={`${id}-hint`}>JPG, PNG ou GIF, até 5 MB.</span>{file && <span className="account-selected-file">{file.name}</span>}</div></div>
    {fileError && <p className="account-feedback is-error" role="alert">{fileError}</p>}{action.error && <p className="account-feedback is-error" role="alert">{action.error}</p>}{action.notice && <p className="account-feedback is-success" role="status"><FiCheck aria-hidden="true" />{action.notice}</p>}
    <button className="auth-primary" disabled={profile.demo || action.busy || !file}>{action.busy ? 'Enviando e conferindo…' : portrait ? 'Salvar foto de perfil' : 'Adicionar ao portfólio'}<FiArrowUpRight aria-hidden="true" /></button>
  </form>;
}
function Photo({ photo }) {
  const [failed, setFailed] = useState(false);
  return photo.demo ? <WorkScene variant={photo.scene} /> : !failed ? <img src={imageURL(photo)} alt={photo.title} loading="lazy" onError={() => setFailed(true)} /> : <div className="account-photo-unavailable"><FiImage aria-hidden="true" /><span>Imagem indisponível</span></div>;
}
export default function Photos({ profile, onUploaded }) {
  const [selected, setSelected] = useState(null);
  const photos = profile.demo && profile.professional ? [{ id: 'photo-1', title: 'Estante para a sala', scene: 'shelf', demo: true }, { id: 'photo-2', title: 'Organização do escritório', scene: 'shelf', demo: true }, { id: 'photo-3', title: 'Detalhes de um novo espaço', scene: 'paint', demo: true }] : profile.images.map((photo, index) => ({ ...photo, title: `Trabalho ${index + 1}` }));
  return <div className="account-photos"><div className="account-section-heading"><div><h2>{profile.professional ? 'Trabalho bem feito merece aparecer.' : 'Vamos colocar um rosto nesse encontro.'}</h2><p>{profile.professional ? 'Cuide da sua foto e da vitrine dos seus trabalhos.' : 'Personalize a foto que acompanha sua conta.'}</p></div><FiCamera aria-hidden="true" /></div>{profile.demo && <p className="account-inline-note">Fotos ilustrativas. O envio fica disponível na sua conta real.</p>}
    <UploadForm profile={profile} portrait onUploaded={onUploaded} />
    {profile.professional && <><div className="account-section-heading account-portfolio-heading"><div><h2>Seu portfólio</h2><p>{photos.length ? `${photos.length} ${photos.length === 1 ? 'imagem' : 'imagens'} ${profile.demo ? 'ilustrativas' : 'no seu perfil'}.` : 'As imagens que você adicionar ficam reunidas aqui.'}</p></div></div>{photos.length ? <div className="account-photo-grid">{photos.map(photo => <button className="account-photo-tile" key={photo.id || photo.nomeArquivo} onClick={() => setSelected(photo)} aria-label={`Ampliar ${photo.title}`}><span><Photo photo={photo} /></span><span>{photo.title}{profile.demo && <small>Ilustração</small>}</span></button>)}</div> : <div className="account-empty account-empty--small"><FiImage aria-hidden="true" /><h3>Seu primeiro trabalho pode aparecer aqui.</h3><p>Escolha uma foto de um serviço realizado para começar seu portfólio.</p></div>}<UploadForm profile={profile} portrait={false} onUploaded={onUploaded} /></>}
    {selected && <MarketplaceDialog title={selected.title} wide onClose={() => setSelected(null)}><div className="account-photo-lightbox"><Photo photo={selected} /></div>{selected.demo && <p className="account-inline-note account-lightbox-note">Ilustração de exemplo. Não representa um trabalho realizado.</p>}</MarketplaceDialog>}
  </div>;
}
