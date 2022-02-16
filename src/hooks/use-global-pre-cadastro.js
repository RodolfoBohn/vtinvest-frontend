import createGlobalState from 'react-create-global-state'

// create the global for your hook
const initialState = {
    cpf: null,
    token: null
}

const [useGlobalPreCadastro, Provider] = createGlobalState(initialState)


// export the provider to link in the application
export const GlobalUPreCadastroProvider = Provider

// export the hook
export default useGlobalPreCadastro