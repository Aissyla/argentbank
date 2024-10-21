import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import UserPage  from './pages/UserPage';
import Error from './pages/Error';
import './index.css';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Navigate replace to="/HomePage" />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/SignUp" element={<SignUp />} /> 
            <Route path="/UserPage" element={<UserPage />} />
            <Route path='*' element={<Error />} />
        </Routes>
    </Router>
  );
}

export default App;