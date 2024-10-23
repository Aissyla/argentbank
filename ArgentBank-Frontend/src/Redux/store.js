// ----------------------------------------------------- 
// Importation des modules nécessaires pour Redux et la persistance
// -----------------------------------------------------
// On importe des fonctions de Redux Toolkit pour gérer l'état de l'application et la persistance des données
import { combineReducers, configureStore } from '@reduxjs/toolkit'; // Pour combiner les reducers (logique de gestion des données) et configurer le store (lieu de stockage de l'état)
import { persistReducer, persistStore } from 'redux-persist'; // Pour garder les données même après la fermeture de l'application
import storage from 'redux-persist/lib/storage'; // Utilisation de localStorage, qui permet de stocker des données de manière permanente dans le navigateur
import sessionStorage from 'redux-persist/lib/storage/session'; // Utilisation de sessionStorage, qui garde les données seulement pour la session en cours
import { createTransform } from 'redux-persist'; // Pour créer des transformations sur les données lors de leur sauvegarde ou de leur récupération
import authReducer from './authSlice'; // Importation du reducer qui gère l'authentification des utilisateurs

// -----------------------------------------------------
// Création d'un système de stockage dynamique basé sur l'option "remember me"
// -----------------------------------------------------
// Cette fonction crée un système de stockage qui choisit entre localStorage et sessionStorage selon le choix de l'utilisateur
const createCustomStorage = () => {
  return {
    // Récupération d'un élément du stockage
    getItem: (key) => {
      // Vérifie si l'utilisateur a activé l'option "se souvenir de moi"
      const useLocalStorage = localStorage.getItem('rememberMe') === 'true'; 
      return useLocalStorage
        ? localStorage.getItem(key) // Si oui, récupère l'élément depuis localStorage
        : sessionStorage.getItem(key); // Sinon, récupère depuis sessionStorage
    },
    // Enregistrement d'un élément dans le stockage
    setItem: (key, value) => {
      const useLocalStorage = localStorage.getItem('rememberMe') === 'true'; // Vérifie encore l'option choisie par l'utilisateur
      useLocalStorage
        ? localStorage.setItem(key, value) // Si "remember me" est activé, stocke dans localStorage
        : sessionStorage.setItem(key, value); // Sinon, stocke dans sessionStorage
    },
    // Suppression d'un élément du stockage
    removeItem: (key) => {
      const useLocalStorage = localStorage.getItem('rememberMe') === 'true'; // Vérifie l'option
      useLocalStorage
        ? localStorage.removeItem(key) // Supprime de localStorage
        : sessionStorage.removeItem(key); // Ou supprime de sessionStorage
    }
  };
};

// On crée une instance de notre système de stockage personnalisé
const customStorage = createCustomStorage(); // Appelle la fonction pour définir le stockage

// -----------------------------------------------------
// Définition des transformations pour la persistance des données d'authentification
// -----------------------------------------------------
// Ces transformations permettent de modifier les données avant de les sauvegarder et après les avoir récupérées
const setTransform = createTransform(
  // Transformation des données entrantes (avant qu'elles ne soient stockées)
  (inboundState, key) => {
    if (key === 'auth') { // Vérifie si on travaille avec le reducer d'authentification
      return {
        ...inboundState,
        isAuthenticated: Boolean(inboundState.isAuthenticated) // S'assure que la valeur est un vrai booléen (true ou false)
      };
    }
    return inboundState; // Si ce n'est pas 'auth', on retourne l'état tel quel
  },
  // Transformation des données sortantes (après les avoir récupérées)
  (outboundState, key) => {
    if (key === 'auth') { // Vérifie si on travaille avec le reducer d'authentification
      return {
        ...outboundState,
        isAuthenticated: Boolean(outboundState.isAuthenticated) // S'assure que la valeur est un vrai booléen
      };
    }
    return outboundState; // Si ce n'est pas 'auth', on retourne l'état tel quel
  },
  // Indique que cette transformation ne s'applique qu'au reducer 'auth'
  { whitelist: ['auth'] } // Liste blanche : seules les données d'authentification seront transformées
);

// -----------------------------------------------------
// Configuration de la persistance des données
// -----------------------------------------------------
// Cette configuration détermine comment les données seront stockées et ce qui sera inclus ou exclu
const persistConfig = {
  key: 'root', // Clé principale pour le stockage des données
  storage, // Utilise le stockage défini (ici localStorage)
  blacklist: ['error'], // Les erreurs ne seront pas sauvegardées
  whitelist: ['auth'], // Seules les données d'authentification seront sauvegardées
  transforms: [setTransform] // Applique les transformations définies plus haut
};

// -----------------------------------------------------
// Combinaison des reducers
// -----------------------------------------------------
// Ici, nous combinons tous les reducers, qui définissent comment chaque partie de l'état est gérée
const rootReducer = combineReducers({
  auth: authReducer, // On ajoute le reducer d'authentification
});

// -----------------------------------------------------
// Création du reducer persisté
// -----------------------------------------------------
// Ce reducer applique les configurations de persistance définies ci-dessus
const persistedReducer = persistReducer(persistConfig, rootReducer);

// -----------------------------------------------------
// Configuration du store Redux avec le reducer persisté et les middleware
// -----------------------------------------------------
// Le store est l'endroit où toutes les données de l'application sont stockées
export const store = configureStore({
  reducer: persistedReducer, // On utilise le reducer qui gère la persistance
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ // On configure les middleware pour le store
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'] // On ignore certaines actions pour éviter des erreurs de vérification
      }
    })
});

// -----------------------------------------------------
// Création de l'instance de persistance pour le store
// -----------------------------------------------------
// Cela permet de gérer la persistance et la restauration des données dans le store
export const persistor = persistStore(store); // On crée l'instance de persistance avec le store

