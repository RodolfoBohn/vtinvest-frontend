import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GlobalUserProvider } from './hooks/use-global-user'
import { GlobalUPreCadastroProvider } from './hooks/use-global-pre-cadastro'

ReactDOM.render(
  <React.StrictMode>
    <GlobalUserProvider>
      <GlobalUPreCadastroProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GlobalUPreCadastroProvider>
    </GlobalUserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
