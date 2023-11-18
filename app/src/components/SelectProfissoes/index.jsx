import { useEffect, useState } from "react";
import { Badge, CloseButton, Form } from "react-bootstrap";
import ProfissoesOptions from "../ProfissoesOptions";

export default function SelectProfissoes({
    multiple = null,
    filter = null,
    onChange,
    value
}) {
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
                multiple={multiple}
                id="profissao"
                name="profissao"
                aria-label="Profissões"
                value={filter ? selectedProfissoes : value}
                onChange={filter ? handleProfissaoChange : onChange}
            >
                <ProfissoesOptions defaultOption="Selecione uma profissão" />
            </Form.Select>
            <Form.Label htmlFor="profissao">Serviços Prestados</Form.Label>
            {filter && (
                <div className="f-flex flex-wrap">
                    {formatSelectedProfissoes()}
                </div>
            )}
        </>
    );
}