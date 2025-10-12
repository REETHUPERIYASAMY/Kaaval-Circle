// src/components/police/CaseUpdates.js
import React, { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus } from '../../services/api';
import './CaseUpdates.css';

const CaseUpdates = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getComplaints();
        if (response.success) {
          setComplaints(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch complaints', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'In Progress':
        return 'info';
      case 'Closed':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleUpdateCase = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNotes('');
    setDialogOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedComplaint || !newStatus) return;
    
    setUpdating(true);
    
    try {
      const response = await updateComplaintStatus(selectedComplaint._id, newStatus);
      if (response.success) {
        // Update the local state
        setComplaints(complaints.map(c => 
          c._id === selectedComplaint._id ? response.data : c
        ));
        setDialogOpen(false);
      } else {
        alert('Failed to update case status');
      }
    } catch (err) {
      alert('Failed to update case status');
    }
    
    setUpdating(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div className="case-updates-container">
      <h1 className="case-updates-title">Case Updates</h1>
      
      {loading ? (
        <div className="loading">Loading cases...</div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <p>No cases found</p>
        </div>
      ) : (
        <div className="cases-table-container">
          <table className="cases-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Citizen</th>
                <th>Category</th>
                <th>Description</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>{complaint._id.substring(0, 8)}</td>
                  <td>{complaint.citizenId?.name || 'Unknown'}</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.description.substring(0, 50)}...</td>
                  <td>{complaint.assignedTo?.name || 'Unassigned'}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>{new Date(complaint.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="update-button"
                      onClick={() => handleUpdateCase(complaint)}
                    >
                      Update Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {dialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3 className="dialog-title">Update Case</h3>
            {selectedComplaint && (
              <div className="dialog-body">
                <p><strong>Case ID:</strong> {selectedComplaint._id}</p>
                <p><strong>Category:</strong> {selectedComplaint.category}</p>
                <p><strong>Description:</strong> {selectedComplaint.description}</p>
                
                <div className="status-options">
                  <label>Update Status:</label>
                  <div className="status-buttons">
                    <button
                      className={`status-button ${newStatus === 'Pending' ? 'active' : ''}`}
                      onClick={() => setNewStatus('Pending')}
                    >
                      Pending
                    </button>
                    <button
                      className={`status-button ${newStatus === 'In Progress' ? 'active' : ''}`}
                      onClick={() => setNewStatus('In Progress')}
                    >
                      In Progress
                    </button>
                    <button
                      className={`status-button ${newStatus === 'Closed' ? 'active' : ''}`}
                      onClick={() => setNewStatus('Closed')}
                    >
                      Closed
                    </button>
                  </div>
                </div>
                
                <div className="notes-section">
                  <label htmlFor="notes">Case Notes:</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Add notes about the case update..."
                  ></textarea>
                </div>
              </div>
            )}
            
            <div className="dialog-actions">
              <button className="cancel-button" onClick={handleCloseDialog}>
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={handleConfirmUpdate}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Case'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseUpdates;