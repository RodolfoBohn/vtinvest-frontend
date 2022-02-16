import { useCallback } from "react";
import { useAxios } from "./use-axios";
import useGlobalUser from "./use-global-user";

export function useVtInvestApiAdmin() {
    const [user] = useGlobalUser()
    const instance = useAxios({
        Authorization: `Bearer ${user.token}`
    })

    async function gerarTokenUsuario(cpf) {
        const response = await instance.post('/admin/cadastro-usuario', {
            cpf
        })

        return response.data;
    }

    return useCallback(
        {
            gerarTokenUsuario,
        }, [user.token, user.permissao])
}