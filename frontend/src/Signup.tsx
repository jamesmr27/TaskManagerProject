import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Signup({ setToken }: { setToken: (token: string) => void }) {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5005/signup', { name, userName, password });
      const response = await axios.post('http://localhost:5005/login', { userName, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/dashboard');
    } catch (err) {
      alert('Error signing up. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#003135]">
      <div className="w-full max-w-md p-8 bg-[#AFDDE5] rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[#024950]">Sign Up</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#024950]">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-[#024950] rounded-lg focus:outline-none focus:ring focus:ring-[#0FA4AF]"
            />
          </div>
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
