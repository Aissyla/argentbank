import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updatePseudo } from '../Redux/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../index.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import axios from 'axios'; // pour faire des requêtes HTTP

function UserPage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  // Initialise les états avec des valeurs par défaut
  const [newPseudo, setNewPseudo] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    // Vérifie si l'utilisateur est authentifié
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
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Met à jour les valeurs si l'utilisateur change
    if (user) {
      console.log("Pseudo actuel dans Redux :", user.pseudo); // Vérifie que le pseudo est bien mis à jour
      setNewPseudo(user.pseudo || ''); // Utilise une chaîne vide si `user.pseudo` est `undefined`
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleCancel = () => {
    // Restaure les valeurs d'origine
    setNewPseudo(user.pseudo || '');
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.put('http://localhost:3001/api/v1/user/profile', {
        userName: newPseudo
      }, {
        headers: {
          Authorization: `Bearer ${user.token}` // Ajoute le token d'authentification
        }
      });

      if (response.status === 200) {
        dispatch(updatePseudo(newPseudo)); // Met à jour le pseudo dans Redux
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du pseudonyme :", error);
    }
  };

  return (
    <div>
      <Nav/>
      <main className="main">
        <div className="header">
          <h1>Edit user info</h1>
          <form>
            <div>
              <label>
                User name:
                <input
                  type="text"
                  value={newPseudo}
                  onChange={(e) => setNewPseudo(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                First Name:
                <input
                  type="text"
                  value={firstName}
                  disabled
                  style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                />
              </label>
            </div>
            <div>
              <label>
                Last Name:
                <input
                  type="text"
                  value={lastName}
                  disabled
                  style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                />
              </label>
            </div>
            <div>
              <button type="button" className='edit-button' onClick={handleCancel}>Cancel</button>
              <button type="button" className='edit-button' onClick={handleConfirm}>Confirm</button>
            </div>
          </form>
        </div>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Checking (x3448)</h3>
            <p className="account-amount">$48,098.43</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button"><FontAwesomeIcon icon={faChevronRight} /></button>
          </div>
        </section>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Savings (x3448)</h3>
            <p className="account-amount">$48,098.43</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button"><FontAwesomeIcon icon={faChevronRight} /></button>
          </div>
        </section>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Credit Card (x3448)</h3>
            <p className="account-amount">$48,098.43</p>
            <p className="account-amount-description">Current Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button"><FontAwesomeIcon icon={faChevronRight} /></button>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}

export default UserPage;
