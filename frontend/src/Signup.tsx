import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup({ setToken }: { setToken: (token: string) => void }) {
  const [name, setName] = useState(''); // Add state for name
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5005/signup', { name, userName, password }); // Include name
      const response = await axios.post('http://localhost:5005/login', { userName, password }); // Log in the user
      const token = response.data.token;
      localStorage.setItem('token', token); // Save token to localStorage
      setToken(token); // Set token in parent component
      navigate('/dashboard'); // Redirect to dashboard
      alert('Signup successful');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert('Error signing up: ' + err.response.data.message);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Handle name input
          required
        />
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
