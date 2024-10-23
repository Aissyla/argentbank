// ----------------------------------------------------- 
// Importation des fonctions nécessaires pour créer des slices Redux
// -----------------------------------------------------
// On importe createSlice et createAsyncThunk de Redux Toolkit pour créer des reducers et des actions asynchrones
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// On importe des fonctions API pour gérer la connexion et obtenir le profil utilisateur
import { loginUser, getUserProfile } from './api';

// -----------------------------------------------------
// Action asynchrone pour la connexion de l'utilisateur
// -----------------------------------------------------
// Cette action gère le processus de connexion de l'utilisateur
export const login = createAsyncThunk(
  'auth/login', // Type de l'action
  async ({ username, password }, thunkAPI) => { // Arguments de la fonction asynchrone
    try {
      // Appelle la fonction loginUser avec les identifiants fournis
      const loginData = await loginUser(username, password);
      // Stocke le token d'authentification dans le localStorage
      localStorage.setItem('token', loginData.token);
      // Récupère le profil de l'utilisateur avec le token
      const userProfile = await getUserProfile(loginData.token);
      
      // Retourne les données de l'utilisateur
      return { 
        token: loginData.token, // Token d'authentification
        username: userProfile.email || 'Unknown', // Adresse e-mail ou 'Unknown' si non disponible
        pseudo: userProfile.userName || 'Unknown', // Pseudo ou 'Unknown' si non disponible
        firstName: userProfile.firstName || 'Unknown', // Prénom ou 'Unknown' si non disponible
        lastName: userProfile.lastName || 'Unknown' // Nom de famille ou 'Unknown' si non disponible
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error); // Affiche l'erreur dans la console
      let errorMessage = 'Identifiant ou mot de passe incorrect'; // Message d'erreur par défaut
      
      // Si l'erreur est une erreur 400, on retourne le même message d'erreur
      if (error.response && error.response.status === 400) {
        errorMessage = 'Identifiant ou mot de passe incorrect';
      }
    
      // Rejette la promesse avec le message d'erreur
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// -----------------------------------------------------
// Action asynchrone pour vérifier l'état d'authentification
// -----------------------------------------------------
// Cette action vérifie si l'utilisateur est déjà connecté
export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState', // Type de l'action
  async (_, thunkAPI) => { // Pas d'arguments requis
    const token = localStorage.getItem('token'); // Récupère le token du localStorage
    console.log('Token récupéré:', token); // Affiche le token dans la console

    if (token) { // Si un token est trouvé
      try {
        // Récupère le profil de l'utilisateur avec le token
        const userProfile = await getUserProfile(token);
        console.log('Profil utilisateur récupéré:', userProfile); // Affiche le profil dans la console

        // Retourne les données de l'utilisateur
        return {
          token,
          username: userProfile.email || 'Unknown',
          pseudo: userProfile.userName || 'Unknown',
          firstName: userProfile.firstName || 'Unknown',
          lastName: userProfile.lastName || 'Unknown'
        };
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error); // Affiche l'erreur dans la console
        localStorage.removeItem('token'); // Supprime le token du localStorage si une erreur se produit
        return thunkAPI.rejectWithValue('Session expired'); // Rejette la promesse avec un message d'erreur
      }
    }

    console.log('Aucun token trouvé'); // Si aucun token n'est trouvé
    return thunkAPI.rejectWithValue('No token found'); // Rejette la promesse avec un message d'erreur
  }
);

// -----------------------------------------------------
// Action asynchrone pour déconnecter l'utilisateur
// -----------------------------------------------------
// Cette action gère le processus de déconnexion de l'utilisateur
export const logout = createAsyncThunk(
  'auth/logout', // Type de l'action
  async (_, thunkAPI) => { // Pas d'arguments requis
    const rememberMe = localStorage.getItem('rememberMe') === 'true'; // Vérifie si l'option "se souvenir de moi" est activée
    // Nettoie le stockage approprié en fonction de l'option
    if (rememberMe) {
      localStorage.removeItem('token'); // Supprime le token du localStorage
    } else {
      sessionStorage.removeItem('token'); // Supprime le token du sessionStorage
    }
    // Supprime l'état "Remember Me"
    localStorage.removeItem('rememberMe');
    return null; // Retourne null après la déconnexion
  }
);

// -----------------------------------------------------
// Création du slice pour l'authentification
// -----------------------------------------------------
// Un slice est un ensemble de reducers et d'actions associés à une partie de l'état
const authSlice = createSlice({
  name: 'auth', // Nom du slice
  initialState: { // État initial de l'authentification
    isAuthenticated: false, // Indique si l'utilisateur est connecté
    user: null, // Données de l'utilisateur (null si non connecté)
    error: null, // Stocke les messages d'erreur (null par défaut)
  },
  reducers: {
    // Reducer pour déconnecter l'utilisateur
    logout: (state) => {
      state.isAuthenticated = false; // Met à jour l'état d'authentification
      state.user = null; // Réinitialise les données de l'utilisateur
      state.error = null; // Réinitialise les erreurs
    },
    // Reducer pour mettre à jour le pseudo de l'utilisateur
    updatePseudo: (state, action) => {
      if (state.user) {
        state.user.pseudo = action.payload; // Met à jour le pseudo avec la nouvelle valeur
      }
    },
    // Reducer pour effacer les messages d'erreur
    clearError: (state) => {
      state.error = null; // Réinitialise les erreurs
    },
  },
  // -----------------------------------------------------
  // Gestion des actions asynchrones avec les reducers supplémentaires
  // -----------------------------------------------------
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => { // Lorsque la connexion réussit
        state.isAuthenticated = true; // Met à jour l'état d'authentification
        state.user = action.payload; // Met à jour les données de l'utilisateur avec celles retournées
        state.error = null; // Réinitialise les erreurs
      })
      .addCase(login.rejected, (state, action) => { // Lorsque la connexion échoue
        state.isAuthenticated = false; // Met à jour l'état d'authentification
        state.user = null; // Réinitialise les données de l'utilisateur
        state.error = action.payload; // Enregistre le message d'erreur
      })
      .addCase(checkAuthState.fulfilled, (state, action) => { // Lorsque l'état d'authentification est vérifié avec succès
        state.isAuthenticated = true; // Met à jour l'état d'authentification
        state.user = action.payload; // Met à jour les données de l'utilisateur
        state.error = null; // Réinitialise les erreurs
      })
      .addCase(checkAuthState.rejected, (state, action) => { // Lorsque la vérification échoue
        state.isAuthenticated = false; // Met à jour l'état d'authentification
        state.user = null; // Réinitialise les données de l'utilisateur
        state.error = action.payload; // Enregistre le message d'erreur
      })
      .addCase(logout.fulfilled, (state) => { // Lorsque la déconnexion réussit
        state.isAuthenticated = false; // Met à jour l'état d'authentification
        state.user = null; // Réinitialise les données de l'utilisateur
        state.error = null; // Réinitialise les erreurs
      });
  },
});

// -----------------------------------------------------
// Export des actions et du reducer
// -----------------------------------------------------
// On exporte les actions et le reducer pour pouvoir les utiliser dans d'autres parties de l'application
export const { logout: logoutAction, updatePseudo, clearError } = authSlice.actions; // On renomme l'action de déconnexion pour éviter les conflits
export default authSlice.reducer; // On exporte le reducer par défaut pour l'utiliser dans le store