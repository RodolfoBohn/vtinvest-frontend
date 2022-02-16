import "./style.css"

export function BotaoLogin({botaoVermelho, onClick}) {
    return (
        <button onClick={onClick} className={`.botao--login ${botaoVermelho ? 'vermelho' : 'azul'}`}>login</button>
    )
}