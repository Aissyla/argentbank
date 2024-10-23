// ----------------------------------------------------- 
// Importation des modules nécessaires
// -----------------------------------------------------
import React from 'react'; // Importation de la bibliothèque React
import ReactDOM from 'react-dom/client'; // Importation de ReactDOM pour gérer le DOM
import './index.css'; // Importation du fichier CSS pour le style
import App from './App'; // Importation du composant principal de l'application
import { Provider } from "react-redux"; // Importation du `Provider` de React-Redux pour connecter Redux à React
import { PersistGate } from 'redux-persist/integration/react'; // Importation de PersistGate pour gérer la persistance de l'état
import { store, persistor } from './Redux/store'; // Importation du store et persistor pour gérer l'état global

// ----------------------------------------------------- 
// Création de la racine React sur l'élément du DOM avec l'id `root`
// -----------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root')); // Création de la racine React en ciblant l'élément du DOM

// ----------------------------------------------------- 
// Rendu de l'application React à l'intérieur de l'élément root
// -----------------------------------------------------
root.render(
  // Utilisation du composant `Provider` de React-Redux pour rendre le store Redux accessible à toute l'application
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* App est le composant racine de l'application qui contient tous les autres composants */}
      <App />
    </PersistGate>
  </Provider>,
);