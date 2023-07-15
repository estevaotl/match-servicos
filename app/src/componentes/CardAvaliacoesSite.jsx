import React from 'react';
import '../css/card.css'; // Caminho relativo para o arquivo card.css

const CardAvalicoesSite = ({ imageSrc, altText, nome, idade, comentario }) => {
    return (
        <div className="card">
            <img src={imageSrc} alt={altText} />
            <p>{nome}</p>
            <p>{idade}</p>
            <p>{comentario}</p>
        </div>
    );
};

export default CardAvalicoesSite;