import './style.css'
import * as React from 'react';

const vazio = 0;

export function ListaAcoes({ carteira, textoBusca, carteiraMovimentada, handleAlterarQuantidadeAcoesMovimentadas}) {
    //console.log("carteira aqui"+carteiraMovimentada); 

    if (!carteira) return null
    return (<div className="divCarteira">
        <table className="tableCarteira">
            <thead>
                <tr>
                    <th align="left">
                        ATIVO
                    </th>
                    <th align="center">
                        SETOR
                    </th>
                    <th align="right">
                        PREÇO ATUAL
                    </th>
                    <th align="right">
                        QUANTIDADE
                    </th>
                    <th align="right">
                        PATRIMÔNIO TOTAL
                    </th>
                    <th align="right">
                        PESO IDEAL
                    </th>
                    <th align="right">
                        PESO ATUAL
                    </th>
                    <th align="right">
                        % DO PESO ATUAL
                    </th>
                    <th className="quantidadeSugeridaCompra" align="center">
                        QTDE A SER<br /> COMPRADA
                    </th>
                    <th className="quantidadeCompra" align="center">
                        QUERO<br /> COMPRAR
                    </th>
                </tr>
            </thead>
            <tbody>
                {carteira.map(acao => {
                    const acaoCarteiraMovimentada = carteiraMovimentada?.acoesMovimentadas?.find(acaoMovimentada => acaoMovimentada.idAcaoCarteira === acao.id)
                    return (
                        <tr>
                            <td align="left">{acao.nome}</td>
                            <td align="center">{acao.setor}</td>
                            <td align="right">{acao.cotacaoAtualAtivo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                            <td align="right">{acao.quantidade}</td>
                            <td align="right">{
                                acao.patrimonioAtualizado ? acao.patrimonioAtualizado.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                                    : vazio.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td align="right">{acao.objetivo}%</td>
                            <td align="right">{acao.participacaoAtual.toFixed(1)}%</td>
                            <td align="right">{acao.distanciaObjetivo.toFixed(1)}%</td>
                            {
                                acao.quantidadeCompra ?
                                    <td align="right">{acao.quantidadeCompra}</td>
                                    : <td align="right">--</td>
                            }
                            {
                                acao.quantidadeCompra ?
                                    <td align="right">{<input className='inputCompra' type="number" value={acaoCarteiraMovimentada?.quantidadeAcoes || 0} onChange={handleAlterarQuantidadeAcoesMovimentadas} name={acaoCarteiraMovimentada?.idAcaoCarteira}/>}</td>
                                    : <td align="right">--</td>
                            }
                        </tr>
                    )
                })}
            </tbody>
        </table>
        
        {carteira?.length === 0 && <p className="textoCarteira">{textoBusca}</p>}

    </div>)
    

    
}