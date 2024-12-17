import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Radio, RadioGroup, Stack, Spinner } from '@chakra-ui/react';
import Navbar from '../navbar/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading when the login process begins

    try {
      const response = await axios.post('https://codachi-1.onrender.com/api/auth/login', { email, password, role });
      const { token, user } = response.data;
      console.log(response);
      localStorage.setItem('token', token); // Store token
      navigate(`/${role.toLowerCase()}`, { state: { user, role } }); // Navigate to dashboard
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false); // Stop loading when the process is complete
    }
  };

  return (
    <div className="loginpage">
      <Navbar />
      <div className="form">
        <div className="image col-5">
          <img src="https://www.tayyari.in/_next/static/media/log-in.65f09c14.svg" alt="Login illustration" />
        </div>
        <div className="formdiv col-5">
          <h2 style={{ marginLeft: "10px", padding: "10px", textAlign: "center" }}>Login</h2>
          <hr />
          <br />
          <form onSubmit={handleSubmit} className="col-9">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
            <div className="form-group">
              <RadioGroup onChange={setRole} value={role}>
                <Stack direction="row">
                  <Radio value="Student">Student</Radio>
                  <Radio value="Teacher">Teacher</Radio>
                  <Radio value="Admin">Admin</Radio>
                </Stack>
              </RadioGroup>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Button
              type="submit"
              colorScheme="blue"
              size="md"
              width="100%"
              mt={4}
              isLoading={loading} // Chakra UI handles the spinner
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
