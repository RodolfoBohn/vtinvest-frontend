import { useCallback } from "react";
import { useAxios } from "./use-axios";

export function useVtInvestApiPublic() {
    const instance = useAxios()

    async function logar(login, senha) {
        const response = await instance.post('/login', {
            login,
            senha
        })

        return response.data;
    }

    async function validarToken(cpf, token) {
        const response = await instance.post('/public/validar-token', {
            cpf,
            token
        })

        return response.data;
    }

    async function cadastrar(emailPrimario, emailSecundario, senha, nome, sobrenome, cpf, token, login) {
        const response = await instance.post('/public/cadastrar-cliente', {
            emailPrimario, 
            emailSecundario,
            senha,
            nome, 
            sobrenome,
            cpf,
            token,
            login
        })

        return response.data;
    }

    return useCallback(
        {
            logar,
            validarToken,
            cadastrar,
        }, [])
}