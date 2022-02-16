import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { TelaDetalhesCarteira, TelaPrincipal, Login, PreCadastro, Cadastro, PrincipalAdmin } from './pages'
import useGlobalUser from './hooks/use-global-user';
import useGlobalPreCadastro from './hooks/use-global-pre-cadastro';


function RouteUserLogado({ children }) {
  const [usuario] = useGlobalUser();

  if (!usuario.token) {
    return <Navigate to="/login" />;
  }

  if (usuario.permissao === "ROLE_ADMIN") {
    return <Navigate to="/admin" />
  }


  return (
    children
  );
}

function RouteAdmin({ children }) {
  const [usuario] = useGlobalUser();

  console.log('user', usuario)

  if (!usuario.token) {
    console.log("entrou")
    return <Navigate to="/login" />;
  }

  if (usuario.permissao === "ROLE_USER") {
    return <Navigate to="/" />
  }


  return (
    children
  );
}

function RoutePreCadastro({ children }) {
  const [preCadastro] = useGlobalPreCadastro();

  if (!preCadastro.token) {
    return <Navigate to="/login" />;
  }

  return (
    children
  );
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path={'/'} exact element={
          <RouteUserLogado>
            <TelaPrincipal />
          </RouteUserLogado>} />
        <Route path={'/admin'} exact element={
          <RouteAdmin>
            <PrincipalAdmin />
          </RouteAdmin>} />
        <Route path={'/login'} exact element={<Login />} />
        <Route path={'/pre-cadastro'} exact element={<PreCadastro />} />
        <Route path={'/cadastro'} exact element={
          <RoutePreCadastro>
            <Cadastro />
          </RoutePreCadastro>} />
        <Route path={'/detalhes/:id'} element={
          <RouteUserLogado>
            <TelaDetalhesCarteira />
          </RouteUserLogado>} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>Errou</p>
            </main>
          }
        />
      </Routes>
    </div >
  );
}

export default App;
