// src/components/citizen/ComplaintStatus.js
import React, { useState, useEffect } from 'react';
import { getComplaints } from '../../services/api';
import './ComplaintStatus.css';

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getComplaints();
        if (response.success) {
          setComplaints(response.data);
        } else {
          setError('Failed to fetch complaints');
        }
      } catch (err) {
        setError('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="complaint-status-container">
      <h1 className="complaint-status-title">Complaint Status</h1>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading complaints...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-container">
          <p>No complaints found</p>
          <p>You haven't filed any complaints yet.</p>
        </div>
      ) : (
        <div className="complaint-list">
          <div className="complaint-list-header">
            <div className="header-cell">ID</div>
            <div className="header-cell">Category</div>
            <div className="header-cell">Description</div>
            <div className="header-cell">Date</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Assigned To</div>
          </div>
          
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-item">
              <div className="complaint-cell complaint-id">
                {complaint._id.substring(0, 8)}
              </div>
              <div className="complaint-cell complaint-category">
                {complaint.category}
              </div>
              <div className="complaint-cell complaint-description">
                {complaint.description.substring(0, 50)}...
              </div>
              <div className="complaint-cell complaint-date">
                {formatDate(complaint.createdAt)}
              </div>
              <div className="complaint-cell complaint-status">
                <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <div className="complaint-cell complaint-assigned">
                {complaint.assignedTo 
                  ? `${complaint.assignedTo.name} (${complaint.assignedTo.stationName})` 
                  : 'Not assigned'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintStatus;