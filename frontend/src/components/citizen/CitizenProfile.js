// src/components/citizen/CitizenProfile.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './CitizenProfile.css';

const CitizenProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-type">{user.userType === 'citizen' ? 'Citizen' : 'Police Officer'}</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{user.name}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Phone</div>
            <div className="detail-value">{user.phone}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Address</div>
            <div className="detail-value">{user.address}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Age</div>
            <div className="detail-value">{user.age}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Aadhar Number</div>
            <div className="detail-value">{user.aadharNo}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Gender</div>
            <div className="detail-value">{user.gender}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenProfile;