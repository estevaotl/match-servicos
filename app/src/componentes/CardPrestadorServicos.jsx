import React from 'react';
import '../css/card.css'; // Caminho relativo para o arquivo card.css

const CardPrestadorServicos = ({ imageSrc, altText, profissao, idade, endereco, media_avaliacao, key }) => {
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

            <button className="btn btn-success">Ver Perfil</button>
        </div>
    );
};

export default CardPrestadorServicos;
