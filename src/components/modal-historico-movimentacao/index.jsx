import { useState } from 'react'
import './style.css'
import { useVtInvestApiUser } from '../../hooks/use-vtinvest-user'
import { useErro } from '../../hooks/useErro';
import { BaseModal } from '../base-modal';
import { useEffect } from 'react';
import moment from 'moment'


export function ModalHistoricoMovimentacao({ handleClose, idCarteira }) {
    const [historico, setHistorico] = useState([])
    console.log(historico)
    const userApi = useVtInvestApiUser()
    const [, setErro] = useErro()
    
    useEffect(() => {
        buscarHistoricoMovimentacao()
    },[idCarteira])

    async function buscarHistoricoMovimentacao() {
        try {
            const response = await userApi.buscarHistoricoMovimentacao(idCarteira)
            setHistorico(response)
        } catch(error) {
            setErro(error)
        }
    }

    return (
        <BaseModal handleClose={handleClose}>
            <div>
                <h3 className="titile-carteira">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HISTÓRICO DE TRANSAÇÕES&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h3><br />

                <div className="divCarteira">
                    <table className="tableCarteira">
                        <thead>
                            <tr>
                                <th align="left">
                                    ATIVO
                                </th>
                                <th align="center">
                                    DATA
                                </th>
                                <th align="center">
                                    TRANSAÇÃO
                                </th>
                                <th align="right">
                                    QUANTIDADE
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {historico.map(acaoHistorico => {
                                const data = new Date(acaoHistorico.data)
                                return (
                                    <tr>
                                        <td align="left">{acaoHistorico.nomeAcao}</td>
                                        <td align="right">{data.toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                        <td align="right">{acaoHistorico.tipoMovimentacao}</td>                      
                                        <td align="right">{acaoHistorico.quantidade}</td>                      
                                    </tr>
                                )
                            })}
                            {historico?.length === 0 && <tr className="textoCarteira"><td colspan="4">Sem transações adicionadas</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </BaseModal>
    )
}