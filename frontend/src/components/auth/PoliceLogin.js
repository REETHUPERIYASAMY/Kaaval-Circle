// src/components/auth/PoliceLogin.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './PoliceLogin.css';

const PoliceLogin = () => {
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
      userType: 'police'
    });

    if (result.success) {
      navigate('/police-dashboard');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="police-login-container">
      <div className="police-login-form">
        <h2 className="police-login-title">Police Login</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Batch Number</label>
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
          
          <button type="submit" className="police-login-button">Login</button>
        </form>
        
        <div className="police-login-register">
          <p>Don't have an account? <Link to="/police-register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PoliceLogin;