// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password, role });
      const { token, user } = response.data;
      console.log(response);
      // Store token in localStorage
      localStorage.setItem('token', token);

      // Navigate to role-specific dashboard and pass user info as state
      navigate(`/${role.toLowerCase()}`, { state: { user ,role } });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div>
          <label>
            <input
              type="radio"
              value="Student"
              checked={role === 'Student'}
              onChange={(e) => setRole(e.target.value)}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              value="Teacher"
              checked={role === 'Teacher'}
              onChange={(e) => setRole(e.target.value)}
            />
            Teacher
          </label>
          <label>
            <input
              type="radio"
              value="Admin"
              checked={role === 'Admin'}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
