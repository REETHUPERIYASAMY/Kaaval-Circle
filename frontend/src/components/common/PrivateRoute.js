// src/components/common/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './PrivateRoute.css';

const PrivateRoute = ({ children, userType }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="private-route-loading">
        <div className="loading-spinner"></div>
        <p>Authentication in progress...</p>
      </div>
    );
  }

  // If not logged in, redirect to landing page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Check if user type matches route
  if (userType && user?.userType !== userType) {
    return (
      <div className="private-route-unauthorized">
        <div className="unauthorized-icon">🚫</div>
        <h2>Unauthorized Access</h2>
        <p>You don't have permission to access this page.</p>
        <button 
          className="back-button"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
