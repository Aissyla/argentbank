import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, getUserProfile } from './api';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const loginData = await loginUser(username, password);
      localStorage.setItem('token', loginData.token);
      const userProfile = await getUserProfile(loginData.token);
      
      return { 
        token: loginData.token, 
        username: userProfile.email || 'Unknown',
        pseudo: userProfile.userName || 'Unknown',
        firstName: userProfile.firstName || 'Unknown',
        lastName: userProfile.lastName || 'Unknown'
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error); // Affichage dans la console
      let errorMessage = 'Identifiant ou mot de passe incorrect';
      
      if (error.response && error.response.status === 400) {
        errorMessage = 'Identifiant ou mot de passe incorrect'; // Message personnalisé pour les erreurs 400
      }
    
      return thunkAPI.rejectWithValue(errorMessage); // On retourne l'erreur au reducer
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    updatePseudo: (state, action) => {
      if (state.user) {
        state.user.pseudo = action.payload;
      }
    },
    clearError: (state) => { // Nouvelle action pour réinitialiser l'erreur
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null; // Effacer l'erreur si la connexion réussit
    })
    .addCase(login.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload; // Enregistrer le message d'erreur retourné par rejectWithValue
    });
  },
});

export const { logout, updatePseudo, clearError } = authSlice.actions;
export default authSlice.reducer;