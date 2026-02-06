import React, { useState, useEffect } from 'react';

import { CurrencyProvider } from './context/CurrencyContext.jsx';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Reports from './pages/Reports';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (authData) => {
    localStorage.setItem('token', authData.access_token);
    localStorage.setItem('user', JSON.stringify({ name: authData.username, email: authData.email, role: "User" }));
    setUser({
      name: authData.username,
      email: authData.email,
      role: "User"
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (

    <CurrencyProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <Layout user={user} onLogout={handleLogout}><Dashboard /></Layout> : <Navigate to="/login" />} />
          <Route path="/reports" element={isAuthenticated ? <Layout user={user} onLogout={handleLogout}><Reports /></Layout> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </CurrencyProvider>
  );
};

export default App;
