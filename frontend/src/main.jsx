// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//Explicación del código:

//ReactDOM.createRoot: A partir de React 18, se utiliza createRoot para montar la aplicación. Es la forma moderna de montar la app en el DOM.
