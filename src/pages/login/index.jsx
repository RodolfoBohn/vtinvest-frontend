import React, { useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router'
import { Input } from '../../components'
import useGlobalUser from '../../hooks/use-global-user'
import { useVtInvestApiPublic } from '../../hooks/use-vtinvest-public'
import { useErro } from '../../hooks/useErro'
import capa from '../../components/imgs/capa11.png'
import { AiOutlineArrowRight } from "react-icons/ai";

export function Login() {
  const loginApi = useVtInvestApiPublic()
  const [, setErro] = useErro()
  const [senha, setSenha] = useState('')
  const [login, setLogin] = useState('')
  const [, setUsuario] = useGlobalUser()
  const navigate = useNavigate()
  

  function handleChangeSenha(event) {
    setSenha(event.target.value)
  }

  function handleChangeLogin(event) {
    setLogin(event.target.value)
  }

  async function logar() {
    try {
      const response = await loginApi.logar(login, senha)
      setUsuario(response)
      navigate("/")
    } catch (error) {
      setErro(error)
      console.log(error)
      alert("Informe corretamente o usuário/senha!");      
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    logar()
  }

  return (
    <div className="container-geral">      
      <div>
          <div className="header-logo" title="Página Inicial - Efetue seu login">
              <a href="/"><img widh="100" height="90" src='/img/logo.png' alt="Bem vindo ao VTinvest" /></a>
          </div>
          <div className="header-usuario">
            <h3>          
              <form id="login" onSubmit={handleSubmit} />
              <label htmlFor="login"> USUÁRIO: </label>
                <Input className="inputNome" autoFocus type="text" title="login" value={login} onChange={handleChangeLogin} name="login" form="login" />
              <label htmlFor="senha"> SENHA: </label>
                <Input className="inputSenha" type="password" title="senha" value={senha} onChange={handleChangeSenha} name="senha" form="login" />
              <button className="btn-entrar" title="Logar no sistema" form="login" type="submit">ENTRAR</button>
              <button className="btn-cadastro" title="Cadastro de um novo usuário" onClick={() => navigate("/pre-cadastro")}>FAÇA O SEU CADASTRO &nbsp;&nbsp;<AiOutlineArrowRight /></button>
            </h3>
          </div>
      </div>

      <h1 className="titulo-capa">
        <b>
          GERENCIE SEUS INVESTIMENTOS NO VTinvest!
        </b>
      </h1>

      <div className="image-capa">        
        <img  alt="Bem vindo ao VTinvest"  src={capa }/>
      </div>

    </div>
  )
}