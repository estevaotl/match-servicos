// CarouselNavigation.js
import React from 'react';

const CarouselNavigation = ({ currentPage, totalPages, onPrev, onNext }) => {
    return (
        <div className="carousel-navigation">
            <button onClick={onPrev} disabled={currentPage === 1}>
                Anterior
            </button>
            <span>
                Página {currentPage} de {totalPages}
            </span>
            <button onClick={onNext} disabled={currentPage === totalPages}>
                Próximo
            </button>
        </div>
    );
};

export default CarouselNavigation;
