import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import Google OAuth Provider
import Login from './Login';
import Signup from './Signup';
import TaskDashboard from './TaskDashboard';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(null);

  const isAuthenticated = !!token;

  return (
    <GoogleOAuthProvider clientId="823097345146-785ql6huf8qaf0i9jjolh12uqqjda3m5.apps.googleusercontent.com"> {/* Replace with your Client ID */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <TaskDashboard setToken={setToken} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;