import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux"; // Importation du `Provider` de React-Redux pour connecter Redux à React
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './Redux/oldStore'; // Importez le store et persistor pour gérer l'état global

// Création de la racine React sur l'élément du DOM avec l'id `root`
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendu de l'application React à l'intérieur de l'élément root
root.render(
  // Utilisation du composant `Provider` de React-Redux pour rendre le store Redux accessible à toute l'application
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* App est le composant racine de l'application qui contient tous les autres composants */}
      <App />
    </PersistGate>
  </Provider>,
);