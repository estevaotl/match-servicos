import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiDroplet, FiGrid, FiHome, FiStar, FiSun, FiTool, FiZap } from 'react-icons/fi';
import { LuPaintbrush } from 'react-icons/lu';
import { categories } from '../pages/Home/catalog';

export const categoryIcons = { grid: FiGrid, zap: FiZap, droplet: FiDroplet, brush: LuPaintbrush, tool: FiTool, home: FiHome, sun: FiSun };
export function WorkScene({ variant = 'shelf' }) {
  return <div className={`work-scene work-scene--${variant}`} aria-hidden="true">
    <div className="scene-wall" /><div className="scene-object scene-object--one" />
    <div className="scene-object scene-object--two" /><div className="scene-object scene-object--three" /><div className="scene-ground" />
  </div>;
}

export function ProfessionalCard({ person, onPreview, returnQuery }) {
  const [imageFailed, setImageFailed] = useState(false);
  const category = categories.find(item => item.id === person.category);
  const Icon = categoryIcons[category?.icon] || FiTool;
  return <article className="professional-card">
    <div className={`professional-cover professional-cover--${person.category}`}>
      {person.demo ? <WorkScene variant={person.scene} /> : person.image && !imageFailed ?
        <img src={person.image} alt={`Foto de ${person.nome}`} loading="lazy" onError={() => setImageFailed(true)} /> :
        <Icon className="professional-placeholder" aria-hidden="true" />}
      <span className="professional-specialty"><Icon aria-hidden="true" />{category?.label || 'Serviços'}</span>
      {person.demo && <span className="example-tag">Exemplo</span>}
    </div>
    <div className="professional-info">
      <div className="professional-identity"><span className={`professional-avatar avatar--${person.category}`}>{person.initials}</span><div><h3>{person.nome}</h3><span>{person.demo ? 'Perfil demonstrativo' : person.location || 'Prestador de serviços'}</span></div></div>
      <h4>{person.title}</h4>
      <div className="professional-bottom">
        <span className="professional-rating">{person.rating ? <><FiStar aria-hidden="true" /><strong>{person.rating}</strong>{person.reviews && <span>({person.reviews})</span>}</> : 'Conheça os serviços'}</span>
        {person.demo && onPreview ? <button onClick={() => onPreview(person)} aria-label={`Ver exemplo de perfil de ${person.nome}`}>Ver perfil <FiArrowUpRight aria-hidden="true" /></button> :
          <Link to={`/profile/${encodeURIComponent(person.id)}${returnQuery ? `?${new URLSearchParams({ voltar: returnQuery }).toString()}` : ''}`}>Ver perfil <FiArrowUpRight aria-hidden="true" /></Link>}
      </div>
    </div>
  </article>;
}


export function Avatar({ person, className = '' }) {
  const [failed, setFailed] = useState(false);
  return <span className={`market-avatar ${className}`}>{person.image && !failed ? <img src={person.image} alt={`Foto de ${person.nome}`} onError={() => setFailed(true)} /> : person.initials}</span>;
}
