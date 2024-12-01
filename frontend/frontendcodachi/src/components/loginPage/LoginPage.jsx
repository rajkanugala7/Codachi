// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';

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
      const response = await axios.post('https://codachi-1.onrender.com/api/auth/login', { email, password, role });
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
    <div className='loginpage'>
      <Navbar/>
      <div className="form">
      <div className="image col-5">
        <img src="https://www.tayyari.in/_next/static/media/log-in.65f09c14.svg" alt=""  />
        </div>
      <div className='formdiv col-5'>
      
          <h2 style={{ marginLeft: "10px", padding: "10px" ,textAlign:"center"}} >Login </h2>
          <hr />
          <br />
      <form onSubmit={handleSubmit} className='col-9'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            required
            className='form-control'
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
            required
            className='form-control'
        />
<div className="form-group">
  <div className="form-check">
    <input
      type="radio"
      value="Student"
      checked={role === 'Student'}
      onChange={(e) => setRole(e.target.value)}
      className="form-check-input"
      id="roleStudent"
    />
    <label className="form-check-label" htmlFor="roleStudent">
      Student
    </label>
  </div>

  <div className="form-check">
    <input
      type="radio"
      value="Teacher"
      checked={role === 'Teacher'}
      onChange={(e) => setRole(e.target.value)}
      className="form-check-input"
      id="roleTeacher"
    />
    <label className="form-check-label" htmlFor="roleTeacher">
      Teacher
    </label>
  </div>

  <div className="form-check">
    <input
      type="radio"
      value="Admin"
      checked={role === 'Admin'}
      onChange={(e) => setRole(e.target.value)}
      className="form-check-input"
      id="roleAdmin"
    />
    <label className="form-check-label" htmlFor="roleAdmin">
      Admin
    </label>
  </div>
</div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" className='  loginbtn'>Login</button>
      </form>
        </div>
        </div>
    </div>
  );
};

export default Login;
