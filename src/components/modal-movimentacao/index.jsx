import { useState } from 'react'
import { Input } from '..'
import './style.css'
import { useVtInvestApiUser } from '../../hooks/use-vtinvest-user'
import { useErro } from '../../hooks/useErro';
import { BaseModal } from '../base-modal';
import { FaSave } from "react-icons/fa";

const acaoEmMovimentoInicial = {
    id: 0,
    tipoMovimentacao: null,
    quantidadeAcoes: null
}

const carteiraMovimentadaInicial = {
    id: null,
    acoesMovimentadas: []
}

export function ModalMovimentacao({ handleClose, handleAtualizar, carteiraInformada }) {
    const [carteiraMovimentada, setCarteiraMovimentada] = useState({ ...carteiraMovimentadaInicial, idCarteira: carteiraInformada.id })
    const [acaoEmMovimento, setAcaoEmMovimento] = useState(acaoEmMovimentoInicial)
    const [tipoMovimento, setTipoMovimento] = useState('')
    const [quantidade, setQuantidade] = useState(0)

    const userApi = useVtInvestApiUser()
    const [, setErro] = useErro()

    function handleSubmit(event) {
        event.preventDefault()
        registrarMovimentacao()
    }

    async function registrarMovimentacao() {
        try {
            const response = await userApi.movimentarCarteira(carteiraMovimentada)
            //alert(response)
            alert("Transações adicionadas com sucesso!")
            handleAtualizar()
            handleClose()
        } catch(error) {
            alert("Nenhuma transação adicionada")
            setErro(error)
        }
    }

    function handleChangeQuantidade(event) {
        setQuantidade(event.target.value)
    }

    function handleChangeTipoMovimento(event) {
        setTipoMovimento(event.target.value)
    }

    function handleChangeAcaoEmMovimento(event) {

        const value = event.target.value
        setAcaoEmMovimento(carteiraInformada?.acoes.find(acao => acao.id == value))
    }

    function handleAdicionarMovimentacao() {
        if (tipoMovimento === 'VENDA' && acaoEmMovimento.quantidade < quantidade) {
            alert("A quantidade de venda nao pode ser maior que a quantidade de ações compradas na carteira")
            return
        }
        if(acaoEmMovimento.id === 0){
            alert("Selecione um ativo");
            document.getElementById('acoes').focus();
            return;
        }else if(tipoMovimento === ''){
            alert("Selecione o tipo de operação");
            document.getElementById('tipo-operacao').focus();
            return;
        }else if(quantidade === 0 || quantidade < 0){
            alert("Informe uma quantidade maior que 0");
            document.getElementById('quantidade').focus();
            return;
        }
        setCarteiraMovimentada({
            ...carteiraMovimentada,
            acoesMovimentadas: [
                ...carteiraMovimentada.acoesMovimentadas,
                {
                    idAcaoCarteira: acaoEmMovimento.id,
                    nomeAcao: acaoEmMovimento.nome,
                    tipoMovimentacao: tipoMovimento,
                    quantidadeAcoes: quantidade
                }
            ]
        })
        setAcaoEmMovimento(acaoEmMovimentoInicial)
        setTipoMovimento('')
        setQuantidade(0)
    }

    function handleFocus() {
        document.getElementById('quantidade').select();
    }
    

    return (
        <BaseModal handleClose={handleClose}>
            <div>
                <h3 className="titile-carteira">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ADICIONAR TRANSAÇÃO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h3><br />
                <form id="registrar-movimentacao" onSubmit={handleSubmit} />
                <label htmlFor="acoes" className="ativo">ATIVO </label><br />
                <select className='inputAtivo' id="acoes" name="acoes" value={acaoEmMovimento.id} onChange={handleChangeAcaoEmMovimento}>
                    <option value={acaoEmMovimentoInicial.id} disabled selected>
                        Selecione
                    </option>
                    {carteiraInformada?.acoes.map((acao) => {
                        return (
                            <option value={acao.id} key={acao.id}>
                                {acao.nome}
                            </option>
                        )
                    })}
                </select><br />
                <label htmlFor="tipo-operacao" className="ativo">TIPO DE OPERAÇÃO </label><br />
                <select className='inputAtivo' id="tipo-operacao" name="tipo-operacao" onChange={handleChangeTipoMovimento} value={tipoMovimento}>
                    <option value='' disabled selected>
                        Selecione
                    </option>
                    <option value='COMPRA'>
                        COMPRA
                    </option>
                    <option value='VENDA'>
                        VENDA
                    </option>
                </select><br />
                <label htmlFor="quantidade" className="ativo" title="Informe a quantidade movimentada"> QUANTIDADE </label><br />
                <Input className='inputQtdeAtivo' id="quantidade" onFocus={handleFocus} type="number" title="Informe a quantidade movimentada" step="1" pattern="^[-/d]/d*$" value={quantidade} onChange={handleChangeQuantidade} name="quantidade" form="enviar-carteira" />
                <button className='btn-add' onClick={handleAdicionarMovimentacao}>ADICIONAR</button>

            </div>
            <div>                
                    <div className="divCarteira">
                    <table className="tableCarteira">
                        <thead>
                            <tr>
                                <th align="left">
                                    ATIVO
                                </th>
                                <th align="right">
                                    TRANSAÇÃO
                                </th>
                                <th align="right">
                                    QUANTIDADE
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {carteiraMovimentada.acoesMovimentadas.map(acao => {
                                return (
                                    <tr>
                                        <td align="left">{acao.nomeAcao}</td>
                                        <td align="right">{acao.tipoMovimentacao}</td>
                                        <td align="right">{acao.quantidadeAcoes}</td>                      
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    </div>
                <button className='btnSalvaCarteira' form='registrar-movimentacao' type='submit'><FaSave />SALVAR</button>
            </div>
        </BaseModal>
    )
}