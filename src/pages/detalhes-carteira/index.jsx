import { useParams, useNavigate } from 'react-router'
import './style.css'
import React, { useState, useEffect } from 'react'
import { Input, ListaAcoes, Modal, ModalMovimentacao, ModalHistoricoMovimentacao } from '../../components';
import { IoMdTrash } from 'react-icons/io';
import { IoMdCalculator } from 'react-icons/io';
import { FaRegEdit } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import useGlobalUser from '../../hooks/use-global-user';
import { useVtInvestApiUser } from '../../hooks/use-vtinvest-user';
import { useErro } from '../../hooks/useErro';
import { IoIosLogOut } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";

export function TelaDetalhesCarteira() {
    const [usuario] = useGlobalUser()
    const [habilitaCompraAutomatica, setHabilitaCompraAutomatica] = useState(false)
    const [atualizar, setAtualizar] = useState(false)
    const [, setErro] = useErro()
    const userApi = useVtInvestApiUser()
    const [carteira, setCarteira] = useState({})
    const [carteiraMovimentada, setCarteiraMovimentada] = useState({})
    const [abrirModal, setAbrirModal] = useState(false)
    const [abrirModalMovimentacao, setAbrirModalMovimentacao] = useState(false)
    const [abrirModalHistoricoMovimentacao, setAbrirModalHistoricoMovimentacao] = useState(false)
    const [valorAporte, setValorAporte] = useState('')
    const params = useParams()
    const navigate = useNavigate()

    console.log("OLOCO BICHO ESSA FERA HEIN MEU", carteiraMovimentada)

    useEffect(() => {
        buscarDetalhesCarteira(params.id)
    }, [params.id, atualizar])

    useEffect(() => {
        setValorAporte('')
        setCarteiraMovimentada({})
    }, [atualizar])

    async function buscarDetalhesCarteira(idCarteira) {
        const response = await userApi.buscarDetalhesCarteira(idCarteira)
        if (!response.acoes.some(acao => acao.quantidadeCompra > 0)) {
            setHabilitaCompraAutomatica(false)
        }
        setCarteira(response)
    }

    async function excluirCarteira(idCarteira) {
        try {
            const response = await userApi.excluirCarteira(idCarteira)
            window.alert(response)
            navigate('/')
        } catch (error) {
            setErro(error)
        }
    }

    function handleExcluirCarteira() {
        if (carteira.totalInvestido > 0) {
            window.alert("Não é possível excluir carteira que contenha um valor investido")
            return
        }

        excluirCarteira(carteira.id)
    }

    function handleChange(event) {
        setValorAporte(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        enviaSolicitacaoSugestaoCarteira()
    }

    async function enviaSolicitacaoSugestaoCarteira() {
        if (valorAporte < 0) {
            window.alert("O valor para o aporte deve ser maior que zero");
            return
        } else if (!valorAporte) {
            window.alert("Informe um valor para aporte")
            return
        }
        try {
            const response = await userApi.enviaSolicitacaoSugestaoCarteira(carteira.id, valorAporte)
            const acoesParaCompra = []
            response.acoes.forEach((acao) => {
                if (acao.quantidadeCompra > 0) {
                  acoesParaCompra.push({
                    idAcaoCarteira: acao.id,
                    tipoMovimentacao: "COMPRA",
                    quantidadeAcoes: acao.quantidadeCompra,
                  });
                }
              });
              
              setCarteiraMovimentada({
                idCarteira: response.id,
                acoesMovimentadas: acoesParaCompra,
              });
            setCarteira(response)
            if (response.acoes.some(acao => acao.quantidadeCompra > 0)) {
                setHabilitaCompraAutomatica(true)
            }
        } catch (error) {
            setErro(error)
            alert(error.response.data.message);
        }
    }

    function handleLogout() {
        localStorage.clear();
        window.location.href = '/';
    }

    function handleAbrirMovimentacao() {
        setAbrirModalMovimentacao(true)
    }

    function handleAbrirHistoricoMovimentacao() {
        setAbrirModalHistoricoMovimentacao(true)
    }

    function handleRealizarCompra() {

        const novoArray = carteiraMovimentada.acoesMovimentadas.filter(acaoMovimentada => acaoMovimentada.quantidadeAcoes > 0)

        const objetoCadastro = {
            ...carteiraMovimentada, 
            acoesMovimentadas: novoArray
        }
        
        registrarMovimentacaoSugestao(objetoCadastro)
    }

    async function registrarMovimentacaoSugestao(carteiraMovimentadaRegistrada) {
        try {
            const response = await userApi.movimentarCarteira(carteiraMovimentadaRegistrada)
            setAtualizar(!atualizar)
            alert("Transações adicionadas com sucesso!")
        } catch(error) {
            setErro(error)
            alert(error.response.data.message);
        }
    }

    function handleAlterarQuantidadeAcoesMovimentadas(event) {
        const { name, value } = event.target
        const falso = 0
        console.log({name, value})
        console.log(carteiraMovimentada.acoesMovimentadas)
        
        if(value >= 0){            
            const novoArray = carteiraMovimentada.acoesMovimentadas.map(acaoMovimentada => {
                console.log(acaoMovimentada.idAcaoCarteira)
                console.log(name)
                if (acaoMovimentada.idAcaoCarteira == name) {    
                    return {
                        ...acaoMovimentada,
                        quantidadeAcoes: value
                    }                     
                }

                return acaoMovimentada
            })
            //alert(falso)
            
            setCarteiraMovimentada({
                ...carteiraMovimentada, 
                acoesMovimentadas: novoArray
            })
            
        }else{
            alert("Informe uma quantidade válida")
        }
    }

    const vazio = 0;
    const [busca, setBusca] = useState('');

    const carteiraFiltrada = carteira?.acoes?.filter((acao) => acao.setor.toLowerCase().includes(busca.toLowerCase()));

    return (
        <div className="container-geral">
            <div>
                <div className="header-logo" title="Página Inicial">
                    <a href="/"><img widh="70" height="60" src='/img/logo.png' alt="Página Inicial da Carteira VTinvest" /></a>
                </div>

                <div class="dropdown">
                    <button className="btn-usuario">
                        <div className="header-usuario" title="Opções-usuário-Logout"><h1>Olá, {usuario.nome} <IoPerson /> <FaCaretDown /></h1></div>
                    </button>

                    <div class="item">
                        <p>
                            <button className="btn-logout" onClick={handleLogout}><h2><IoIosLogOut /> SAIR</h2></button>
                        </p>
                    </div>
                </div>
            </div>
            <br />
            <form id="enviar-sugestao" onSubmit={handleSubmit} />

            <div className="cabecalho">
                <div className="titleCarteira">
                    <h1>{carteira.nome}</h1>
                </div>

                <div className="subTitleCarteira">
                    <h3 className="infoCarteira">PATRIMÔNIO: {carteira.totalInvestido ?
                        carteira.totalInvestido.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                        : vazio.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                    }</h3>
                    <button className="btn-delete-carteira" title="Excluir Carteira" onClick={handleExcluirCarteira}><h1><IoMdTrash></IoMdTrash></h1></button>
                </div>
            </div>

            <div className="carteira-detalhes-lista-acoes">
                <div>
                    <label htmlFor="objetivo" className="objetivo">Informe o valor do Aporte </label>
                    <span className="prefix-span">R$</span>
                    <Input placeholder="500" autoFocus className="inputAporte" type="number" value={valorAporte} onChange={handleChange} name="objetivo" form="enviar-sugestao" disabled={carteira?.acoes?.length === 0} />
                    <button disabled={carteira?.acoes?.length === 0} className={carteira?.acoes?.length === 0 ? "btn-sugestao-disabled" : "btn-sugestao"} type="submit" form="enviar-sugestao" title="Distribui o valor do aporte, de acordo com o peso de cada ativo"><IoMdCalculator className="icon-calc" />Calcular sugestão</button>
                    <input className="filtro" placeholder="Filtrar Setor" title="Informe o nome do setor desejado" type="text" value={busca} onChange={(ev) => setBusca(ev.target.value)} disabled={carteira?.acoes?.length === 0} />
                </div>

                <ListaAcoes carteira={carteiraFiltrada} textoBusca={carteira?.acoes?.length === 0 ? "Não ha ações para esta carteira" : "Não ha ações para esta busca"} carteiraMovimentada={carteiraMovimentada} handleAlterarQuantidadeAcoesMovimentadas={handleAlterarQuantidadeAcoesMovimentadas} />

                <div className="div-btn-editar-carteira">
                    <button className={habilitaCompraAutomatica ? 'btn-compra' : 'btn-compra-disabled'} disabled={!habilitaCompraAutomatica} title="Comprar a quantidade informada acima" onClick={handleRealizarCompra}>COMPRAR</button>
                    <button className="btn-editar-carteira" title="Editar ativos da carteira" onClick={() => { setAbrirModal(true) }}><FaRegEdit />EDITAR CARTEIRA</button>
                    <button className='btn-movimentacao' title="Adicionar transação de sua preferência" onClick={handleAbrirMovimentacao}>ADICIONAR TRANSAÇÃO</button>
                    <button className='btn-historico' title="Exibe todas as transações registradas" onClick={handleAbrirHistoricoMovimentacao}>HISTÓRICO</button>
                    
                </div>

            </div>
            {abrirModal && <Modal handleClose={() => setAbrirModal(false)} handleAtualizar={() => setAtualizar(!atualizar)} carteiraInformada={carteira} />}
            {abrirModalMovimentacao && <ModalMovimentacao handleClose={() => setAbrirModalMovimentacao(false)} handleAtualizar={() => setAtualizar(!atualizar)} carteiraInformada={carteira} />}
            {abrirModalHistoricoMovimentacao && <ModalHistoricoMovimentacao handleClose={() => setAbrirModalHistoricoMovimentacao(false)} idCarteira={carteira.id}/>}
        </div>
    )
}