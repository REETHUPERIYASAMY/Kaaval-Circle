// src/components/auth/PoliceRegister.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './PoliceRegister.css';

const PoliceRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    stationName: '',
    batchNo: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    aadharNo: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { 
    name, 
    stationName, 
    batchNo, 
    email, 
    phone, 
    address, 
    age, 
    aadharNo, 
    gender, 
    password, 
    confirmPassword 
  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    const result = await register({
      name,
      stationName,
      batchNo,
      email,
      phone,
      address,
      age: parseInt(age),
      aadharNo,
      gender,
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
    <div className="police-register-container">
      <div className="police-register-form">
        <h2 className="police-register-title">Police Registration</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="stationName">Station Name</label>
            <input
              type="text"
              id="stationName"
              name="stationName"
              value={stationName}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="batchNo">Batch Number</label>
            <input
              type="text"
              id="batchNo"
              name="batchNo"
              value={batchNo}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={address}
              onChange={onChange}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={age}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="aadharNo">Aadhar Number</label>
            <input
              type="text"
              id="aadharNo"
              name="aadharNo"
              value={aadharNo}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={onChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </div>
          
          <button type="submit" className="police-register-button">Register</button>
        </form>
        
        <div className="police-register-login">
          <p>Already have an account? <Link to="/police-login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PoliceRegister;