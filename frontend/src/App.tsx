import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup.tsx';
import TaskDashboard from './TaskDashboard';
import './App.css';


function App() {
  const [token, setToken] = React.useState<string | null>(null);

  const isAuthenticated = !!token;

  return (
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
  );
}
export default App;