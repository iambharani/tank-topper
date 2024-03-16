// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,Outlet  } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/DashboardPage';
import StationList from './pages/StationList';
import MapPage from './pages/MapPage'; // Assuming you have this page

import Layout from './components/Layout'; // Import the Layout component
import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  const user = useSelector(state => state.auth.user);
  const userFromLocalStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const currentUser = user || userFromLocalStorage;

  return (
    <div className="App">

    <Router>
      <Routes>
        <Route path="/" element={!currentUser ? <WelcomePage /> : currentUser.isActive ? <Navigate replace to="/stations" /> : <Navigate replace to="/dashboard" />} />
        {/* Wrap the rest of the routes with the Layout component */}
        <Route element={<Layout />}>
          <Route path="/login" element={currentUser ? <Navigate replace to={currentUser.isActive ? "/stations" : "/dashboard"} /> : <LoginPage />} />
          <Route path="/signup" element={currentUser ? <Navigate replace to={currentUser.isActive ? "/stations" : "/dashboard"} /> : <SignupPage />} />
          <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate replace to="/" />} />
          <Route path="/stations" element={currentUser && currentUser.isActive ? <StationList /> : <Navigate replace to="/dashboard" />} />
          <Route path="/map" element={currentUser && currentUser.isActive ? <MapPage /> : <Navigate replace to="/dashboard" />} />

        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
