import { Col, Container, Row } from "react-bootstrap";
import AOS from 'aos';
import workers from '../../imgs/workers.png';
import { useEffect, useState } from "react";
import Autocomplete from "../AutoComplete";
import { useAuth } from "../../contexts/Auth";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const { idCliente, estado, cidade } = useAuth();
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchValue) {
          var url = `/busca?q=${searchValue}`;
    
          if (idCliente) {
            if (estado.length > 0) {
              url += `&estado=${estado}`;
            }
    
            if (cidade.length > 0) {
              url += `&cidade=${cidade}`;
            }
          }
    
          navigate(url);
        }
      };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
            mirror: false
        });
    }, []);

    return (
        <section
            id="hero"
            className="d-flex align-items-center"
            style={{
                marginTop: '10rem',
                marginBottom: '10rem',
            }}
        >
            <Container>
                <Row>
                    <Col lg={6} className="d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
                        <h1>BEM VINDO AO MATCH SERVIÇOS.</h1>
                        <h2>O PORTAL PARA ENCONTRAR O PRESTADOR DE SERVIÇOS IDEAL</h2>
                    </Col>
                    <Col lg={6} className="d-flex align-items-center order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="200">
                        <img src={workers} className="img-fluid animated m-auto" alt="" />
                    </Col>
                </Row>
                <Row
                    className="pt-5 w-100 w-xl-50 mx-auto position-relative"
                >
                    <Autocomplete
                        onSelectJob={selectedJob => setSearchValue(selectedJob)}
                        onSearch={handleSearch}
                    />
                </Row>
            </Container>
        </section>
    );
}