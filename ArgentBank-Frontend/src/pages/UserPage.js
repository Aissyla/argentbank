// ----------------------------------------------------- 
// Importation des modules nécessaires
// -----------------------------------------------------
import React, { useState, useEffect } from 'react'; // Importation des hooks React
import { useSelector, useDispatch } from 'react-redux'; // Importation des hooks Redux
import { useNavigate } from 'react-router-dom'; // Importation pour gérer la navigation
import { updatePseudo } from '../Redux/authSlice'; // Importation de l'action pour mettre à jour le pseudo
import '../index.css'; // Importation du fichier CSS pour le style
import Nav from '../components/Nav'; // Importation du composant de navigation
import Account from '../components/Account'; // Importation du composant Account
import Footer from '../components/Footer'; // Importation du composant de pied de page
import axios from 'axios'; // Importation pour faire des requêtes HTTP

// ----------------------------------------------------- 
// Déclaration du composant UserPage
// -----------------------------------------------------
function UserPage() {
  // Récupération des informations d'authentification depuis le store Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Hook pour dispatch des actions Redux
  const navigate = useNavigate(); // Hook pour la navigation

  // États locaux pour gérer le mode d'édition et les informations utilisateur
  const [isEditing, setIsEditing] = useState(false);
  const [newPseudo, setNewPseudo] = useState(''); // État pour le nouveau pseudo
  const [firstName, setFirstName] = useState(''); // État pour le prénom
  const [lastName, setLastName] = useState(''); // État pour le nom de famille

  // ----------------------------------------------------- 
  // Effet pour vérifier l'authentification de l'utilisateur
  // -----------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/SignUp'); // Redirige vers la page d'inscription si non authentifié
    } else {
      console.log('User restored from Redux Persist:', user);
      console.log('isAuthenticated après restauration:', isAuthenticated);
      // Charge les informations utilisateur si authentifié
      setNewPseudo(user ? user.pseudo : ''); // Vérifie si `user` est défini
      setFirstName(user ? user.firstName : ''); // Vérifie si `user` est défini
      setLastName(user ? user.lastName : ''); // Vérifie si `user` est défini
    }
  }, [isAuthenticated, user, navigate]); // Dépendances de l'effet

  // ----------------------------------------------------- 
  // Effet pour mettre à jour les valeurs si l'utilisateur change
  // -----------------------------------------------------
  useEffect(() => {
    if (user) {
      console.log("Pseudo actuel dans Redux :", user.pseudo); // Vérifie que le pseudo est bien mis à jour
      setNewPseudo(user.pseudo || ''); // Utilise une chaîne vide si `user.pseudo` est `undefined`
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]); // Dépendance sur l'utilisateur

  const handleEditClick = () => {
    setIsEditing(true);
  }

  // ----------------------------------------------------- 
  // Gestion de l'annulation de l'édition
  // -----------------------------------------------------
  const handleCancel = () => {
    // Restaure les valeurs d'origine
    setNewPseudo(user.pseudo || '');
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setIsEditing(false); // Sort du mode édition pour afficher "Welcome back"
  };

  // ----------------------------------------------------- 
  // Gestion de la confirmation de la mise à jour
  // -----------------------------------------------------
  const handleConfirm = async () => {
    try {
      // Envoie une requête PUT pour mettre à jour le pseudo
      const response = await axios.put('http://localhost:3001/api/v1/user/profile', {
        userName: newPseudo
      }, {
        headers: {
          Authorization: `Bearer ${user.token}` // Ajoute le token d'authentification
        }
      });

      if (response.status === 200) {
        dispatch(updatePseudo(newPseudo)); // Met à jour le pseudo dans Redux
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du pseudonyme :", error);
    }
  };

  // ----------------------------------------------------- 
  // Rendu du composant
  // -----------------------------------------------------
  return (
    <div>
      <Nav/> {/* Affiche la barre de navigation */}
      <main className="main">
        <div className="header">
          {!isEditing && (
            <h1>Welcome back, <br />{user.firstName} {user.lastName}!</h1>
          )}
          {!isEditing ? (
            <>
              <button className='edit-button' onClick={handleEditClick}>Edit Name</button>
            </>
          ) : (
          <div>
            <h2>Edit user info</h2>
            <form>
              <div>
                <label>
                  User name:
                  <input
                    type="text"
                    value={newPseudo}
                    onChange={(e) => setNewPseudo(e.target.value)} // Met à jour le pseudo lors de la saisie
                  />
                </label>
              </div>
              <div>
                <label>
                  First Name:
                  <input
                    type="text"
                    value={firstName}
                    disabled // Champ désactivé pour le prénom
                    style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} // Style pour indiquer qu'il est désactivé
                  />
                </label>
              </div>
              <div>
                <label>
                  Last Name:
                  <input
                    type="text"
                    value={lastName}
                    disabled // Champ désactivé pour le nom de famille
                    style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} // Style pour indiquer qu'il est désactivé
                  />
                </label>
              </div>
              <div>
                <button type="button" className='edit-button' onClick={handleCancel}>Cancel</button> {/* Bouton d'annulation */}
                <button type="button" className='edit-button' onClick={handleConfirm}>Confirm</button> {/* Bouton de confirmation */}
              </div>
            </form>
          </div>
          )}
        </div>
        
        {/* Utilisation du composant Account avec des props spécifiques */}
        <Account
          title="Argent Bank Checking (x3448)"
          amount="$48,098.43"
          description="Available Balance"
        />
        <Account
          title="Argent Bank Savings (x3448)"
          amount="$48,098.43"
          description="Available Balance"
        />
        <Account
          title="Argent Bank Credit Card (x3448)"
          amount="$48,098.43"
          description="Current Balance"
        />
      </main>
      <Footer/> {/* Affiche le pied de page */}
    </div>
  );
}

export default UserPage; // Exportation du composant UserPage
