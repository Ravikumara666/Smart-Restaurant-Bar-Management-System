import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './components/LoginPage';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('adminToken') !== null;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated() ? <LoginPage /> : <Navigate to="/admin" />} 
          />
          <Route 
            path="/admin" 
            element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated() ? "/admin" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;