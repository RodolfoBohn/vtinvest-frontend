import React, { useState } from 'react'
import { Input } from '../../components'
import useGlobalUser from '../../hooks/use-global-user'
import { useVtInvestApiAdmin } from '../../hooks/use-vtinvest-admin'
import { useErro } from '../../hooks/useErro'
import { IoPerson } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";
import './style.css';
import InputMask from 'react-input-mask';

export function PrincipalAdmin() {
    const adminApi = useVtInvestApiAdmin()
    const [cpf, setCpf] = useState('')
    const [cpfCadastrado, setCpfCadastrado] = useState('')
    const [token, setToken] = useState('')
    const [, setUsuario] = useGlobalUser()
    const [, setErro] = useErro()

    function handleChangeCpf(event) {
        setCpf(onlyNumbers(event.target.value));        
    }

    function isValidCPF(cpf) {
        if (typeof cpf !== "string") return false
        cpf = cpf.replace(/[\s.-]*/igm, '')
        if (
            !cpf ||
            cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999" 
        ) {
            return false
        }
        var soma = 0
        var resto
        for (var i = 1; i <= 9; i++) 
            soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
        resto = (soma * 10) % 11
        if ((resto == 10) || (resto == 11))  resto = 0
        if (resto != parseInt(cpf.substring(9, 10)) ) return false
        soma = 0
        for (var i = 1; i <= 10; i++) 
            soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
        resto = (soma * 10) % 11
        if ((resto == 10) || (resto == 11))  resto = 0
        if (resto != parseInt(cpf.substring(10, 11) ) ) return false
        return true
      }
    
      const onlyNumbers = (str) => str.replace(/[^0-9]/g, '')

    async function gerarToken() {
        try {
            if(isValidCPF(cpf) == true){
                const response = await adminApi.gerarTokenUsuario(cpf)
                setCpfCadastrado(response.cpf)
                setToken(response.token)
              }else{
                alert("Informe um CPF válido");
                document.getElementById('cpf').focus();
              }            
        } catch (error) {
            setErro(error)            
            alert("CPF de cliente já cadastrado");
        }
    }

    function handleSubmit(event) {
        event.preventDefault()
        gerarToken()
    }

    function handleLogout() { 
        localStorage.clear();
        window.location.href = '/';       
    }

    function handleNovoToken() {         
        document.location.reload(true); 
    }

    return (
        <div className="container-geral">
            <div>                

                <div className="header-logo" title="Página Inicial">
                    <a href="/"><img widh="70" height="60" src='/img/logo.png' alt="Página Inicial da Carteira VTinvest"/></a>
                </div>                
                
                <div class="dropdown">
                    <button className="btn-usuario">
                        <div className="header-usuario" title="Opções-usuário-Logout"><h1>Olá, Analista <IoPerson /> <FaCaretDown /></h1></div>
                    </button>

                    <div class="item">
                        <p>
                            <button className="btn-logout" onClick={handleLogout}><h2><IoIosLogOut /> SAIR</h2></button>
                        </p>
                    </div>
                </div>     

            </div>

            <div className="dados-cliente">
                <form id="gerar-token" onSubmit={handleSubmit} /><br />
                    <label htmlFor="cpf">INFORME O CPF DO CLIENTE </label>
                    <br />
                    <InputMask mask="999.999.999-99" className="inputDadoCpf" autoFocus type="text" title="cpf" value={cpf} onChange={handleChangeCpf} id="cpf" name="cpf" form="gerar-token" />
                    <br />
                    {token ? <button className="btn-token" onClick={handleNovoToken}>{'GERAR NOVO TOKEN'}</button>
                    : <button className="btn-token" id="bt-token" form="gerar-token" type="submit">{'GERAR TOKEN'}</button>}
                    <br />
                    {token &&
                    <div><br />
                        <p>CLIENTE: {cpfCadastrado}</p>
                        <p>Token: {token}</p>
                    </div>}
            </div>            
        </div>
    )
}