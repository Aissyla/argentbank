import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { createTransform } from 'redux-persist';
import authReducer from './authSlice';

const setTransform = createTransform(
  // Transformation entrante (avant stockage)
  (inboundState, key) => {
    if (key === 'auth') {
      return {
        ...inboundState,
        isAuthenticated: Boolean(inboundState.isAuthenticated)
      };
    }
    return inboundState;
  },
  // Transformation sortante (après restauration)
  (outboundState, key) => {
    if (key === 'auth') {
      return {
        ...outboundState,
        isAuthenticated: Boolean(outboundState.isAuthenticated)
      };
    }
    return outboundState;
  },
  // Spécifiez que cette transformation ne s'applique qu'au reducer 'auth'
  { whitelist: ['auth'] }
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Assurez-vous que seul 'auth' est dans la whitelist
  transforms: [setTransform]
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export const persistor = persistStore(store);