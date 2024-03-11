import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/DashboardPage';
import StationList from './pages/StationList';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  const user = useSelector(state => state.auth.user);
  const userFromLocalStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // Check both Redux store and localStorage for user details
  const currentUser = user || userFromLocalStorage;

  return (
    <Router>
      <Routes>
        {/* No current user: Welcome Page. Logged in but isActive is false or undefined: Dashboard. Logged in and isActive is true: Stations. */}
        <Route path="/" element={!currentUser ? <WelcomePage /> : currentUser.isActive ? <Navigate replace to="/stations" /> : <Navigate replace to="/dashboard" />} />
        <Route path="/login" element={currentUser ? <Navigate replace to={currentUser.isActive ? "/stations" : "/dashboard"} /> : <LoginPage />} />
        <Route path="/signup" element={currentUser ? <Navigate replace to={currentUser.isActive ? "/stations" : "/dashboard"} /> : <SignupPage />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate replace to="/" />} />
        <Route path="/stations" element={currentUser && currentUser.isActive ? <StationList /> : <Navigate replace to="/dashboard" />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
