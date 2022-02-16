import './style.css'
import { FaRegEdit } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";

export function ListaAcoesEmCadastro({ carteira, onEdit, onRemove }) {

    if(carteira.acoes.length <= 0) return null
    return (<div className="divCarteira">
        <table className="tableCarteira">
            <thead>
                <tr>
                    <th align="left">
                        ATIVO
                    </th>
                    <th align="right">
                        PESO IDEAL
                    </th>
                    <th align="right">
                        QUANTIDADE
                    </th>
                    <th colSpan="2">
                        ...
                    </th>
                </tr>
            </thead>
            <tbody>
                {carteira.acoes.map(acao => {
                    if (acao.acaoAtiva) {
                    return (
                        <tr>
                            <td align="left">{acao.nome}</td>
                            <td align="right">{acao.objetivo}%</td>
                            <td align="right">{acao.quantidade}</td>
                            <td colSpan="2" align="center">
                                <button className="btnEditar" onClick={() => onEdit(acao)}><FaRegEdit /></button>
                                <button className="btnRemove" onClick={() => onRemove(acao)}><FaWindowClose /></button>
                            </td>                            
                        </tr>
                    ) }
                })}
            </tbody>
        </table>
        </div>
    )
}