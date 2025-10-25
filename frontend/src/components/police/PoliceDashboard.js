import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComplaints } from '../../services/api';
import './PoliceDashboard.css';

const PoliceDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    activeSOS: 0,
    pendingComplaints: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getComplaints();
        if (response.success) {
          const complaints = response.data;
          
          // Calculate stats
          setStats({
            totalComplaints: complaints.length,
            activeSOS: 0, // Would need SOS API for real data
            pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
            avgResponseTime: 24 // Placeholder value
          });
          
          // Get recent complaints (last 5)
          const sortedComplaints = [...complaints].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentComplaints(sortedComplaints.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-progress';
      case 'Closed':
        return 'status-closed';
      default:
        return '';
    }
  };

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
          {recentComplaints.length > 0 ? (
            recentComplaints.map((complaint) => (
              <div key={complaint._id} className="recent-complaint">
                <div className="complaint-header">
                  <div className="complaint-id">ID: {complaint._id.substring(0, 8)}</div>
                  <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="complaint-category">{complaint.category}</div>
                <div className="complaint-citizen">
                  {complaint.citizenId?.name || 'Unknown Citizen'}
                </div>
                <div className="complaint-date">{formatDate(complaint.createdAt)}</div>
                <div className="complaint-location">{complaint.location.address}</div>
              </div>
            ))
          ) : (
            <p>No recent complaints to display.</p>
          )}
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