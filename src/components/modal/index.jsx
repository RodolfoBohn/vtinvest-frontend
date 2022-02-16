import { useEffect, useState } from 'react'
import { Input, ListaAcoesEmCadastro } from '..'
import { CloseButton } from '../close-button'
import './style.css'
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaEraser } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { useVtInvestApiUser } from '../../hooks/use-vtinvest-user'
import { useErro } from '../../hooks/useErro';

const carteiraInicial = {
  nome: '',
  acoes: []
}

const acaoEmCadastroInicial = {
  id: null,
  nome: '',
  objetivo: '',
  quantidade: ''
}

export function Modal({ handleClose, carteiraInformada }) {

  const userApi = useVtInvestApiUser()
  const [, setErro] = useErro()
  const [acoes, setAcoes] = useState([])
  const [emEdicao, setEmEdicao] = useState(false)
  const [pesquisaCarteira, setPesquisaCarteira] = useState('')
  const [listaSugestoes, setListaSugestoes] = useState([])
  const [carteira, setCarteira] = useState(carteiraInformada ? { ...carteiraInformada, acoes: [...carteiraInformada.acoes] } : carteiraInicial)
  const [acaoEmCadastro, setAcaoEmCadastro] = useState(acaoEmCadastroInicial)

  useEffect(() => {
    buscarAcoes()
  }, [pesquisaCarteira])

  useEffect(() => {
    setListaSugestoes(
      acoes.filter((acao) => acao.nome.toUpperCase().startsWith(pesquisaCarteira.toUpperCase()))
    );
  }, [pesquisaCarteira]);

  //controla se o usuario clicou fora para limpar o campo pesquisa carteira
  useEffect(() => {
    function handleMouseClick(event) {
      setPesquisaCarteira('')
    }
    //captura evento de clique e limpa pesquisa carteira
    window.addEventListener('click', handleMouseClick)

    //desativa o evento de clique ao sair da tela
    return () => {
      window.removeEventListener('click', handleMouseClick)
    }
  }, []);

  async function buscarAcoes() {
    const response = await userApi.buscarAcoes()
    setAcoes(response)
  }

  function handleChange(changeEvent) {

    const { name, value } = changeEvent.target
    setCarteira({ ...carteira, [name]: value })
  }

  function handleChangeSelecaoAcao(changeEvent) {

    const { name, value } = changeEvent.target
    if (name === 'quantidade') {
      if (!Number.isInteger(value)) {
        const valor = Math.round(value)
        setAcaoEmCadastro({ ...acaoEmCadastro, [name]: valor })
        return
      }
    } else if (name === 'objetivo') {
      setAcaoEmCadastro({ ...acaoEmCadastro, [name]: parseFloat(value) })
      return
    }
    setAcaoEmCadastro({ ...acaoEmCadastro, [name]: value })
  }

  function handleChangePesquisarCarteira(changeEvent) {
    setPesquisaCarteira(changeEvent.target.value)
  }

  function handleLimparAcaoEmCadastro() {
    setAcaoEmCadastro(acaoEmCadastroInicial)
    setEmEdicao(false)
  }

  function handleAdicionarAcaoALista() {

    if ((acaoEmCadastro.id || emEdicao && acaoEmCadastro.idAtivo) && acaoEmCadastro.objetivo > 0) {
      if (emEdicao) {
        const novaCarteira = carteira.acoes.map(acao => {
          return acao.id === acaoEmCadastro.id ?
            {
              ...acao,
              objetivo: acaoEmCadastro.objetivo,
              quantidade: acaoEmCadastro.quantidade || 0
            } : acao
        })

        setCarteira({
          ...carteira,
          acoes: novaCarteira
        })
        setAcaoEmCadastro(acaoEmCadastroInicial)
        setEmEdicao(false)
        return
      }
      if (carteira?.acoes?.some(acao => acao.id === acaoEmCadastro.id && acao.acaoAtiva)) {
        window.alert("Esta ação já está na carteira")
        return
      }

      let novaCarteira

      if (carteira?.acoes?.some(acao => acao.id === acaoEmCadastro.id && !acao.acaoAtiva)) {
        novaCarteira = carteira.acoes.map(acao => {
          return acao.id === acaoEmCadastro.id ?
            {
              ...acao,
              acaoAtiva: true,
              objetivo: acaoEmCadastro.objetivo,
              quantidade: acaoEmCadastro.quantidade || 0
            } : acao
        })
      } else {
        novaCarteira = [
          ...carteira.acoes,
          {
            nome: acaoEmCadastro.nome,
            acaoAtiva: true,
            id: carteiraInformada ? null : acaoEmCadastro.id,
            idAtivo: acaoEmCadastro.id,
            objetivo: acaoEmCadastro.objetivo,
            quantidade: acaoEmCadastro.quantidade || 0
          }
        ]
      }

      setCarteira({
        ...carteira,
        acoes: novaCarteira
      })

      setAcaoEmCadastro(acaoEmCadastroInicial)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (carteira.acoes.length > 0) {
      const totalObjetivos = carteira.acoes.reduce((acc, acao) => {
        if (acao.acaoAtiva) {
          return acc + acao.objetivo
        }
        return acc
      }, 0);
      if (totalObjetivos != 100) {
        window.alert("O peso ideal deve totalizar 100%")
        return
      }
    }
    if (carteira.nome === '') {
      window.alert("O campo nome da carteira é obrigatorio")
      return
    }
    enviaCadastroCarteira()
  }

  function handleEditarAcaoDaLista(acao) {
    setAcaoEmCadastro({ ...acao })
    setEmEdicao(true)
  }

  function handleRemoverAcaoDaCarteira(acaoRemovida) {
    if (carteiraInformada) {
      if (acaoRemovida.quantidade > 0) {
        window.alert("Voce deve primeiro vender as ações para remover da carteira")
        return
      }
      acaoRemovida.acaoAtiva = false;

      const novaCarteira = carteira.acoes.map(acao => {
        if(acaoRemovida.id) {
          return acao.id === acaoRemovida.id ?
            {
              ...acao,
              acaoAtiva: acaoRemovida.acaoAtiva
            } : acao
        } else {
          return acao.idAtivo === acaoRemovida.idAtivo ?
          {
            ...acao,
            acaoAtiva: acaoRemovida.acaoAtiva
          } : acao
        }
      })

      setCarteira({
        ...carteira,
        acoes: novaCarteira
      })

    } else {
      carteira.acoes.splice(carteira.acoes.indexOf(acaoRemovida), 1)
      setCarteira({
        ...carteira,
        acoes: carteira.acoes
      })
    }
  }

  async function enviaCadastroCarteira() {
    try {
      if (carteiraInformada) {
        const response = await userApi.editarCarteira(carteira)

        window.alert(response)
        handleClose()
      } else {
        const response = await userApi.cadastrarCarteira(carteira)

        window.alert(response)
        handleClose()
      }

    } catch (error) {
      setErro(error)
      alert(error.response.data.message);
    }
  }

  return (
    <div className="modal-container">
      <div className="modal-content">
        <CloseButton onClick={handleClose} />
        <div>
          <h3 className="titile-carteira">{carteiraInformada ? 'Editar carteira' : 'Cadastrar Carteira'}</h3>
          <form id="enviar-carteira" onSubmit={handleSubmit} />

          <div title="Campo obrigatório" className="subTtitleCarteira">
            <label htmlFor="nome" className="nomeCarteira"><span >*</span> Nome da carteira: </label>
            <Input className="inputNomeCarteira" placeholder="ex: CARTEIRA  APOSENTADORIA" type="text" value={carteira.nome} onChange={handleChange} name="nome" form="enviar-carteira" autoFocus />
          </div>

          <div className="divisao">Inclusão de ações opcional</div>
          <div className="acoesCarteira">

            <div className="modal-form-cadastro-acao">
              <div className="pesquisa-acao">
                <label title="Informe o ativo que deseja adicionar" htmlFor="nomeAcao" className="ativo"> ATIVO:</label>
                <Input title="Informe o ativo que deseja adicionar" className="inputAtivo" disabled={emEdicao} type="text" value={acaoEmCadastro.nome ? acaoEmCadastro.nome : pesquisaCarteira} onChange={handleChangePesquisarCarteira} name="nomeAcao" form="enviar-carteira" placeholder="Pesquisar" />
                {pesquisaCarteira !== '' && (
                  <div
                    className={"box-sugestoes"}
                  >
                    <ul className="lista-tags">
                      {listaSugestoes.map((sugestao, index) => (
                        <li
                          key={index}
                          className="li-sugestao"
                          onClick={() => { setAcaoEmCadastro({ ...acaoEmCadastro, ...sugestao }) }}
                        >
                          {sugestao.nome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className='modal-form-cadastro-acao-input'>
                <label className="pesoDesejado" htmlFor="objetivo" title="Porcentagem que deseja ter em carteira"> PESO IDEAL: </label>
                <Input className="inputPesoDesejado" type="number" title="Porcentagem que deseja ter em carteira" value={acaoEmCadastro.objetivo} onChange={handleChangeSelecaoAcao} name="objetivo" form="enviar-carteira" />
              </div>
              {!carteiraInformada && (
                <div className='modal-form-cadastro-acao-input'>
                  <label className="quantidadeCarteira" htmlFor="quantidade" title="Informe a quantidade que já possui"> QUANTIDADE: </label>
                  <Input className="inputQuantidadeCarteira" type="number" title="Informe a quantidade que já possui" step="1" pattern="^[-/d]/d*$" value={acaoEmCadastro.quantidade} onChange={handleChangeSelecaoAcao} name="quantidade" form="enviar-carteira" />
                </div>
              )}

              <button className="addAcao" title="Adicionar ativo" onClick={handleAdicionarAcaoALista}>{emEdicao ? <FaRegEdit /> : <IoIosAddCircleOutline />} </button>
              <button className="limpaCampos" title="Limpar campos" onClick={handleLimparAcaoEmCadastro}><FaEraser /> </button>

            </div>

            <div>
              {carteira?.acoes?.length > 0 && <ListaAcoesEmCadastro carteira={carteira} carteiraInformada={carteira} onEdit={handleEditarAcaoDaLista} onRemove={handleRemoverAcaoDaCarteira} />}
            </div>

          </div>

          <div className="modal-footer">
            <div className="divbtnSalvaCarteira"><button className="btnSalvaCarteira" type="submit" form="enviar-carteira"><FaSave /> SALVAR</button></div>
          </div>

        </div>
      </div>
    </div>
  )
}