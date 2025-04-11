import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import { useNavigate } from 'react-router-dom';

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
      localStorage.setItem('token', token); // Save token to localStorage
      setToken(token); // Save token in the parent component (or local storage)
      navigate('/dashboard');
      alert('Login successful');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert('Error logging in: ' + err.response.data.message);
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link> {/* Link to signup */}
      </p>
    </div>
  );
}

export default Login;
