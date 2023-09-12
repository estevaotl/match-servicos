// CarouselItem.js
import React from 'react';

const CarouselItem = ({ itemNumber }) => {
    return (
        <div className="carousel-item">
            <h2>Item {itemNumber}</h2>
            {/* Adicione o conteúdo do item aqui */}
        </div>
    );
};

export default CarouselItem;
