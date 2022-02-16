import { CarteiraCard} from '../index'
import './style.css'

export function CarteirasList({carteiras}) {
    console.log(carteiras);
    if(carteiras.length === 0){
        return <div className="carteiras"><h4>Não ha carteiras cadastradas!</h4></div>
    }

    return (
        <div>
            {carteiras?.map(carteira => <CarteiraCard key={carteira.id} id={carteira.id} nome={carteira.nome} />)}
        </div>
    )

}