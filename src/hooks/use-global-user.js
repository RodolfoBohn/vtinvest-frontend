import createGlobalState from 'react-create-global-state'
import { setLocalStorage, getLocalStorage } from '../utils/localstorage'

// create the global for your hook
const initialState = {
    nome: null,
    permissao: null,
    token: null
}

const usuario = getLocalStorage('user') || initialState

const [_useGlobalUser, Provider] = createGlobalState(usuario)

const useGlobalUser = () => {
    const [state, _setState] = _useGlobalUser();

    function setState(updatedUser) {
        _setState(updatedUser);
        setLocalStorage('user', updatedUser);
    }

    return [state, setState];
};

// export the provider to link in the application
export const GlobalUserProvider = Provider

// export the hook
export default useGlobalUser