import './style.css'
import { useNavigate } from 'react-router-dom'
import { IoMdMenu } from "react-icons/io"
import { IoMdWallet } from "react-icons/io"

export function CarteiraCard({ id, nome }) {
    const navigate = useNavigate()
    return (
        <div className="carteira-card-container" onClick={() => {navigate(`/detalhes/${id}`)}}>
            <div className="card">
                <h3 className="wallet"><IoMdWallet></IoMdWallet></h3>
                <h3 className="nameCar">{nome}</h3>
                <IoMdMenu className="expandeCarteira"></IoMdMenu>
            </div>
        </div>
    )
}