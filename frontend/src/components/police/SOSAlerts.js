// src/components/police/SOSAlerts.js
import React, { useState, useEffect } from 'react';
import { getSOSAlerts, updateSOSStatus } from '../../services/api';
import './SOSAlerts.css';

const SOSAlerts = () => {
  const [sosAlerts, setSOSAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSOSAlerts = async () => {
      try {
        const response = await getSOSAlerts();
        if (response.success) {
          setSOSAlerts(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch SOS alerts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSOSAlerts();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'error';
      case 'Responding':
        return 'warning';
      case 'Resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleViewMap = (alert) => {
    setSelectedAlert(alert);
    setMapDialogOpen(true);
  };

  const handleUpdateStatus = (alert) => {
    setSelectedAlert(alert);
    setNewStatus(alert.status);
    setStatusDialogOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedAlert || !newStatus) return;
    
    setUpdating(true);
    
    try {
      const response = await updateSOSStatus(selectedAlert._id, newStatus);
      if (response.success) {
        // Update the local state
        setSOSAlerts(sosAlerts.map(a => 
          a._id === selectedAlert._id ? response.data : a
        ));
        setStatusDialogOpen(false);
      } else {
        alert('Failed to update SOS status');
      }
    } catch (err) {
      alert('Failed to update SOS status');
    }
    
    setUpdating(false);
  };

  const handleCloseMapDialog = () => {
    setMapDialogOpen(false);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  return (
    <div className="sos-alerts-container">
      <h1 className="sos-alerts-title">SOS Alerts</h1>
      
      {loading ? (
        <div className="loading">Loading SOS alerts...</div>
      ) : sosAlerts.length === 0 ? (
        <div className="empty-state">
          <p>No SOS alerts found</p>
        </div>
      ) : (
        <div className="sos-alerts-table-container">
          <table className="sos-alerts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Citizen</th>
                <th>Location</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sosAlerts.map((alert) => (
                <tr key={alert._id}>
                  <td>{alert._id.substring(0, 8)}</td>
                  <td>{alert.citizenId?.name || 'Unknown'}</td>
                  <td>{alert.location?.address || 'Unknown'}</td>
                  <td>{new Date(alert.createdAt).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-map-button"
                      onClick={() => handleViewMap(alert)}
                    >
                      View Map
                    </button>
                    <button
                      className="update-button"
                      onClick={() => handleUpdateStatus(alert)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Map Dialog */}
      {mapDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3 className="dialog-title">SOS Location</h3>
            {selectedAlert && (
              <div className="dialog-body">
                <div className="map-placeholder">
                  <p>Map would be displayed here</p>
                  <p>Location: {selectedAlert.location?.address || 'Unknown'}</p>
                </div>
              </div>
            )}
            
            <div className="dialog-actions">
              <button className="cancel-button" onClick={handleCloseMapDialog}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Status Update Dialog */}
      {statusDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3 className="dialog-title">Update SOS Status</h3>
            {selectedAlert && (
              <div className="dialog-body">
                <p><strong>Alert ID:</strong> {selectedAlert._id}</p>
                <p><strong>Citizen:</strong> {selectedAlert.citizenId?.name || 'Unknown'}</p>
                <p><strong>Location:</strong> {selectedAlert.location?.address || 'Unknown'}</p>
                
                <div className="status-options">
                  <label>Update Status:</label>
                  <div className="status-buttons">
                    <button
                      className={`status-button ${newStatus === 'Active' ? 'active' : ''}`}
                      onClick={() => setNewStatus('Active')}
                    >
                      Active
                    </button>
                    <button
                      className={`status-button ${newStatus === 'Responding' ? 'active' : ''}`}
                      onClick={() => setNewStatus('Responding')}
                    >
                      Responding
                    </button>
                    <button
                      className={`status-button ${newStatus === 'Resolved' ? 'active' : ''}`}
                      onClick={() => setNewStatus('Resolved')}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="dialog-actions">
              <button className="cancel-button" onClick={handleCloseStatusDialog}>
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={handleConfirmUpdate}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSAlerts;