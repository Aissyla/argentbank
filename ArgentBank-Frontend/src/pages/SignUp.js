import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Hooks pour interagir avec Redux
import { login } from '../Redux/authSlice'; // Action login importée depuis le slice auth
import { useNavigate } from 'react-router-dom'; // Hook pour naviguer entre les pages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import '../index.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
function SignUp() {

   // Déclaration des états locaux pour gérer le nom d'utilisateur et le mot de passe
   const [username, setUsername] = useState(''); // État pour stocker le nom d'utilisateur
   const [password, setPassword] = useState(''); // État pour stocker le mot de passe

   const [rememberMe, setRememberMe] = useState(false); // Nouvel état pour gérer "Remember Me"

   // Initialisation de useDispatch pour envoyer des actions Redux
   const dispatch = useDispatch();

   // Initialisation de useNavigate pour rediriger après la connexion
   const navigate = useNavigate();

   // Récupération de l'état d'authentification et des erreurs depuis le store Redux
   const { isAuthenticated, error } = useSelector((state) => state.auth);

   // Fonction appelée lors de la soumission du formulaire de connexion
   const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    dispatch(login({ username, password })); // Envoie l'action login avec les identifiants saisis
    // Si "Remember Me" est coché, Redux Persist gérera automatiquement la persistance
    if (!rememberMe) {
      localStorage.removeItem('persist:auth'); // Si l'utilisateur ne souhaite pas se souvenir, on supprime les données persistées
    }
  };

   // Utilisation de useEffect pour rediriger l'utilisateur vers la page utilisateur après connexion
   useEffect(() => {
      if (isAuthenticated) {
         navigate('/UserPage'); // Redirige vers la page utilisateur si authentifié
      }
   }, [isAuthenticated, navigate]);
 
   return (
      <div>
         <Nav />
         <main className="main">
            <section className="sign-in-content">
               <FontAwesomeIcon icon={faUserCircle} className="sign-in-icon" />
               <h1>Sign In</h1>
                {/* Formulaire de connexion avec gestionnaire d'événements sur handleSubmit */}
               <form onSubmit={handleSubmit}>
                  <div className="input-wrapper">
                  <label htmlFor="username">Username</label>
                  <input
                     type="text"
                     id="username"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)} // Met à jour l'état avec la valeur saisie
                  />
                  </div>
                  <div className="input-wrapper">
                  <label htmlFor="password">Password</label>
                  <input
                     type="password"
                     id="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)} // Met à jour l'état avec la valeur saisie
                  />
                  </div>
                  <div className="input-remember">
                  <input 
                     type="checkbox" 
                     id="remember-me" 
                     checked={rememberMe}
                     onChange={(e) => setRememberMe(e.target.checked)} // Gestion de l'option "Remember Me"
                  />
                  <label htmlFor="remember-me">Remember me</label>
                  </div>
                  {/* Affiche un message d'erreur si l'authentification échoue */}
                  {error && <p>{error}</p>}
                  <button type="submit" className="sign-in-button">Sign In</button>
               </form>
            </section>
         </main>
         <Footer />
      </div>
   );
}
export default SignUp;