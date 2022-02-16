import './style.css'
import React, { useState, useEffect } from 'react'
import { CarteirasList } from '../../components'
import { Modal } from '../../components'
import { AiOutlinePlusSquare } from "react-icons/ai"
import { IoPerson } from "react-icons/io5";
import { useVtInvestApiUser } from '../../hooks/use-vtinvest-user'
import { useErro } from '../../hooks/useErro'
import useGlobalUser from '../../hooks/use-global-user'
import { clearLocalStorage } from '../../utils/localstorage'
import { IoIosLogOut } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";

export function TelaPrincipal() {
    let [usuario, setUsuario] = useGlobalUser()
    const userApi = useVtInvestApiUser()
    const [, setErro] = useErro()
    const [abrirModal, setAbrirModal] = useState(false)
    const [carteiras, setCarteiras] = useState([])

    useEffect(() => {
        buscarCarteiras()
    }, [abrirModal])

    async function buscarCarteiras() {
        try {
            const response = await userApi.buscarCarteiras()
            setCarteiras(response)
        } catch(error) {
            setErro(error)
        }
    }

    function handleLogout() { 
        localStorage.clear();
        window.location.href = '/';       
        //setUsuario={}
        //clearLocalStorage()
    }

    return (
        <div className="container-geral">
            <div>                
                <div className="header-logo" title="Página Inicial">
                    <a href="/"><img widh="70" height="60" src='/img/logo.png' alt="Página Inicial da Carteira VTinvest"/></a>
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
            <div className="principal-lista-carteiras">                
                <h1>Carteiras </h1>
                <button className="btn-add-carteira" title="Adicionar Nova Carteira" onClick={() => setAbrirModal(true)}>< AiOutlinePlusSquare /></button>
            </div>

            <CarteirasList className="list-carteiras" carteiras={carteiras} />
            {abrirModal && <Modal handleClose={() => setAbrirModal(false)} />}
        </div>
    )
}
