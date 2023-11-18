import { opcoesProfissoes } from '../../util/profissoes';

export default function ProfissoesOptions({ defaultOption = null }) {
    return (
        opcoesProfissoes.map(({ categoria, itens }, index) => {
            return (
                <>
                    {defaultOption && (
                        <option value="">{defaultOption}</option>
                    )}
                    <optgroup key={index} label={categoria}>
                        {itens.map((nome, index) => <option key={index} value={nome}>{nome}</option>)}
                    </optgroup>
                </>
            )
        })
    );
}