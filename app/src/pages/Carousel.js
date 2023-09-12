// Carousel.js
import React, { useState } from 'react';
import CarouselItem from './CarouselItem';
import CarouselNavigation from './CarouselNavigation';

const itemsPerPage = 3;
const totalItems = 9; // Número total de itens no carrossel

const Carousel = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        <div className="carousel">
            <div className="carousel-items">
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                    <CarouselItem key={index} itemNumber={(currentPage - 1) * itemsPerPage + index + 1} />
                ))}
            </div>
            <CarouselNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
            />
        </div>
    );
};

export default Carousel;
