// src/components/police/PoliceDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';
import './PoliceDashboard.css';

const PoliceDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    activeSOS: 0,
    pendingComplaints: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="police-dashboard-container">
      <h1 className="dashboard-title">Police Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3 className="stat-title">Total Complaints</h3>
          <p className="stat-value">{stats.totalComplaints}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Active SOS</h3>
          <p className="stat-value">{stats.activeSOS}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Pending Complaints</h3>
          <p className="stat-value">{stats.pendingComplaints}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Avg. Response Time</h3>
          <p className="stat-value">{stats.avgResponseTime}h</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/manage-complaints" className="action-button">
            Manage Complaints
          </Link>
          <Link to="/sos-alerts" className="action-button sos-button">
            SOS Alerts
          </Link>
          <Link to="/analytics" className="action-button">
            Analytics
          </Link>
          <Link to="/police-profile" className="action-button">
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
      
      <div className="dashboard-sos">
        <h2 className="section-title">Active SOS Alerts</h2>
        <div className="sos-list">
          <p>No active SOS alerts at this time.</p>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;