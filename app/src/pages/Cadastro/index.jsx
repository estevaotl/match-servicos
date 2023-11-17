import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';
import { Alert, Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Envelope, GeoAlt, Lock, Person, PersonVcard, PersonWorkspace, Tools, Whatsapp } from 'react-bootstrap-icons';
import SelectProfissoes from '../../components/SelectProfissoes';

const CadastroPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [genero, setGenero] = useState('');
  const [senha, setSenha] = useState('');
  const [usuarioTipo, setUsuarioTipo] = useState('');
  const [documento, setDocumento] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [situacaoTributaria, setSituacaoTributaria] = useState('');
  const [servicosPrestados, setServicosPrestados] = useState("");
  const [errors, setErrors] = useState([]);
  const [errorsConsultaCep, setErrorsConsultaCep] = useState([]);
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [editandoCep, setEditandoCep] = useState(false);
  const [mostrarCamposEndereco, setMostrarCamposEndereco] = useState(false);
  const { saveUserSate } = useAuth();
  const [show, setShow] = useState(true);


  const currentURL = window.location.href;
  const apiURL = currentURL.includes('localhost') ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

  const handleChangeDocumento = (value) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length <= 11) {
      // CPF
      setDocumento(numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'));
    } else if (numericValue.length <= 14) {
      // CNPJ
      setDocumento(numericValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'));
    }
  };

  const handleSelectChange = (e) => {
    setUsuarioTipo(e.target.value);
    setServicosPrestados("");
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (errorsConsultaCep.length > 0 || cep.length <= 0) {
      setErrors(['Não é possível seguir com CEP inválido.']);
      setShow(true);
      return false;
    }

    fetch(`${apiURL}/clientes/criar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nome,
        email: email,
        dataNascimento: dataNascimento,
        whatsapp: whatsapp,
        genero: genero,
        senha: senha,
        ehPrestadorServicos: usuarioTipo === "prestador" ? true : false,
        documento: documento,
        servicosPrestados: document.getElementById('servicosPrestados') != null ? document.getElementById('servicosPrestados').value : '',
        cep: cep,
        rua: endereco,
        bairro: bairro,
        estado: uf,
        endereco: endereco,
        complemento: complemento,
        numero: numero,
        cidade: cidade,
        situacaoTributaria: situacaoTributaria,
        razaoSocial: razaoSocial,
        inscricaoEstadual: inscricaoEstadual
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.excecao) {
          setErrors(data.excecao.split('\n'));
          setShow(true);
        } else {
          saveUserSate(data.id, data.nome, data.ehPrestadorServicos, data.estado, data.cidade)
          navigate('/');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderCamposAdicionais = () => {
    if (documento.length === 14) {
      // CPF
      return (
        <Row>
          <Col sm="6" className="mb-3">
            <input type="date" className="form-control" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
            <label htmlFor="dataNascimento" className="form-label">Data de Nascimento</label>
          </Col>
          <Col sm="6" className="mb-3">
            <Form.Select
              id="genero"
              aria-label="Gênero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </Form.Select>
            <Form.Label htmlFor="genero">Gênero</Form.Label>
          </Col>
        </Row>
      );
    } else if (documento.length === 18) {
      // CNPJ
      return (
        <Row>
          <Col sm="6" className="mb-3">
            <Form.Control
              id="inscricaoEstadual"
              type="text"
              value={inscricaoEstadual}
              placeholder="Inscrição Estadual"
              onChange={(e) => setInscricaoEstadual(e.target.value)}
            />
            <Form.Label htmlFor="inscricaoEstadual">Inscrição Estadual</Form.Label>
          </Col>
          <Col sm="6" className="mb-3">
            <Form.Select
              id="situacaoTributaria"
              aria-label="Situação Tributária"
              value={situacaoTributaria}
              onChange={(e) => setSituacaoTributaria(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="contribuinte">Contribuinte</option>
              <option value="naoContribuinte">Não Contribuinte</option>
              <option value="isento">Isento</option>
            </Form.Select>
            <Form.Label htmlFor="genero">Situação Tributária</Form.Label>
          </Col>
          <Col className="mb-3">
            <Form.Control
              id="razaoSocial"
              type="text"
              value={razaoSocial}
              placeholder="Razão Social"
              onChange={(e) => setRazaoSocial(e.target.value)}
            />
            <Form.Label htmlFor="razaoSocial">Inscrição Estadual</Form.Label>
          </Col>
        </Row>
      );
    }
  };

  useEffect(() => {
    if (cep.length === 9 && !editandoCep) {
      fetchAddress();
    } else {
      // Se o CEP estiver sendo editado ou for menor que 9 caracteres, esconda os campos
      setMostrarCamposEndereco(false);
    }
  }, [cep, editandoCep]);

  const handleCepChange = (e) => {
    const formattedCep = e.target.value.replace(/\D/g, '');
    if (formattedCep.length === 8) {
      // Se o CEP tiver 8 caracteres numéricos, acrescente o hífen
      setCep(formattedCep.replace(/(\d{5})(\d{3})/, '$1-$2'));
    } else {
      setCep(formattedCep);
    }

    // Limpar os erros quando o usuário começar a editar o campo CEP
    setErrorsConsultaCep([]);

    setEditandoCep(false); // Defina como false para permitir novas consultas
  };

  const fetchAddress = async () => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setEndereco(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setUf(data.uf);
        setMostrarCamposEndereco(true);
      } else {
        // CEP inválido ou não encontrado
        setMostrarCamposEndereco(false);
        setErrorsConsultaCep(["Cep não encontrado."]);
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      setMostrarCamposEndereco(false);
      setErrorsConsultaCep(["Cep não encontrado."]);
    }
  };

  return (
    <>
      <Container>
        <h2 className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-5">Cadastro</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg="6">
              <fieldset>
                <legend>Informações Pessoais</legend>

                <div className="d-flex flex-row align-items-center mb-4">
                  <Person className="me-3" size={24} />
                  <Form.Group className="form-outline flex-fill mb-0">
                    <Form.Control
                      id="nome"
                      type="text"
                      value={nome}
                      placeholder="Seu Nome"
                      onChange={(e) => setNome(e.target.value)}
                    />
                    <Form.Label htmlFor="nome">Seu Nome</Form.Label>
                  </Form.Group>
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  <Envelope className="me-3" size={24} />
                  <Form.Group className="form-outline flex-fill mb-0">
                    <Form.Control
                      id="email"
                      type="email"
                      placeholder="Seu Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Label htmlFor="email">Seu Email</Form.Label>
                  </Form.Group>
                </div>

                <div className="d-flex flex-row align-items-start mb-4">
                  {usuarioTipo === 'prestador' ? (
                    <Tools className="me-3 flex-shrink-0" size={24} />
                  ) : (
                    <PersonWorkspace className="me-3 flex-shrink-0" size={24} />
                  )}
                  <Form.Group className="form-outline flex-grow-1 mb-0">
                    <Form.Select
                      id="tipo-cliente"
                      aria-label="Tipo de Usuário"
                      value={usuarioTipo}
                      onChange={handleSelectChange}
                    >
                      <option>Selecione</option>
                      <option value="prestador">Sou Prestador de Serviços</option>
                      <option value="cliente">Sou Cliente</option>
                    </Form.Select>
                    <Form.Label htmlFor="tipo-cliente">Por favor, escolha uma opção acima</Form.Label>

                    {usuarioTipo === "prestador" && (
                      <SelectProfissoes />
                    )}
                  </Form.Group>
                </div>
              </fieldset>

              <fieldset>
                <legend>Documentos</legend>
                <div className="d-flex flex-row align-items-start mb-4">
                  <PersonVcard className="me-3 flex-shrink-0" size={24} />
                  <Form.Group className="form-outline flex-grow-1 mb-0">
                    <Form.Control
                      id="documento"
                      type="text"
                      placeholder="CPF/CNPJ"
                      value={documento}
                      onChange={(e) => handleChangeDocumento(e.target.value)}
                    />
                    <Form.Label htmlFor="documento">CPF/CNPJ</Form.Label>
                    {renderCamposAdicionais()}
                  </Form.Group>
                </div>
              </fieldset>
            </Col>

            <Col lg="6">
              <fieldset>
                <legend>Contato</legend>

                <div className="d-flex flex-row align-items-center mb-4">
                  <Whatsapp className="me-3" size={24} />
                  <Form.Group className="form-outline flex-fill mb-0">
                    <InputMask
                      mask="(99) 99999-9999"
                      type="tel"
                      className="form-control"
                      id="whatsapp"
                      placeholder="(00) 00000-0000"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                    <Form.Label htmlFor="whatsapp">Whatsapp</Form.Label>
                  </Form.Group>
                </div>
              </fieldset>

              <fieldset>
                <legend>Endereço</legend>

                <Row>
                  <div className="d-flex flex-row align-items-start mb-4">
                    <GeoAlt className="me-3 flex-shrink-0" size={24} />
                    <Form.Group className="form-outline flex-grow-1 mb-0">
                      <InputMask
                        mask="99999-999"
                        type="text"
                        className="form-control"
                        id="cep"
                        value={cep}
                        onChange={handleCepChange}
                        placeholder="12456-789"
                      />
                      <Form.Label htmlFor="cep" className="form-label">CEP</Form.Label>

                      {errorsConsultaCep.length > 0 && (
                        <Alert variant="danger" className="div-erros-consulta-cadastro">
                          {errorsConsultaCep.map((error, index) => (
                            <span key={index}>{error}</span>
                          ))}
                        </Alert>
                      )}

                      {mostrarCamposEndereco && (
                        <Row>
                          <Col xs={6} className="mb-3">
                            <Form.Control
                              type="text"
                              className="form-control"
                              id="endereco"
                              value={endereco}
                              onChange={(e) => setEndereco(e.target.value)}
                              disabled
                            />
                            <Form.Label htmlFor="endereco" className="form-label">Endereço</Form.Label>
                          </Col>

                          <Col xs={6} className="mb-3">
                            <Form.Control
                              type="text"
                              className="form-control"
                              id="numero"
                              value={numero}
                              onChange={(e) => setNumero(e.target.value)}
                            />
                            <Form.Label htmlFor="numero" className="form-label">Número</Form.Label>
                          </Col>

                          <Col xs={6} className="mb-3">
                            <Form.Control
                              type="text"
                              className="form-control"
                              id="complemento"
                              value={complemento}
                              onChange={(e) => setComplemento(e.target.value)}
                            />
                            <Form.Label htmlFor="complemento" className="form-label">Complemento</Form.Label>
                          </Col>

                          <Col xs={6} className="mb-3">
                            <Form.Control
                              type="text"
                              className="form-control"
                              id="bairro"
                              value={bairro}
                              onChange={(e) => setBairro(e.target.value)}
                              disabled
                            />
                            <Form.Label htmlFor="bairro" className="form-label">Bairro</Form.Label>
                          </Col>

                          <Col xs={6} className="mb-3">
                            <Form.Control
                              type="text"
                              className="form-control"
                              id="cidade"
                              value={cidade}
                              onChange={(e) => setCidade(e.target.value)}
                              disabled
                            />
                            <Form.Label htmlFor="cidade" className="form-label">Cidade</Form.Label>
                          </Col>

                          <Col xs={6} className="mb-3">
                            <Form.Control
                              type="text"
                              className="form-control"
                              id="uf"
                              value={uf}
                              onChange={(e) => setUf(e.target.value)}
                              disabled
                            />
                            <Form.Label htmlFor="uf" className="form-label">UF</Form.Label>
                          </Col>
                        </Row>
                      )}
                    </Form.Group>
                  </div>
                </Row>
              </fieldset>

              <fieldset>
                <legend>Configurações da Conta</legend>

                <div className="d-flex flex-row align-items-center mb-4">
                  <Lock className="me-3" size={24} />
                  <Form.Group className="form-outline flex-fill mb-0">
                    <Form.Control
                      id="senha"
                      value={senha}
                      type="password"
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <Form.Label htmlFor="senha">Senha</Form.Label>
                  </Form.Group>
                </div>
              </fieldset>
            </Col>
            {errors.length > 0 && show && (
              <Alert
                variant="danger"
                className="mt-3"
                dismissible
                onClose={() => setShow(false)}
              >
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}
            <div className="d-flex justify-content-end ms-auto mb-3 mb-lg-4">
              <Button variant="primary" size="lg" type="submit">
                Cadastrar
              </Button>
            </div>
          </Row>
        </Form>
      </Container >
    </>
  );
};

export default CadastroPage;