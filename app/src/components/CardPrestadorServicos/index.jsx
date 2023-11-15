import React from 'react';
import { Badge, Card, ListGroup, Stack } from 'react-bootstrap';

const CardPrestadorServicos = ({ prestador }) => {
  const { imagemPerfil, alt, servicosPrestados, endereco, nome, email, id } = prestador;
  const { rua, numero, bairro, cidade, estado } = endereco[0];

  return (
    <Card border="light">
      <Card.Img variant="top" src={imagemPerfil} alt={alt} />
      <Card.Body>
        <Card.Title>{nome}</Card.Title>
          <Stack
            direction="horizontal"
            gap={2}
            className="flex-wrap overflow-hidden"
          >
            {servicosPrestados.map((servico, index) => {
              return (
                <Badge key={index} pill bg="secondary">{servico}</Badge>
              );
            })}
          </Stack>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>{email}</ListGroup.Item>
        <ListGroup.Item>{`${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}`}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link
          href={`/profile/${id}`}
          className="btn btn-primary w-100"
        >Ver Perfil</Card.Link>
      </Card.Body>
    </Card>
  );
};

export default CardPrestadorServicos;
