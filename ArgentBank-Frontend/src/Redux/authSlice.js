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
      console.error('Erreur lors de la connexion:', error);
      return thunkAPI.rejectWithValue('Invalid credentials or network error');
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
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    });
  },
});

export const { logout, updatePseudo } = authSlice.actions;
export default authSlice.reducer;