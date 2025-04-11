import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Import Google Login
import {jwtDecode} from 'jwt-decode'; // Decode Google JWT
import './App.css';

interface LoginProps {
  setToken: (token: string) => void;
}

function Login({ setToken }: LoginProps) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5005/login', { userName, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/dashboard');
    } catch (err) {
      alert('Error logging in. Please check your credentials.');
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    const decoded: any = jwtDecode(credentialResponse.credential); // Decode Google JWT
    const googleToken = credentialResponse.credential;

    // Optionally, send the Google token to your backend for verification
    axios.post('http://localhost:5005/google-login', { token: googleToken })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        setToken(token);
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Google login failed:', err);
        alert('Google login failed. Please try again.');
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#003135]">
      {/* Add the welcome message */}
      <h1 className="text-4xl font-bold text-[#AFDDE5] mb-6">Welcome to Task Manager</h1>
      
      <div className="w-full max-w-md p-8 bg-[#AFDDE5] rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[#024950]">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#024950]">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-[#024950] rounded-lg focus:outline-none focus:ring focus:ring-[#0FA4AF]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#024950]">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-[#024950] rounded-lg focus:outline-none focus:ring focus:ring-[#0FA4AF]"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-gray-900 bg-[#0FA4AF] rounded-lg hover:bg-[#024950] focus:outline-none focus:ring focus:ring-[#0FA4AF]"
          >
            Login
          </button>
        </form>
        <div className="mt-6">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              alert('Google login failed. Please try again.');
            }}
          />
        </div>
        <p className="mt-4 text-sm text-center text-[#024950]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#964734] hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
