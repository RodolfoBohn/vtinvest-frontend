import { useCallback } from "react";
import { useAxios } from "./use-axios";
import useGlobalUser from "./use-global-user";

export function useVtInvestApiUser() {
    const [user] = useGlobalUser()
    const instance = useAxios({
        Authorization: `Bearer ${user.token}`
    })

    async function buscarCarteiras() {
        const response = await instance.get('/carteira/listar')
        return response.data
    }

    async function buscarAcoes() {
        const response = await instance.get('/acao')
        return response.data
    }

    async function buscarDetalhesCarteira(idCarteira) {
        const response = await instance.get(`carteira/detalhes/${idCarteira}`)
        return response.data
    }

    async function excluirCarteira(idCarteira) {
        const response = await instance.delete(`/carteira/${idCarteira}`)
        return response.data
    }

    async function enviaSolicitacaoSugestaoCarteira(idCarteira, valorAporte) {
        const response = await instance.get(`/carteira/sugestao-compra/${idCarteira}/${valorAporte}`)
        return response.data
    }

    async function editarCarteira(carteira) {
        const response = await instance.put("/carteira/editar", {
            ...carteira,
          })
        return response.data
    }

    async function cadastrarCarteira(carteira) {
        const response = await instance.post("/carteira/cadastrar", {
            ...carteira,
          })
        return response.data
    }

    async function movimentarCarteira(carteiraMovimentada) {
        const response = await instance.put("/carteira/movimentar", {
            ...carteiraMovimentada,
          })
        return response.data
    }

    async function buscarHistoricoMovimentacao(idCarteira) {
        const response = await instance.get(`/carteira/historico-movimentacao/${idCarteira}`)
        return response.data
    }

    return useCallback(
        {
            buscarCarteiras,
            buscarAcoes,
            buscarDetalhesCarteira,
            excluirCarteira,
            enviaSolicitacaoSugestaoCarteira,
            editarCarteira,
            cadastrarCarteira,
            movimentarCarteira,
            buscarHistoricoMovimentacao,
        }, [user.token, user.permissao])
}