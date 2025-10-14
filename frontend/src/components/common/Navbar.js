// src/components/common/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  // 🧠 Prevent crash if user is null during loading
  if (!isAuthenticated || !user) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            KaavalCircle
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to={user.userType === 'citizen' ? '/citizen-dashboard' : '/police-dashboard'}
          className="navbar-logo"
        >
          KaavalCircle
        </Link>

        <div className="navbar-menu">
          {user.userType === 'citizen' && (
            <>
              <Link to="/citizen-dashboard" className="navbar-link">
                Dashboard
              </Link>
              <Link to="/report-crime" className="navbar-link">
                Report Crime
              </Link>
              <Link to="/sos" className="navbar-link">
                SOS
              </Link>
              <Link to="/complaint-status" className="navbar-link">
                Complaint Status
              </Link>
            </>
          )}

          {user.userType === 'police' && (
            <>
              <Link to="/police-dashboard" className="navbar-link">
                Dashboard
              </Link>
              <Link to="/manage-complaints" className="navbar-link">
                Manage Complaints
              </Link>
              <Link to="/sos-alerts" className="navbar-link">
                SOS Alerts
              </Link>
              <Link to="/analytics" className="navbar-link">
                Analytics
              </Link>
            </>
          )}

          <div className="navbar-profile">
            <span className="navbar-username">{user?.name || 'User'}</span>
            <button onClick={handleLogout} className="navbar-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
