import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

const CardPrestadorServicos = ({ imageSrc, altText, profissao, idade, endereco, media_avaliacao, key, id }) => {
  return (
    <div className="card">
      <div key={key} className="ball-image mx-auto">
        <img
          src={imageSrc}
          alt={altText}
          className="rounded-circle ball-image-inner"
        />
      </div>
      <p>{profissao}</p>
      <p>{idade}</p>
      <p>{endereco}</p>
      <p>Média Avaliação: {media_avaliacao}</p>

      <Link to={`/profile/${id}`} className="btn btn-primary">
        Ver Perfil
      </Link>
    </div>
  );
};

export default CardPrestadorServicos;
