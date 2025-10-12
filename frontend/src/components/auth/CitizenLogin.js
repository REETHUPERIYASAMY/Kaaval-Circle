// src/components/auth/CitizenLogin.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './CitizenLogin.css';

const CitizenLogin = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { identifier, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    const result = await login({
      identifier,
      password,
      userType: 'citizen'
    });

    if (result.success) {
      navigate('/citizen-dashboard');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Citizen Login</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Name</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          
          <button type="submit" className="login-button">Login</button>
        </form>
        
        <div className="login-register">
          <p>Don't have an account? <Link to="/citizen-register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CitizenLogin;