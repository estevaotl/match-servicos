import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Link, useNavigate } from 'react-router-dom'; // Importe o useNavigate
import './styles.css';
import { useAuth } from '../../contexts/Auth';

const CadastroPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [genero, setGenero] = useState('');
  const [senha, setSenha] = useState('');
  const [prestadorDeServicos, setPrestadorDeServicos] = useState('');
  const [documento, setDocumento] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [situacaoTributaria, setSituacaoTributaria] = useState('');
  const [servicosPrestados, setServicosPrestados] = useState("");
  const [errors, setErrors] = useState([]);
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [uf, setUf] = useState('');
  const [editandoCep, setEditandoCep] = useState(false);
  const [mostrarCamposEndereco, setMostrarCamposEndereco] = useState(false);
  const { saveUserSate } = useAuth();
  const [selectedProfissoes, setSelectedProfissoes] = useState([]);

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
    setPrestadorDeServicos(e.target.value);
    setServicosPrestados(""); // Reinicia os serviços prestados ao trocar a opção
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`${apiURL}/clientes/criar`, {
      method: 'POST', // ou 'GET', 'PUT', 'DELETE', etc., dependendo do tipo de requisição que você deseja fazer
      headers: {
        'Content-Type': 'application/json',
        // Aqui você pode adicionar quaisquer outros cabeçalhos necessários
      },
      body: JSON.stringify({
        // Aqui você pode adicionar os dados que deseja enviar no corpo da requisição
        // Por exemplo, se estiver enviando um objeto com os campos 'nome' e 'email':
        nome: nome,
        email: email,
        dataNascimento: dataNascimento,
        whatsapp: whatsapp,
        genero: genero,
        senha: senha,
        ehPrestadorDeServicos: prestadorDeServicos == "prestadorSim" ? true : false,
        documento: documento,
        servicosPrestados: document.getElementById('servicosPrestados') != null ? document.getElementById('servicosPrestados').value : '',
        cep: cep,
        rua: endereco,
        bairro: bairro,
        estado: uf,
        endereco: endereco,
        complemento: complemento,
        numero: numero,
        cidade: localidade,
        situacaoTributaria: situacaoTributaria,
        razaoSocial: razaoSocial,
        inscricaoEstadual: inscricaoEstadual
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.excecao) {
          setErrors(data.excecao.split('\n'));
        } else {
          saveUserSate(data['id'], data['nome'])
          navigate('/');
        }
      })
      .catch(error => {
        // Aqui você pode lidar com erros de requisição
        console.error(error);
      });
  };

  const renderCamposAdicionais = () => {
    if (documento.length === 14) {
      // CPF
      return (
        <div>
          <div className="col-md-6 mb-3">
            <label htmlFor="dataNascimento" className="form-label">Data de Nascimento:</label>
            <input type="date" className="form-control" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="genero" className="form-label">Gênero:</label>
            <select className="form-select" id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="">Selecione</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </select>
          </div>
        </div>
      );
    } else if (documento.length === 18) {
      // CNPJ
      return (
        <div>
          <div className="col-md-6 mb-3">
            <label htmlFor="inscricaoEstadual" className="form-label">Inscrição Estadual:</label>
            <input type="text" className="form-control" id="inscricaoEstadual" value={inscricaoEstadual} onChange={(e) => setInscricaoEstadual(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="razaoSocial" className="form-label">Razão Social:</label>
            <input type="text" className="form-control" id="razaoSocial" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="situacaoTributaria" className="form-label">Situação Tributária:</label>
            <select className="form-select" id="situacaoTributaria" value={situacaoTributaria} onChange={(e) => setSituacaoTributaria(e.target.value)}>
              <option value="">Selecione</option>
              <option value="contribuinte">Contribuinte</option>
              <option value="naoContribuinte">Não Contribuinte</option>
              <option value="isento">Isento</option>
            </select>
          </div>
        </div>
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
    const formattedCep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (formattedCep.length === 8) {
      // Se o CEP tiver 8 caracteres numéricos, acrescente o hífen
      setCep(formattedCep.replace(/(\d{5})(\d{3})/, '$1-$2'));
    } else {
      setCep(formattedCep);
    }
    setEditandoCep(false); // Defina como false para permitir novas consultas
  };

  const fetchAddress = async () => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setEndereco(data.logradouro);
        setBairro(data.bairro);
        setLocalidade(data.localidade);
        setUf(data.uf);
        setMostrarCamposEndereco(true); // Mostrar campos quando o CEP for encontrado
      } else {
        // CEP inválido ou não encontrado
        setMostrarCamposEndereco(false); // Ocultar campos em caso de erro
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      setMostrarCamposEndereco(false); // Ocultar campos em caso de erro
    }
  };

  const handleProfissaoChange = (event) => {
    const optionValue = event.target.value;
    if (!selectedProfissoes.includes(optionValue)) {
      setSelectedProfissoes([...selectedProfissoes, optionValue]);
    }
  };

  const handleRemoveProfissao = (profissaoToRemove) => {
    const updatedProfissoes = selectedProfissoes.filter(
      (profissao) => profissao !== profissaoToRemove
    );
    setSelectedProfissoes(updatedProfissoes);
  };

  // Atualiza o campo "servicosPrestados" com as opções selecionadas
  useEffect(() => {
    const servicosPrestadosInput = document.getElementById('servicosPrestados');
    if (servicosPrestadosInput) {
      servicosPrestadosInput.value = selectedProfissoes.join(', ');
    }
  }, [selectedProfissoes]);

  // Função para formatar a lista de profissões com tags removíveis
  const formatSelectedProfissoes = () => {
    return selectedProfissoes.map((profissao) => (
      <span key={profissao} className="badge bg-primary selected-profissao">
        {profissao}
        <button
          type="button"
          className="btn-close"
          aria-label="Remover"
          onClick={() => handleRemoveProfissao(profissao)}
        ></button>
      </span>
    ));
  };

  return (
    <div className='cadastro-container'>
      <h1>CADASTRO</h1>
      {errors.length > 0 && (
        <div className="alert alert-danger mt-3">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="col-md-6 mb-3">
          <label htmlFor="nome" className="form-label">Nome:</label>
          <input type="text" className="form-control" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="prestadorDeServicos" className="form-label">Prestador de Serviços:</label>
          <select
            className="form-select"
            id="prestadorDeServicos"
            value={prestadorDeServicos}
            onChange={handleSelectChange}
          >
            <option value="">Selecione</option>
            <option value="prestadorSim">Sim</option>
            <option value="prestadorNao">Não</option>
          </select>
        </div>

        {prestadorDeServicos === "prestadorSim" && (
          <div className="col-md-6 mb-3">
            <label htmlFor="profissao" className="form-label">Serviços Prestados:</label>
            <div>
              <select
                id="profissao"
                name="profissao"
                multiple
                value={selectedProfissoes}
                onChange={handleProfissaoChange}
                className="form-select"
              >
                <optgroup label="Ciências Agrárias">
                  <option value="agronomia">Agronomia</option>
                  <option value="biotecnologia">Biotecnologia</option>
                  <option value="engenharia agricola">Engenharia Agrícola</option>
                  <option value="engenharia de alimentos">Engenharia de Alimentos</option>
                  <option value="engenharia de pesca">Engenharia de Pesca</option>
                  <option value="engenharia florestal">Engenharia Florestal</option>
                  <option value="medicina veterinaria">Medicina Veterinária</option>
                  <option value="zootecnia">Zootecnia</option>
                </optgroup>

                <optgroup label="Ciências da Saúde">
                  <option value="educação fisica">Educação Física</option>
                  <option value="enfermagem">Enfermagem</option>
                  <option value="farmacia">Farmácia</option>
                  <option value="fisioterapia">Fisioterapia</option>
                  <option value="fonoaudiologia">Fonoaudiologia</option>
                  <option value="medicina">Medicina</option>
                  <option value="odontologia">Odontologia</option>
                  <option value="saude coletiva">Saúde Coletiva</option>
                  <option value="terapia ocupacional">Terapia Ocupacional</option>
                </optgroup>

                <optgroup label="Ciências Exatas e da Terra">
                  <option value="ciencia da computação">Ciência da Computação</option>
                  <option value="fisica">Física</option>
                  <option value="matematica">Matemática</option>
                  <option value="quimica">Química</option>
                </optgroup>

                <optgroup label="Ciências Humanas">
                  <option value="geografia">Geografia</option>
                  <option value="historia">História</option>
                  <option value="psicologia">Psicologia</option>
                  <option value="sociologia">Sociologia</option>
                  <option value="teologia">Teologia</option>
                </optgroup>

                <optgroup label="Ciências Sociais Aplicadas">
                  <option value="administração">Administração</option>
                  <option value="publicidade e propaganda">Publicidade e Propaganda</option>
                </optgroup>

                <optgroup label="Construção Civil">
                  <option value="pedreiro">Pedreiro</option>
                  <option value="eletrecista">Eletrecista</option>
                  <option value="bombeiro hidraulico">Bombeiro Hidráulico</option>
                  <option value="servente">Servente de Obras</option>
                </optgroup>

                <optgroup label="Serviços Gerais">
                  <option value="mecanico">Mecânico</option>
                  <option value="mecanico de moto">Mecânico de Moto</option>
                  <option value="mecanico de carro">Mecânico de Carro</option>
                </optgroup>
              </select>

              <div className="selected-profissoes-container">
                {formatSelectedProfissoes()}
              </div>
              <input
                type="hidden"
                id="servicosPrestados"
                name="servicosPrestados"
                value={selectedProfissoes.join(', ')}
              />
            </div>
          </div>
        )}

        <div className="col-md-6 mb-3">
          <label htmlFor="documento" className="form-label">CPF/CNPJ:</label>
          <input
            type="text"
            className="form-control"
            id="documento"
            value={documento}
            onChange={(e) => handleChangeDocumento(e.target.value)}
          />
        </div>
        {renderCamposAdicionais()}
        <div className="col-md-6 mb-3">
          <label htmlFor="whatsapp" className="form-label">WhatsApp:</label>
          <InputMask
            mask="(99) 99999-9999" // Máscara para número de telefone do WhatsApp
            type="tel"
            className="form-control"
            id="whatsapp"
            placeholder="(XX) XXXXX-XXXX" // Opcional: forneça um placeholder com o formato desejado
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="senha" className="form-label">Senha:</label>
          <input type="password" className="form-control" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="cep" className="form-label">CEP:</label>
          <InputMask
            mask="99999-999"
            maskPlaceholder=""
            type="text"
            className="form-control"
            id="cep"
            value={cep}
            onChange={handleCepChange}
          />
        </div>

        {mostrarCamposEndereco && (
          <>
            <div className="col-md-6 mb-3">
              <label htmlFor="endereco" className="form-label">Endereço:</label>
              <input
                type="text"
                className="form-control"
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="numero" className="form-label">Número:</label>
              <input
                type="text"
                className="form-control"
                id="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="complemento" className="form-label">Complemento:</label>
              <input
                type="text"
                className="form-control"
                id="complemento"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="bairro" className="form-label">Bairro:</label>
              <input
                type="text"
                className="form-control"
                id="bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="localidade" className="form-label">Localidade:</label>
              <input
                type="text"
                className="form-control"
                id="localidade"
                value={localidade}
                onChange={(e) => setLocalidade(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="uf" className="form-label">UF:</label>
              <input
                type="text"
                className="form-control"
                id="uf"
                value={uf}
                onChange={(e) => setUf(e.target.value)}
              />
            </div>
          </>
        )}
        <button type="submit" className="btn btn-success register-button">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroPage;