import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

const CardPrestadorServicos = ({ imageSrc, altText, profissao, endereco, nome, email, key, id }) => {
  return (
    <div className="card">
      <div key={key} className="ball-image mx-auto">
        <img
          src={imageSrc}
          alt={altText}
          className="rounded-circle ball-image-inner"
        />
      </div>
      <p>{nome}</p>
      <p>{email}</p>
      <p>{profissao}</p>
      <p>{endereco}</p>

      <Link to={`/profile/${id}`} className="btn btn-primary">
        Ver Perfil
      </Link>
    </div>
  );
};

export default CardPrestadorServicos;
