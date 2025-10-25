// src/components/police/PoliceProfile.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './PoliceProfile.css';

const PoliceProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <h1 className="profile-title">Police Profile</h1>
      
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
            <p className="profile-type">Police Officer</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{user.name}</div>
          </div>


          <div className="detail-row">
            <div className="detail-label">Station</div>
            <div className="detail-value">{user.stationName}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Phone</div>
            <div className="detail-value">{user.phone}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Email</div>
            <div className="detail-value">{user.email}</div>
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

export default PoliceProfile;
