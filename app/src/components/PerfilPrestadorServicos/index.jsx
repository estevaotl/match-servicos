import { Button, Card, Col, Image, Ratio, Row } from "react-bootstrap";
import { Whatsapp } from "react-bootstrap-icons";

export default function PerfilPrestadorServicos({ prestador, onClick }) {
    if (!prestador) {
        return <p>Carregando perfil...</p>;
    }

    const { nome, email, imagemPerfil, servicosPrestados, whatsapp, genero, endereco } = prestador;
    const { cep, rua, numero, bairro, cidade, estado } = endereco[0];

    return (
        <>
            <Row className="my-5">
                <Col lg="6" className="my-5">
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm="3" className="mx-auto">
                                    <Ratio aspectRatio="1x1">
                                        <Image
                                            src={imagemPerfil}
                                            alt="Perfil"
                                            className="rounded-circle object-fit-cover"
                                            width="150"
                                        />

                                    </Ratio>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-3 text-center">
                                    <h4>{nome}</h4>
                                    <p className="text-secondary mb-1">{email}</p>
                                    <p className="text-muted font-size-sm">{genero}</p>
                                    <Button
                                        variant="primary"
                                        className="mx-auto d-flex align-items-center"
                                        onClick={onClick}
                                    >
                                        <Whatsapp className="me-2" />
                                        Entrar em contato
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="6" className="my-5">
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={4}>
                                    <h6 className="mb-0">Serviços Prestados</h6>
                                </Col>
                                <Col sm={8} className="text-secondary">
                                    {servicosPrestados}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col sm={4}>
                                    <h6 className="mb-0">WhatsApp</h6>
                                </Col>
                                <Col sm={8} className="text-secondary">
                                    {whatsapp}
                                </Col>
                            </Row>
                            {endereco && endereco.length > 0 && (
                                <>
                                    <hr />
                                    <Row>
                                        <Col sm={4}>
                                            <h6 className="mb-0">CEP</h6>
                                        </Col>
                                        <Col sm={8} className="text-secondary">
                                            {cep}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col sm={4}>
                                            <h6 className="mb-0">Endereço</h6>
                                        </Col>
                                        <Col sm={8} className="text-secondary">
                                            {rua}, {numero} - {bairro}, {cidade} / {estado}
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col className="mb-5">

                </Col>
            </Row>
        </>
    );
}