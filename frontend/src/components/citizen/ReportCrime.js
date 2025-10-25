import React, { useState, useEffect, useRef } from "react";
import { createComplaint } from "../../services/api";
import "./ReportCrime.css";

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    location: { latitude: 0, longitude: 0, address: "" },
    evidence: [],
  });

  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 }); // Chennai
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef(null);

  const { description, category, location, evidence } = formData;

  // Get user's location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setSelectedLocation({ lat: latitude, lng: longitude });
          setFormData({
            ...formData,
            location: {
              latitude,
              longitude,
              address: `Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            },
          });
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
    setFormData({ ...formData, location: { ...location, address: e.target.value } });

  // Handle map click
  const handleMapClick = (e) => {
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lat = mapCenter.lat + (0.05 - (y / rect.height) * 0.1);
    const lng = mapCenter.lng + ((x / rect.width) - 0.5) * 0.1;

    setSelectedLocation({ lat, lng });
    setFormData({
      ...formData,
      location: {
        latitude: lat,
        longitude: lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      },
    });
  };

  const handleEvidenceUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, evidence: files.map((f) => f.name) });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) return alert("Select location on map first!");

    setIsSubmitting(true);
    try {
      const result = await createComplaint(formData);
      if (result.success) {
        alert("Complaint submitted successfully");

        // PDF download
        if (result.pdf) {
          const link = document.createElement("a");
          link.href = `data:application/pdf;base64,${result.pdf}`;
          link.download = `complaint-${result.data._id}.pdf`;
          link.click();
        }

        // Reset form
        setFormData({ description: "", category: "", location: { latitude: 0, longitude: 0, address: "" }, evidence: [] });
        setSelectedLocation(null);
      } else {
        alert(result.message || "Failed to submit complaint");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting complaint");
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
      <div className="report-crime-content">
        <div className="report-crime-form">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={onCategoryChange} required>
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
              <textarea value={description} name="description" onChange={onChange} required />
            </div>

            <div className="form-group">
              <label>Evidence</label>
              <input type="file" multiple onChange={handleEvidenceUpload} />
              {evidence.length > 0 && <p>{evidence.length} file(s) selected</p>}
            </div>

            <div className="form-group">
              <label>Location (Click on map)</label>
              <div className="map-container" ref={mapRef} onClick={handleMapClick}>
                <iframe title="Map" src={generateMapUrl()} width="100%" height="300" frameBorder="0"></iframe>
              </div>
              <input type="text" value={location.address} onChange={onAddressChange} placeholder="Edit address manually" />
              {selectedLocation && (
                <p>
                  Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportCrime;
