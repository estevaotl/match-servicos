import { Container } from "react-bootstrap";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import CardPrestadorServicos from "../CardPrestadorServicos";

export default function CarrosselPrestadorServicos({
    prestadoresServicos,
}) {
    return (
        <Container
            fluid
            className="bg-body-tertiary"
            style={{
                padding: '8rem 0'
            }}
        >
            <Splide
                aria-label="Prestadores de Serviços"
                options={{
                    rewind: true,
                    perPage: 5,
                    breakpoints: {
                        992: { perPage: 2 },
                        1200: { perPage: 3 },
                        1600: { perPage: 4 },
                    },
                }}
                className="px-4 px-lg-5"
            >
                {prestadoresServicos.map((prestador, index) => (
                    <SplideSlide
                        key={index}
                        className="mx-auto px-4"
                    >
                        <CardPrestadorServicos
                            prestador={prestador}
                        >
                        </CardPrestadorServicos>
                    </SplideSlide>
                ))}
            </Splide>
        </Container>
    )
}