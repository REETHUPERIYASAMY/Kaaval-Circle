// src/components/common/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">KaavalCircle</h1>
        <p className="landing-subtitle">From Citizen For Citizen With Police</p>
        <div className="landing-buttons">
          <Link to="/citizen-register" className="landing-button citizen-button">
            Citizen
          </Link>
          <Link to="/police-register" className="landing-button police-button">
            Police
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;