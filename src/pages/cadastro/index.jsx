import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Input } from '../../components'
import useGlobalPreCadastro from '../../hooks/use-global-pre-cadastro'
import { useVtInvestApiPublic } from '../../hooks/use-vtinvest-public'
import { useErro } from '../../hooks/useErro'
import './style.css'
import InputMask from 'react-input-mask';

export function Cadastro() {
  const [preCadastro, setPreCadastro] = useGlobalPreCadastro()
  const [, setErro] = useErro()
  const cadastroApi = useVtInvestApiPublic()
  const [token, setToken] = useState(preCadastro.token)
  const [cpf, setCpf] = useState(preCadastro.cpf)
  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [login, setLogin] = useState('')
  const [emailPrimario, setEmailPrimario] = useState('')
  const [emailSecundario, setEmailSecundario] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
  const navigate = useNavigate()

  function handleChangeNome(event) {
    setNome(event.target.value)
  }

  function handleChangeSobrenome(event) {
    setSobrenome(event.target.value)
  }

  function handleChangeEmailPrimario(event) {
    setEmailPrimario(event.target.value)
  }

  function handleChangeEmailSecundario(event) {
    setEmailSecundario(event.target.value)
  }

  function handleChangeSenha(event) {
    setSenha(event.target.value)
  }

  function handleChangeConfirmacaoSenha(event) {
    setConfirmacaoSenha(event.target.value)
  }

  function handleChangeLogin(event) {
    setLogin(event.target.value)
  }

  useEffect(() => {
    if (!preCadastro.cpf) {
      navigate("/login")
    }
  }, [])

  async function cadastrar() {
    if(senha !== confirmacaoSenha) {
      alert("As senhas não sao iguais")
      document.getElementById('senha').focus();
      return
    }
    if(senha.length < 5) {
      alert("A senha precisa ao menos de 5 caracteres")
      document.getElementById('senha').focus();
      return
    }
    try {
      const response = await cadastroApi.cadastrar(emailPrimario, emailSecundario, senha, nome, sobrenome, cpf, token, login)
      alert(response)
      navigate("/login")
    } catch (error) {
      setErro(error)
      console.log(error)
      console.log("CPF:" + cpf)
      console.log("token:" + token)
      console.log("login:" + login)
      console.log("nome:" + nome)
      console.log("sobrenome:" + sobrenome)
      console.log("senha:" + senha)
      console.log("email1:" + emailPrimario)
      console.log("email2:" + emailSecundario)
      alert("Informe corretamente todos os campos para seu cadastro")
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    cadastrar()
  }

  return (
    <div>
      <div className="container-geral">
        <div>                
            <div className="header-logo-cadastro" title="Página Inicial">
                <a href="/"><img widh="70" height="60" src='/img/logo.png' alt="Página Inicial da Carteira VTinvest"/></a>
            </div>
        </div>

        <div className="formulario">
          <div className="conteudoForm">        
            <form id="cadastro" onSubmit={handleSubmit} />
            <h2 className="titulo-cadastro">CADASTRO </h2>
            <label htmlFor="cpf"> CPF: </label>
            <InputMask mask="999.999.999-99" className="cpf" type="text" title="cpf" value={cpf} disabled={true} name="cpf" form="cadastro" />
            <label htmlFor="token"> TOKEN: </label>
            <Input className="token" type="text" title="token" value={token} disabled={true} name="token" form="cadastro" />
            <label htmlFor="nome"> NOME: </label><br />
            <Input className="nome" autoFocus type="text" title="nome" value={nome} onChange={handleChangeNome} name="nome" form="cadastro" /><br />
            <label htmlFor="sobrenome"> SOBRENOME: </label><br />
            <Input className="sobrenome" type="text" title="sobrenome" value={sobrenome} onChange={handleChangeSobrenome} name="sobrenome" form="cadastro" /><br />
            <label htmlFor="login"> USUÁRIO DE LOGIN: </label><br />
            <Input className="login" type="text" title="login" value={login} onChange={handleChangeLogin} name="login" form="cadastro" /><br />
            <label htmlFor="email-primario"> E-MAIL PRIMARIO: </label><br />
            <Input className="email" type="text" title="email-primario" value={emailPrimario} onChange={handleChangeEmailPrimario} name="email-primario" form="cadastro" /><br />
            <label htmlFor="email-secundario"> E-MAIL SECUNDARIO: </label><br />
            <Input className="email2" type="text" title="email-secundario" value={emailSecundario} onChange={handleChangeEmailSecundario} name="email-secundario" form="cadastro" /><br />
            <label htmlFor="senha"> SENHA: </label><br />
            <Input className="senha" type="password" title="senhao" value={senha} onChange={handleChangeSenha}id="senha" name="senha" form="cadastro" /><br />
            <label htmlFor="confirmacao-senha"> CONFIRME A SENHA: </label><br />
            <Input className="senhaconf" type="password" title="confirmacao-senha" value={confirmacaoSenha} onChange={handleChangeConfirmacaoSenha} name="confirmacao-senha" form="cadastro" /><br />
            <button className="btn-salvar"  form="cadastro" type="submit">SALVAR</button>
          </div>
        </div>
      </div>
    </div>
  )
}