import { CloseButton } from '../close-button'
import './style.css'

export function BaseModal({ handleClose, children }) {



  return (
    <div className="modal-container">
      <div className="modal-content">
        <CloseButton onClick={handleClose} />
        {children}
      </div>
    </div>
  )
}