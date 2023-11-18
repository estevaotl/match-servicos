import { Col, Row } from "react-bootstrap";
import TrabalhadorCard from "../TrabalhadorCard";

export default function ResultadoBusca({ filteredWorkers }) {
    return (
        <Row>

            {filteredWorkers.length > 0 ? (
                filteredWorkers.map(worker => (
                    <TrabalhadorCard key={worker.id} worker={worker} />
                ))
            ) : (
                <Col>
                    <div className="empty-container alert alert-warning">
                        Nenhum trabalhador encontrado
                    </div>
                </Col>
            )}
        </Row>
    );
}