// ----------------------------------------------------- 
// Importation des modules nécessaires
// -----------------------------------------------------
import React, { useState, useEffect } from 'react'; // Importation des hooks React
import { useDispatch, useSelector } from 'react-redux'; // Hooks pour interagir avec Redux
import { login, clearError } from '../Redux/authSlice'; // Action login et clearError importées depuis le slice auth
import { useNavigate } from 'react-router-dom'; // Hook pour naviguer entre les pages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importation des icônes Font Awesome
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Importation d'une icône spécifique
import '../index.css'; // Importation du fichier CSS pour le style
import Nav from '../components/Nav'; // Importation du composant de navigation
import Footer from '../components/Footer'; // Importation du composant de pied de page

// ----------------------------------------------------- 
// Déclaration du composant SignUp
// -----------------------------------------------------
function SignUp() {
   // Déclaration des états locaux pour gérer le nom d'utilisateur, le mot de passe et l'option "Remember Me"
   const [username, setUsername] = useState(''); // État pour stocker le nom d'utilisateur
   const [password, setPassword] = useState(''); // État pour stocker le mot de passe
   const [rememberMe, setRememberMe] = useState(false); // État pour gérer "Remember Me"

   // Initialisation de useDispatch pour envoyer des actions Redux
   const dispatch = useDispatch();

   // Initialisation de useNavigate pour rediriger après la connexion
   const navigate = useNavigate();

   // Récupération de l'état d'authentification et des erreurs depuis le store Redux
   const { isAuthenticated, error } = useSelector((state) => state.auth);

   // Réinitialiser l'erreur à chaque fois que le composant se monte
   useEffect(() => {
      dispatch(clearError()); // Appel de l'action pour nettoyer les erreurs
   }, [dispatch]); // Dépendance pour exécuter l'effet à chaque montée

   // Fonction appelée lors de la soumission du formulaire
   const handleSubmit = async (e) => {
      e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

      // Stocke l'état de Remember Me avant la tentative de connexion
      localStorage.setItem('rememberMe', rememberMe.toString());

      // Appel de l'action login avec les informations de connexion
      const resultAction = await dispatch(login({ username, password }));

      // Vérifie si la connexion a été effectuée avec succès
      if (login.fulfilled.match(resultAction)) {
         const { token } = resultAction.payload; // Récupération du token de l'action

         // Stocke le token dans le storage approprié
         if (rememberMe) {
            localStorage.setItem('token', token); // Sauvegarde le token si Remember Me est coché
         } else {
            // Nettoyage du localStorage si Remember Me n'est pas coché
            localStorage.removeItem('token');
         }
      }
   };

   // Utilisation de useEffect pour rediriger l'utilisateur vers la page utilisateur après connexion
   useEffect(() => {
      if (isAuthenticated) {
         navigate('/UserPage'); // Redirige vers la page utilisateur si authentifié
      }
   }, [isAuthenticated, navigate]); // Dépendances pour exécuter l'effet sur changement d'authentification

   // ----------------------------------------------------- 
   // Rendu du composant
   // -----------------------------------------------------
   return (
      <div>
         <Nav /> {/* Affiche la barre de navigation */}
         <main className="main">
            <section className="sign-in-content">
               <FontAwesomeIcon icon={faUserCircle} className="sign-in-icon" /> {/* Icône de connexion */}
               <h1>Sign In</h1> {/* Titre du formulaire de connexion */}
               {/* Affiche un message d'erreur si l'authentification échoue */}
               {error && <p className="error-form">{error}</p>} {/* Message d'erreur */}
               {/* Formulaire de connexion avec gestionnaire d'événements sur handleSubmit */}
               <form onSubmit={handleSubmit}>
                  <div className="input-wrapper">
                     <label htmlFor="username">Username</label>
                     <input
                        type="text"
                        id="username"
                        name="username"
                        value={username} // Lien avec l'état du nom d'utilisateur
                        onChange={(e) => setUsername(e.target.value)} // Met à jour l'état avec la valeur saisie
                        autoComplete="username" // Attribut pour que le navigateur reconnaisse le champ
                     />
                  </div>
                  <div className="input-wrapper">
                     <label htmlFor="password">Password</label>
                     <input
                        type="password"
                        id="password"
                        name="password"
                        value={password} // Lien avec l'état du mot de passe
                        onChange={(e) => setPassword(e.target.value)} // Met à jour l'état avec la valeur saisie
                        autoComplete="current-password" // Attribut pour aider le navigateur à détecter le champ de mot de passe
                     />
                  </div>
                  <div className="input-remember">
                     <input 
                        type="checkbox" 
                        id="remember-me" 
                        checked={rememberMe} // État de la case à cocher
                        onChange={(e) => setRememberMe(e.target.checked)} // Gestion de l'option "Remember Me"
                     />
                     <label htmlFor="remember-me">Remember me</label> {/* Étiquette pour la case à cocher */}
                  </div>
                  <button type="submit" className="sign-in-button">Sign In</button> {/* Bouton de soumission */}
               </form>
            </section>
         </main>
         <Footer /> {/* Affiche le pied de page */}
      </div>
   );
}

export default SignUp; // Exportation du composant SignUp