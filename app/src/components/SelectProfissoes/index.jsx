import { useEffect, useState } from "react";
import { opcoesProfissoes } from './profissoes';
import { Badge, CloseButton, Form } from "react-bootstrap";

export default function SelectProfissoes() {
    const [selectedProfissoes, setSelectedProfissoes] = useState([]);

    // Função para formatar a lista de profissões com tags removíveis
    const formatSelectedProfissoes = () => {
        return selectedProfissoes.map((profissao, index) => (
            <Badge pill key={index} className="m-1">
                {profissao}
                <CloseButton
                    type="button"
                    className="ms-1"
                    aria-label="Remover"
                    onClick={() => handleRemoveProfissao(profissao)}
                ></CloseButton>
            </Badge>
        ));
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

    return (
        <>
            <Form.Select
                multiple
                id="profissao"
                name="profissao"
                aria-label="Profissões"
                value={selectedProfissoes}
                onChange={handleProfissaoChange}
            >
                {opcoesProfissoes.map(({ categoria, itens }, index) => {
                    return (
                        <optgroup key={index} label={categoria}>
                            {itens.map((nome, index) => <option key={index} value={nome}>{nome}</option>)}
                        </optgroup>
                    )
                })}
            </Form.Select>
            <Form.Label htmlFor="profissao">Serviços Prestados</Form.Label>
            <div className="f-flex flex-wrap">
                {formatSelectedProfissoes()}
            </div>
        </>
    );
}