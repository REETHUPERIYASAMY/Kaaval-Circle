// src/components/citizen/ReportCrime.js
import React, { useState } from 'react';
import { createComplaint } from '../../services/api';
import './ReportCrime.css';

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    },
    evidence: []
  });
  
  const [mapCenter, setMapCenter] = useState({
    lat: 19.0760,
    lng: 72.8777
  });
  
  const [mapZoom, setMapZoom] = useState(11);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { description, category, location, evidence } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const onMapClick = ({ lat, lng }) => {
    setSelectedLocation({ lat, lng });
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        latitude: lat,
        longitude: lng
      }
    });
  };

  const onAddressChange = (e) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        address: e.target.value
      }
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!selectedLocation) {
      alert('Please select a location on the map');
      return;
    }
    
    if (!location.address) {
      alert('Please enter the address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createComplaint(formData);
      
      if (result.success) {
        alert('Complaint submitted successfully');
        // Download PDF
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${result.pdf}`;
        link.download = `complaint-${result.data._id}.pdf`;
        link.click();
        
        // Reset form
        setFormData({
          description: '',
          category: '',
          location: {
            latitude: 0,
            longitude: 0,
            address: ''
          },
          evidence: []
        });
        setSelectedLocation(null);
      } else {
        alert(result.message || 'Failed to submit complaint');
      }
    } catch (err) {
      alert('Failed to submit complaint');
    }
    
    setIsSubmitting(false);
  };

  const handleEvidenceUpload = (e) => {
    // In a real app, this would handle file uploads
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      evidence: files.map(file => file.name)
    });
  };

  return (
    <div className="report-crime-container">
      <h1 className="report-crime-title">Report Crime</h1>
      
      <div className="report-crime-content">
        <div className="report-crime-form">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="category">Crime Category</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={onCategoryChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Theft">Theft</option>
                <option value="Assault">Assault</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Domestic Violence">Domestic Violence</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Crime Description</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Location Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={location.address}
                onChange={onAddressChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="evidence">Upload Evidence</label>
              <input
                type="file"
                id="evidence"
                name="evidence"
                multiple
                onChange={handleEvidenceUpload}
              />
              {evidence.length > 0 && (
                <p className="evidence-count">{evidence.length} file(s) selected</p>
              )}
            </div>
            
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
        
        <div className="report-crime-map">
          <h3>Select Crime Location</h3>
          <div className="map-container">
            {/* In a real app, this would be a Google Map */}
            <div className="map-placeholder">
              <p>Map would be displayed here</p>
              <p>Click on the map to select location</p>
              {selectedLocation && (
                <p>Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCrime;