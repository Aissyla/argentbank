import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Hooks pour interagir avec Redux
import { login, clearError } from '../Redux/authSlice'; // Action login et cleanError importées depuis le slice auth
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

   // Réinitialiser l'erreur à chaque fois que le composant se monte
   useEffect(() => {
      dispatch(clearError());
    }, [dispatch]);


   // Fonction appelée lors de la soumission du formulaire
   const handleSubmit = async (e) => {
      e.preventDefault();
    
      const resultAction = await dispatch(login({ username, password }));
    
      if (login.fulfilled.match(resultAction)) {
        const { token } = resultAction.payload;
    
        // Persistance selon "Remember Me"
        if (rememberMe) {
          localStorage.setItem('token', token); // Persistance longue
        } else {
          sessionStorage.setItem('token', token); // Persistance temporaire
        }
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
               {/* Affiche un message d'erreur si l'authentification échoue */}
               {error && <p className="error-form">{error}</p>}
                {/* Formulaire de connexion avec gestionnaire d'événements sur handleSubmit */}
               <form onSubmit={handleSubmit}>
                  <div className="input-wrapper">
                  <label htmlFor="username">Username</label>
                  <input
                     type="text"
                     id="username"
                     name="username"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)} // Met à jour l'état avec la valeur saisie
                     autoComplete="username" // Ajoute cet attribut pour que le navigateur reconnaisse le champ
                  />
                  </div>
                  <div className="input-wrapper">
                  <label htmlFor="password">Password</label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)} // Met à jour l'état avec la valeur saisie
                     autoComplete="current-password" // Attribut pour aider le navigateur à détecter le champ de mot de passe
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
                  <button type="submit" className="sign-in-button">Sign In</button>
               </form>
            </section>
         </main>
         <Footer />
      </div>
   );
}
export default SignUp;