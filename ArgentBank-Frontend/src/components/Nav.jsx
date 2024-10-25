// Importation des modules nécessaires pour le composant
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Importation des hooks Redux pour interagir avec le store
import { Link } from 'react-router-dom'; // Importation du composant Link pour la navigation
import { logout } from '../Redux/authSlice'; // Importation de l'action logout depuis le slice auth
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import '../index.css';
function Nav() {

  // Utilise useDispatch pour pouvoir envoyer des actions vers le store Redux
  const dispatch = useDispatch();

  // Récupère l'état d'authentification et les informations de l'utilisateur avec useSelector
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fonction pour gérer la déconnexion : déclenche l'action logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token'); // Supprime le token du localStorage
  };

  return (
    <nav className="main-nav">
        {/* Logo de la banque, qui redirige vers la page d'accueil quand on clique dessus */}
        <Link to="/" className="main-nav-logo">
          <img
            className="main-nav-logo-image"
            src="argentBankLogo.webp"
            alt="Argent Bank Logo"
          />
          <h1 className="sr-only">Argent Bank</h1>
        </Link>
      <div>
        {/* Si l'utilisateur n'est pas authentifié, afficher le bouton "Sign In" */}
        {!isAuthenticated ? (
            <Link to="/SignUp" className="main-nav-item"> 
              <FontAwesomeIcon icon={faUserCircle} /> 
              Sign In
            </Link>
          ) : (
            /* Si l'utilisateur est connecté, afficher son nom et les options de configuration/déconnexion */
            <>
              <Link to="/UserPage" className="main-nav-item"> 
                <span className="main-nav-item">
                  {user ? (user.pseudo ? user.pseudo : user.firstName) : ''}
                  <FontAwesomeIcon icon={faUserCircle} />
                </span>
              </Link>
              <FontAwesomeIcon icon={faGear} />
              <button onClick={handleLogout} className="main-nav-item">
                <FontAwesomeIcon icon={faPowerOff} />
              </button>
            </>
          )}
      </div>
    </nav>
  );
}

export default Nav;