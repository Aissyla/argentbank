// ----------------------------------------------------- 
// Importation de la bibliothèque Axios pour les requêtes HTTP
// -----------------------------------------------------
// Axios est une bibliothèque pour effectuer des requêtes HTTP dans les applications JavaScript
import axios from 'axios';

// -----------------------------------------------------
// URL de base de l'API
// -----------------------------------------------------
// Définit l'URL de base pour les requêtes API
export const API_URL = 'http://localhost:3001/api/v1';

// -----------------------------------------------------
// Fonction pour connecter un utilisateur
// -----------------------------------------------------
// Cette fonction envoie une requête POST pour connecter un utilisateur
export const loginUser = async (email, password) => {
  // Envoie la requête POST avec l'e-mail et le mot de passe fournis
  const response = await axios.post(`${API_URL}/user/login`, { email, password });
  // Retourne le corps de la réponse, qui contient les données de connexion
  return response.data.body;
};

// -----------------------------------------------------
// Fonction pour obtenir le profil de l'utilisateur
// -----------------------------------------------------
// Cette fonction envoie une requête GET pour récupérer le profil de l'utilisateur
export const getUserProfile = async (token) => {
  // Envoie la requête GET avec le token d'authentification dans les en-têtes
  const response = await axios.get(`${API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` } // Ajoute le token dans les en-têtes pour l'authentification
  });
  // Retourne le corps de la réponse, qui contient les données du profil utilisateur
  return response.data.body;
};
