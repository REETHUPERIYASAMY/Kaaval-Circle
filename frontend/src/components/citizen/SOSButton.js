// src/components/citizen/SOSButton.js
import React, { useState, useEffect } from 'react';
import { createSOSAlert } from '../../services/api';
import './SOSButton.css';

const SOSButton = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendSOS = async () => {
    if (!location) {
      setError('Location not available. Please enable location services.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createSOSAlert({
        latitude: location.lat,
        longitude: location.lng,
        address: 'Current Location' // In a real app, this would be reverse geocoded
      });

      if (result.success) {
        alert('SOS alert sent successfully! Help is on the way.');
        handleClose();
      } else {
        setError(result.message || 'Failed to send SOS alert');
      }
    } catch (err) {
      setError('Failed to send SOS alert');
    }

    setLoading(false);
  };

  return (
    <div className="sos-container">
      <h1 className="sos-title">Emergency SOS</h1>
      
      <div className="sos-content">
        <div className="sos-card">
          <h2 className="sos-card-title">Press the SOS button in case of emergency</h2>
          
          <button
            className="sos-button-main"
            onClick={handleClickOpen}
          >
            SEND SOS ALERT
          </button>
          
          {error && (
            <p className="sos-error">{error}</p>
          )}
        </div>
      </div>
      
      {open && (
        <div className="sos-modal">
          <div className="sos-modal-content">
            <h3 className="sos-modal-title">Confirm SOS Alert</h3>
            <p className="sos-modal-text">
              Are you sure you want to send an SOS alert? This will notify nearby police officers with your current location.
            </p>
            
            {location && (
              <div className="sos-modal-map">
                {/* In a real app, this would be a Google Map */}
                <div className="map-placeholder">
                  <p>Map would be displayed here</p>
                  <p>Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                </div>
              </div>
            )}
            
            <div className="sos-modal-actions">
              <button onClick={handleClose} className="sos-modal-cancel">
                Cancel
              </button>
              <button 
                onClick={handleSendSOS} 
                className="sos-modal-confirm"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send SOS Alert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSButton;