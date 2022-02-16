import './style.css'
import { AiOutlineClose } from 'react-icons/ai'
export function CloseButton({ ...props }) {
  return (
    <button className="close-button" {...props}>
      <AiOutlineClose size={50} />
    </button>
  )
}
