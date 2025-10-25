import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComplaints } from '../../services/api';
import './CitizenDashboard.css';

const CitizenDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0
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
            pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
            inProgressComplaints: complaints.filter(c => c.status === 'In Progress').length,
            resolvedComplaints: complaints.filter(c => c.status === 'Closed').length
          });
          
          // Get recent complaints (last 3)
          const sortedComplaints = [...complaints].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentComplaints(sortedComplaints.slice(0, 3));
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
                <div className="complaint-date">{formatDate(complaint.createdAt)}</div>
                <div className="complaint-location">{complaint.location.address}</div>
              </div>
            ))
          ) : (
            <p>No recent complaints to display.</p>
          )}
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