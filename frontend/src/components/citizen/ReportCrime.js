import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ReportCrime.css";

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    location: { latitude: 0, longitude: 0, address: "" },
    evidence: [], // store actual File objects
  });

  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setSelectedLocation({ lat: latitude, lng: longitude });
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude,
              longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            },
          }));
        },
        () => console.log("Using default Chennai location")
      );
    }
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCategoryChange = (e) =>
    setFormData({ ...formData, category: e.target.value });

  const onAddressChange = (e) =>
    setFormData({ ...formData, location: { ...formData.location, address: e.target.value } });

  const handleMapClick = (e) => {
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lat = mapCenter.lat + (0.05 - (y / rect.height) * 0.1);
    const lng = mapCenter.lng + ((x / rect.width - 0.5) * 0.1);

    setSelectedLocation({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      location: { latitude: lat, longitude: lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` },
    }));
  };

  const handleEvidenceUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, evidence: files }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) return alert("Select location on map first!");

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("latitude", formData.location.latitude);
      fd.append("longitude", formData.location.longitude);
      fd.append("address", formData.location.address);

      formData.evidence.forEach((file) => fd.append("evidence", file));

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/complaints`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type header when using FormData
          },
        }
      );

      if (response.data.success) {
        alert("Complaint submitted successfully!");

        // Download PDF if returned
        if (response.data.pdf) {
          const link = document.createElement("a");
          link.href = `data:application/pdf;base64,${response.data.pdf}`;
          link.download = `complaint-${response.data.data._id}.pdf`;
          link.click();
        }

        // Reset form
        setFormData({
          description: "",
          category: "",
          location: { latitude: 0, longitude: 0, address: "" },
          evidence: [],
        });
        setSelectedLocation(null);
      } else {
        alert(response.data.message || "Failed to submit complaint");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error submitting complaint. Check console for details.");
    }

    setIsSubmitting(false);
  };

  const generateMapUrl = () => {
    const { lat, lng } = mapCenter;
    const bbox = `${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05}`;
    const marker = selectedLocation ? `&mlat=${selectedLocation.lat}&mlon=${selectedLocation.lng}` : "";
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`;
  };

  return (
    <div className="report-crime-container">
      <h1 className="report-crime-title">Report Crime</h1>
      <form onSubmit={onSubmit} className="report-crime-form">
        <div className="form-group">
          <label>Category</label>
          <select value={formData.category} onChange={onCategoryChange} required>
            <option value="">Select Category</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Vandalism">Vandalism</option>
            <option value="Domestic Violence">Domestic Violence</option>
            <option value="Fraud">Fraud</option>
            <option value="Harassment">Harassment</option>
            <option value="Missing Person">Missing Person</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label>Evidence</label>
          <input type="file" multiple onChange={handleEvidenceUpload} />
          {formData.evidence.length > 0 && <p>{formData.evidence.length} file(s) selected</p>}
        </div>

        <div className="form-group">
          <label>Location (Click on map)</label>
          <div className="map-container" ref={mapRef} onClick={handleMapClick}>
            <iframe title="Map" src={generateMapUrl()} width="100%" height="300" frameBorder="0"></iframe>
          </div>
          <input 
            type="text" 
            value={formData.location.address} 
            onChange={onAddressChange} 
            placeholder="Edit address manually" 
          />
          {selectedLocation && (
            <p>Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportCrime;