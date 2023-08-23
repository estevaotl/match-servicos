import React from 'react';
import { Link } from 'react-router-dom';

const TrabalhadorCard = ({ worker }) => {
    return (
        <div className="card m-2">
            <div className="card-body">
                <h5 className="card-title">{worker.nome}</h5>
                <p className="card-text">Email: {worker.email}</p>
                <p className="card-text">Idade: {worker.idade}</p>
                <Link to={`/profile/${worker.id}`} className="btn btn-primary">
                    Ver Perfil
                </Link>
            </div>
        </div>
    );
};

export default TrabalhadorCard;
