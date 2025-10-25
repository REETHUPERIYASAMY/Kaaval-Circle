import React, { useState, useEffect } from "react";
import { createComplaint } from "../../services/api";
import "./ReportCrime.css";

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    location: {
      latitude: 0,
      longitude: 0,
      address: "",
    },
    evidence: [],
  });

  const [mapCenter, setMapCenter] = useState({
    lat: 13.0827, // Chennai center
    lng: 80.2707,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { description, category, location, evidence } = formData;

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Using default Chennai location");
        }
      );
    }
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const onMapClick = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setFormData({
      ...formData,
      location: {
        latitude: lat,
        longitude: lng,
        address: `Selected location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      },
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      alert("Please select a location on the map");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createComplaint(formData);
      if (result.success) {
        alert("Complaint submitted successfully");
        setFormData({
          description: "",
          category: "",
          location: { latitude: 0, longitude: 0, address: "" },
          evidence: [],
        });
        setSelectedLocation(null);
      } else {
        alert(result.message || "Failed to submit complaint");
      }
    } catch (err) {
      alert("Error submitting complaint");
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleEvidenceUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      evidence: files.map((file) => file.name),
    });
  };

  return (
    <div className="report-crime-container">
      <h1>Report Crime</h1>
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
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Evidence</label>
          <input type="file" multiple onChange={handleEvidenceUpload} />
          {evidence.length > 0 && <p>{evidence.length} file(s) selected</p>}
        </div>

        <div className="form-group">
          <label>Location (Click on map)</label>
          <div className="map-placeholder" onClick={() => {}}>
            <iframe
              title="Chennai Map"
              width="100%"
              height="300"
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                mapCenter.lng - 0.05
              },${mapCenter.lat - 0.05},${mapCenter.lng + 0.05},${
                mapCenter.lat + 0.05
              }&layer=mapnik${
                selectedLocation
                  ? `&marker=${selectedLocation.lat},${selectedLocation.lng}`
                  : ""
              }`}
            ></iframe>
            <p>
              Selected:{" "}
              {selectedLocation
                ? `${selectedLocation.lat.toFixed(
                    6
                  )}, ${selectedLocation.lng.toFixed(6)}`
                : "None"}
            </p>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ReportCrime;
