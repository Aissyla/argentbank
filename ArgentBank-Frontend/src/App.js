import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Page d'accueil
import SignUp from './pages/SignUp'; // Page de connexion
import UserPage  from './pages/UserPage';
import './index.css';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Navigate replace to="/HomePage" />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/SignUp" element={<SignUp />} /> 
            <Route path="/UserPage" element={<UserPage />} /> 
        </Routes>
    </Router>
  );
}

export default App;