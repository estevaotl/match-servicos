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
  const [errorsConsultaCep, setErrorsConsultaCep] = useState([]);
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

    if(errorsConsultaCep.length > 0){
      setErrors(['Não é possível seguir com CEP inválido.']);
      return false;
    }

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
          saveUserSate(data.id, data.nome, data.ehPrestadorServicos, data.estado, data.cidade)
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
        <div className="col-md-6 mb-3" id="divs-escondidas-cpf">
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
        <div className="col-md-6 mb-3" id="divs-escondidas-cnpj">
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
        setLocalidade(data.localidade);
        setUf(data.uf);
        setMostrarCamposEndereco(true); // Mostrar campos quando o CEP for encontrado
      } else {
        // CEP inválido ou não encontrado
        setMostrarCamposEndereco(false); // Ocultar campos em caso de erro
        setErrorsConsultaCep(["Cep não encontrado."]);
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      setMostrarCamposEndereco(false); // Ocultar campos em caso de erro
      setErrorsConsultaCep(["Cep não encontrado."]);
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
                <optgroup label="Reparos Elétricos">
                  <option value="Troca de tomadas e interruptores">Troca de tomadas e interruptores</option>
                  <option value="Instalação de luminárias">Instalação de luminárias</option>
                  <option value="Resolução de problemas elétricos simples">Resolução de problemas elétricos simples</option>
                  <option value="Substituição de disjuntores">Substituição de disjuntores</option>
                </optgroup>

                <optgroup label="Reparos Hidráulicos">
                  <option value="Conserto de vazamentos de torneiras e canos">Conserto de vazamentos de torneiras e canos</option>
                  <option value="Desentupimento de pias e ralos">Desentupimento de pias e ralos</option>
                  <option value="Instalação ou substituição de torneiras e válvulas">Instalação ou substituição de torneiras e válvulas</option>
                </optgroup>

                <optgroup label="Pintura">
                  <option value="Pintura de paredes e tetos">Pintura de paredes e tetos</option>
                  <option value="Pintura de portas e janelas">Pintura de portas e janelas</option>
                  <option value="Preparação de superfícies, como lixar e aplicar primer">Preparação de superfícies, como lixar e aplicar primer</option>
                </optgroup>

                <optgroup label="Reparos em Carpintaria">
                  <option value="Instalação de prateleiras">Instalação de prateleiras</option>
                  <option value="Reparo de portas e fechaduras">Reparo de portas e fechaduras</option>
                  <option value="Montagem de móveis">Montagem de móveis</option>
                </optgroup>

                <optgroup label="Reparos em Alvenaria">
                  <option value="Construção de alvenaria, incluindo paredes de tijolos, blocos ou pedras">Construção de alvenaria, incluindo paredes de tijolos, blocos ou pedras</option>
                  <option value="Reparação de rachaduras em paredes">Reparação de rachaduras em paredes</option>
                  <option value="Rejunte de azulejos">Rejunte de azulejos</option>
                  <option value="Substituição de telhas danificadas">Substituição de telhas danificadas</option>
                </optgroup>

                <optgroup label="Montagem e Instalação">
                  <option value="Montagem de móveis e estantes">Montagem de móveis e estantes</option>
                  <option value="Instalação de suportes para TV e prateleiras">Instalação de suportes para TV e prateleiras</option>
                  <option value="Montagem de playgrounds e equipamentos de ginástica">Montagem de playgrounds e equipamentos de ginástica</option>
                  <option value="Instalação de sistemas de armazenamento">Instalação de sistemas de armazenamento</option>
                </optgroup>

                <optgroup label="Limpeza de Calhas">
                  <option value="Remoção de detritos e folhas de calhas">Remoção de detritos e folhas de calhas</option>
                  <option value="Desobstrução de calhas entupidas">Desobstrução de calhas entupidas</option>
                </optgroup>

                <optgroup label="Manutenção de Portões e Cercas">
                  <option value="Lubrificação e reparos em portões">Lubrificação e reparos em portões</option>
                  <option value="Reparo de cercas danificadas">Reparo de cercas danificadas</option>
                </optgroup>

                <optgroup label="Instalação de Aparelhos Domésticos">
                  <option value="Instalação de eletrodomésticos, como máquinas de lavar e secar">Instalação de eletrodomésticos, como máquinas de lavar e secar</option>
                  <option value="Instalação de ventiladores de teto">Instalação de ventiladores de teto</option>
                </optgroup>

                <optgroup label="Pequenos Reparos Gerais">
                  <option value="Troca de maçanetas">Troca de maçanetas</option>
                  <option value="Ajustes em persianas">Ajustes em persianas</option>
                  <option value="Substituição de vidros quebrados">Substituição de vidros quebrados</option>
                </optgroup>

                <optgroup label="Reparos em Telhados">
                  <option value="Substituição de telhas danificadas">Substituição de telhas danificadas</option>
                  <option value="Selagem de vazamentos de telhados">Selagem de vazamentos de telhados</option>
                </optgroup>

                <optgroup label="Construção de Churrasqueiras e Lareiras">
                  <option value="Construção de churrasqueiras e lareiras de alvenaria sob medida">Construção de churrasqueiras e lareiras de alvenaria sob medida</option>
                </optgroup>

                <optgroup label="Construção de Calçadas e Passeios">
                  <option value="Construção de calçadas e passeios em concreto ou pedra">Construção de calçadas e passeios em concreto ou pedra</option>
                </optgroup>

                <optgroup label="Manutenção de Veículos">
                  <option value="Troca de óleo">Troca de óleo</option>
                  <option value="Substituição de freios">Substituição de freios</option>
                  <option value="Alinhamento e balanceamento">Alinhamento e balanceamento</option>
                  <option value="Diagnóstico de problemas mecânicos em veículos">Diagnóstico de problemas mecânicos em veículos</option>
                  <option value="Troca de peças e componentes">Troca de peças e componentes</option>
                  <option value="Reparo de motores de veículos">Reparo de motores de veículos</option>
                </optgroup>

                <optgroup label="Serviços de Chaveiro Residencial">
                  <option value="Instalação, reparo e substituição de fechaduras e chaves em casas e apartamentos">Instalação, reparo e substituição de fechaduras e chaves em casas e apartamentos</option>
                </optgroup>

                <optgroup label="Chaveiro Automotivo">
                  <option value="Desbloqueio de veículos">Desbloqueio de veículos</option>
                  <option value="Cópias de chaves de automóveis">Cópias de chaves de automóveis</option>
                  <option value="Programação de chaves de transponder">Programação de chaves de transponder</option>
                </optgroup>

                <optgroup label="Chaveiro Comercial">
                  <option value="Serviços relacionados a fechaduras de escritórios e estabelecimentos comerciais">Serviços relacionados a fechaduras de escritórios e estabelecimentos comerciais</option>
                  <option value="Instalação de sistemas de controle de acesso">Instalação de sistemas de controle de acesso</option>
                </optgroup>

                <optgroup label="Chaves Codificadas">
                  <option value="Fornecimento de chaves codificadas para veículos modernos com sistemas de segurança avançados">Fornecimento de chaves codificadas para veículos modernos com sistemas de segurança avançados</option>
                </optgroup>

                <optgroup label="Abertura de Cofres">
                  <option value="Abertura de cofres e fechaduras de alta segurança em situações de emergência">Abertura de cofres e fechaduras de alta segurança em situações de emergência</option>
                </optgroup>

                <optgroup label="Outro">
                  <option value="Serviços variados">Serviços variados</option>
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

        {errorsConsultaCep.length > 0 && (
          <div className="alert alert-danger div-erros-consulta-cadastro">
            {errorsConsultaCep.map((error, index) => (
              <span key={index}>{error}</span>
            ))}
          </div>
        )}

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
                disabled
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
                disabled
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
                disabled
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
                disabled
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