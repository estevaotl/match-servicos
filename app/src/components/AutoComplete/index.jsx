import React, { useState, useEffect } from 'react';
import { Search } from 'react-bootstrap-icons';
import { Button, FormControl, InputGroup, ListGroup } from 'react-bootstrap';

const Autocomplete = ({ onSelectJob, onSearch = null, exibirBotaoPesquisa = true, classeInputBusca = '', value = '' }) => {
    const jobList = [
        'Troca de tomadas e interruptores',
        'Instalação de luminárias',
        'Resolução de problemas elétricos simples',
        'Substituição de disjuntores',
        'Conserto de vazamentos de torneiras e canos',
        'Desentupimento de pias e ralos',
        'Instalação ou substituição de torneiras e válvulas',
        'Pintura de paredes e tetos',
        'Pintura de portas e janelas',
        'Preparação de superfícies, como lixar e aplicar primer',
        'Instalação de prateleiras',
        'Reparo de portas e fechaduras',
        'Montagem de móveis',
        'Construção de alvenaria, incluindo paredes de tijolos, blocos ou pedras',
        'Reparação de rachaduras em paredes',
        'Rejunte de azulejos',
        'Substituição de telhas danificadas',
        'Montagem de móveis e estantes',
        'Instalação de suportes para TV e prateleiras',
        'Montagem de playgrounds e equipamentos de ginástica',
        'Instalação de sistemas de armazenamento',
        'Remoção de detritos e folhas de calhas',
        'Desobstrução de calhas entupidas',
        'Lubrificação e reparos em portões',
        'Reparo de cercas danificadas',
        'Instalação de eletrodomésticos, como máquinas de lavar e secar',
        'Instalação de ventiladores de teto',
        'Troca de maçanetas',
        'Ajustes em persianas',
        'Substituição de vidros quebrados',
        'Substituição de telhas danificadas',
        'Selagem de vazamentos de telhados',
        'Construção de churrasqueiras e lareiras de alvenaria sob medida',
        'Construção de calçadas e passeios em concreto ou pedra',
        'Troca de óleo',
        'Substituição de freios',
        'Alinhamento e balanceamento',
        'Diagnóstico de problemas mecânicos em veículos',
        'Troca de peças e componentes',
        'Reparo de motores de veículos',
        'Instalação, reparo e substituição de fechaduras e chaves em casas e apartamentos',
        'Desbloqueio de veículos',
        'Cópias de chaves de automóveis',
        'Programação de chaves de transponder',
        'Serviços relacionados a fechaduras de escritórios e estabelecimentos comerciais',
        'Instalação de sistemas de controle de acesso',
        'Fornecimento de chaves codificadas para veículos modernos com sistemas de segurança avançados',
        'Abertura de cofres e fechaduras de alta segurança em situações de emergência',
        'Serviços variados'
    ];

    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        // Defina o valor inicial do input apenas na montagem do componente
        setInputValue(value !== '' ? value : '');
    }, [value]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setShowSuggestions(value.length > 0); // Mostra sugestões apenas se o valor de entrada não for vazio
    };

    const handleSelectSuggestion = (selectedJob) => {
        setInputValue(selectedJob);
        setShowSuggestions(false);
        onSelectJob(selectedJob);
    };

    const handleSearchClick = () => {
        setShowSuggestions(false);
        if (onSearch)
            onSearch(inputValue);
    };

    return (
        <>
            <InputGroup
                className={`
                    p-0
                    ${exibirBotaoPesquisa !== false ? "autocomplete search-box" : ''}
                `}
            >
                <FormControl
                    size="lg"
                    value={inputValue}
                    aria-describedby="search"
                    onChange={handleInputChange}
                    placeholder="Digite o serviço desejado"
                    aria-label="Digite o serviço desejado"
                    className={`${classeInputBusca !== '' ? classeInputBusca : ''}`}
                />

                {exibirBotaoPesquisa && (
                    <Button
                        id="search"
                        onClick={handleSearchClick}
                        size="lg"
                    >
                        <Search />
                    </Button>
                )}
            </InputGroup>

            {showSuggestions && (
                <ListGroup
                    className={`
                        p-0 flex-column flex-shrink-1
                        overflow-scroll  position-absolute top-100
                        z-1
                    `}
                    style={{
                        maxHeight: '228px',
                    }}
                >
                    {jobList
                        .filter((job) => job.toLowerCase().includes(inputValue.toLowerCase()))
                        .map((suggestion, index) => (
                            <ListGroup.Item
                                key={index}
                                action
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                {suggestion}
                            </ListGroup.Item>
                        ))}
                </ListGroup>
            )}
        </>
    );
};

export default Autocomplete;