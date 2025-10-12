// src/components/citizen/CitizenDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CitizenDashboard.css';

const CitizenDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0
  });

  useEffect(() => {
    // Simulate fetching data
    // In a real app, this would be an API call
    setStats({
      totalComplaints: 5,
      pendingComplaints: 2,
      inProgressComplaints: 2,
      resolvedComplaints: 1
    });
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Citizen Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3 className="stat-title">Total Complaints</h3>
          <p className="stat-value">{stats.totalComplaints}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Pending</h3>
          <p className="stat-value">{stats.pendingComplaints}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">In Progress</h3>
          <p className="stat-value">{stats.inProgressComplaints}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Resolved</h3>
          <p className="stat-value">{stats.resolvedComplaints}</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/report-crime" className="action-button">
            Report Crime
          </Link>
          <Link to="/sos" className="action-button sos-button">
            Emergency SOS
          </Link>
          <Link to="/complaint-status" className="action-button">
            Complaint Status
          </Link>
          <Link to="/citizen-profile" className="action-button">
            My Profile
          </Link>
        </div>
      </div>
      
      <div className="dashboard-recent">
        <h2 className="section-title">Recent Complaints</h2>
        <div className="complaint-list">
          <p>No recent complaints to display.</p>
        </div>
      </div>
      
      <div className="dashboard-tips">
        <h2 className="section-title">Crime Prevention Tips</h2>
        <ul className="tips-list">
          <li>Always be aware of your surroundings, especially in crowded areas.</li>
          <li>Keep your valuables secure and out of sight.</li>
          <li>Install security cameras and good lighting around your property.</li>
          <li>Get to know your neighbors and establish a neighborhood watch.</li>
          <li>Report suspicious activities to the police immediately.</li>
        </ul>
      </div>
    </div>
  );
};

export default CitizenDashboard;