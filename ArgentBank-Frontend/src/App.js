// ----------------------------------------------------- 
// Importation des modules nécessaires
// -----------------------------------------------------
// Importation de React et des hooks nécessaires
import React, { useEffect } from 'react';
// Importation du hook useDispatch pour interagir avec le store Redux
import { useDispatch } from 'react-redux';
// Importation de l'action pour vérifier l'état d'authentification
import { checkAuthState } from './Redux/authSlice';
// Importation des composants pour la gestion des routes
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// Importation des pages de l'application
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import UserPage from './pages/UserPage';
import Error from './pages/Error';
// Importation du fichier CSS pour le style
import './index.css';

function App() {
  // Récupération de la fonction dispatch pour envoyer des actions
  const dispatch = useDispatch();

  // ----------------------------------------------------- 
  // Effet secondaire pour vérifier l'état d'authentification à chaque chargement du composant
  // -----------------------------------------------------
  useEffect(() => {
    // Envoi de l'action pour vérifier l'état d'authentification
    dispatch(checkAuthState());
  }, [dispatch]); // Le tableau de dépendances assure que l'effet ne se déclenche qu'une fois

  return (
    // ----------------------------------------------------- 
    // Configuration du routeur pour gérer la navigation dans l'application
    // -----------------------------------------------------
    <Router>
      <Routes>
        {/* Redirection de la racine vers la page d'accueil */}
        <Route path="/" element={<Navigate replace to="/HomePage" />} />
        {/* Définition de la route pour la page d'accueil */}
        <Route path="/HomePage" element={<HomePage />} />
        {/* Définition de la route pour l'inscription */}
        <Route path="/SignUp" element={<SignUp />} /> 
        {/* Définition de la route pour la page utilisateur */}
        <Route path="/UserPage" element={<UserPage />} />
        {/* Route pour gérer les erreurs (toutes les autres routes non définies) */}
        <Route path='*' element={<Error />} />
      </Routes>
    </Router>
  );
}

// Exportation du composant App pour qu'il soit utilisé dans d'autres parties de l'application
export default App;
