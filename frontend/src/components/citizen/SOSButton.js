// src/components/citizen/SOSButton.js
import React, { useState, useEffect } from 'react';
import { createSOSAlert } from '../../services/api';
import './SOSButton.css';

const SOSButton = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High'); // default
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
        () => setError('Unable to get your location. Please enable location services.')
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDescription('');
    setPriority('High');
    setError(null);
  };

  {/*const handleSendSOS = async () => {
    if (!location) {
      setError('Location not available. Please enable location services.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description of your emergency.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createSOSAlert({
        latitude: location.lat,
        longitude: location.lng,
        address: 'Current Location', // you can add reverse geocode if needed
        description,
        priority
      });

      if (result.success) {
        alert('SOS alert sent successfully! Help is on the way.');
        handleClose();
      } else {
        setError(result.message || 'Failed to send SOS alert');
      }
    } catch {
      setError('Failed to send SOS alert');
    }

    setLoading(false);
  };*/}
const handleSendSOS = async () => {
  if (!location) {
    setError('Location not available. Please enable location services.');
    return;
  }

  if (!description.trim()) {
    setError('Please enter a description of your emergency.');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const result = await createSOSAlert({
      location: {
        coordinates: {
          lat: location.lat,
          lng: location.lng
        },
        address: 'Current Location' // or reverse geocode if available
      },
      description,
      priority
    });

    console.log('SOS result:', result);

    if (result.success) {
      alert('SOS alert sent successfully! Help is on the way.');
      handleClose();
    } else {
      setError(result.message || 'Failed to send SOS alert');
    }
  } catch (err) {
    console.error(err);
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
          <button className="sos-button-main" onClick={handleClickOpen}>
            SEND SOS ALERT
          </button>
          {error && <p className="sos-error">{error}</p>}
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
                <div className="map-placeholder">
                  {/*<p>Map would be displayed here</p>*/}
                  <p>Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="sos-modal-body">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your emergency..."
                rows={3}
              />

              <label>Priority:</label>
              <div className="priority-buttons">
                {['High', 'Medium', 'Low'].map((level) => (
                  <button
                    key={level}
                    className={priority === level ? 'active' : ''}
                    onClick={() => setPriority(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

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
