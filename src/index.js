import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/sass/main.scss';
import ContextProvider from './context/ContextProvider';

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById('root')
);
