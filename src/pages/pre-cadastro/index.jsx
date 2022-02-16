import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Input } from '../../components'
import useGlobalPreCadastro from '../../hooks/use-global-pre-cadastro'
import { useVtInvestApiPublic } from '../../hooks/use-vtinvest-public'
import { useErro } from '../../hooks/useErro'
import './style.css'
import InputMask from 'react-input-mask'

export function PreCadastro() {
  const loginApi = useVtInvestApiPublic()
  const [, setErro] = useErro()
  const [token, setToken] = useState('')
  const [cpf, setCpf] = useState('')
  const [tokenValido, setTokenValido] = useState(false)
  const[, setPreCadastro] = useGlobalPreCadastro()
  const navigate = useNavigate()

  function handleChangeToken(event) {
    setToken(event.target.value)
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

  function handleChangeCpf(event) {
    setCpf(onlyNumbers(event.target.value));
    if((cpf).length == 10){
      document.getElementById('token').focus();
    }
  }

  useEffect(() => {
    if(tokenValido) {
        setPreCadastro({
            cpf,
            token
        })
        navigate("/cadastro")
    }
  },[tokenValido])

  async function preCadastrar() {
    try {
      if(isValidCPF(cpf) == true){
        const response = await loginApi.validarToken(cpf, token)
        setTokenValido(response.tokenValido)
      }else{
        alert("Informe um CPF válido");
        document.getElementById('cpf').focus();
      }
    } catch (error) {
      setErro(error)
      console.log(error)
      alert("Verifique o token informado");
      document.getElementById('token').focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    preCadastrar()
  }

console.log(cpf);

  return (
    <div className="container-geral">
                  <div>                
                <div className="header-logo-etapa1" title="Página Inicial">
                    <a href="/"><img widh="70" height="60" src='/img/logo.png' alt="Página Inicial da Carteira VTinvest"/></a>
                </div>
            </div>

            <div className="dados-cliente">
              <h3 className="etapa1" >VERIFICAÇÃO DE CLIENTE</h3>
              <form id="pre-cadastro" onSubmit={handleSubmit} />
                
                <label htmlFor="cpf"> INFORME SEU CPF </label><br />
                  <InputMask mask="999.999.999-99" className="inputDadoCpf" autoFocus type="text" title="cpf" value={cpf} onChange={handleChangeCpf} id="cpf" name="cpf" form="pre-cadastro" /><br />
                
                <label htmlFor="token"> INFORME SEU TOKEN </label><br />
                  <Input className="inputDadosLong" type="text" title="token" value={token} onChange={handleChangeToken} id="token" name="token" form="pre-cadastro" />
                                  
                <button className="btn-token" form="pre-cadastro" type="submit">VERIFICAR</button>
            </div>            
        </div>
  )
}