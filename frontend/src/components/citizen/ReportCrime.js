// src/components/citizen/ReportCrime.js
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
    lat: 13.0827, // Chennai latitude
    lng: 80.2707, // Chennai longitude
  });

  const [mapZoom, setMapZoom] = useState(12);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);
  const [tempSelectedLocation, setTempSelectedLocation] = useState(null);

  const { description, category, location, evidence } = formData;

  // Sample Chennai locations for address suggestions
  const chennaiLocations = [
    { name: "T. Nagar", lat: 13.0413, lng: 80.2376 },
    { name: "Anna Nagar", lat: 13.087, lng: 80.2125 },
    { name: "Adyar", lat: 13.0067, lng: 80.2594 },
    { name: "Velachery", lat: 12.9815, lng: 80.2186 },
    { name: "Mylapore", lat: 13.0339, lng: 80.2629 },
    { name: "Triplicane", lat: 13.0569, lng: 80.2794 },
    { name: "Royapettah", lat: 13.0455, lng: 80.2629 },
    { name: "Kodambakkam", lat: 13.0453, lng: 80.2339 },
    { name: "Koyambedu", lat: 13.0674, lng: 80.1956 },
    { name: "Chennai Central", lat: 13.0827, lng: 80.2707 },
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Chennai center if geolocation fails
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
    setTempSelectedLocation({ lat, lng });
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        latitude: lat,
        longitude: lng,
      },
    });

    // Find nearest location name for the selected coordinates
    const nearestLocation = findNearestLocation(lat, lng);
    if (nearestLocation) {
      setFormData({
        ...formData,
        location: {
          latitude: lat,
          longitude: lng,
          address: nearestLocation.name,
        },
      });
    }
  };

  const findNearestLocation = (lat, lng) => {
    let minDistance = Infinity;
    let nearestLocation = null;

    chennaiLocations.forEach((location) => {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + Math.pow(lng - location.lng, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestLocation = location;
      }
    });

    return nearestLocation;
  };

  const onAddressChange = (e) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        address: e.target.value,
      },
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setSelectedLocation({ lat, lng });
          setTempSelectedLocation({ lat, lng });
          setMapCenter({ lat, lng });

          // Find nearest location name
          const nearestLocation = findNearestLocation(lat, lng);
          if (nearestLocation) {
            setFormData({
              ...formData,
              location: {
                latitude: lat,
                longitude: lng,
                address: nearestLocation.name,
              },
            });
          }
        },
        (error) => {
          alert(
            "Unable to get your location. Please select manually on the map."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const openFullScreenMap = () => {
    setShowFullScreenMap(true);
    setTempSelectedLocation(selectedLocation);
  };

  const closeFullScreenMap = () => {
    setShowFullScreenMap(false);
  };

  const confirmLocationSelection = () => {
    if (tempSelectedLocation) {
      setSelectedLocation(tempSelectedLocation);
      setMapCenter(tempSelectedLocation);
    }
    setShowFullScreenMap(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      alert("Please select a location on the map");
      return;
    }

    if (!location.address) {
      alert("Please enter the address");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComplaint(formData);

      if (result.success) {
        alert("Complaint submitted successfully");
        // Download PDF
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${result.pdf}`;
        link.download = `complaint-${result.data._id}.pdf`;
        link.click();

        // Reset form
        setFormData({
          description: "",
          category: "",
          location: {
            latitude: 0,
            longitude: 0,
            address: "",
          },
          evidence: [],
        });
        setSelectedLocation(null);
        setTempSelectedLocation(null);
      } else {
        alert(result.message || "Failed to submit complaint");
      }
    } catch (err) {
      alert("Failed to submit complaint");
    }

    setIsSubmitting(false);
  };

  const handleEvidenceUpload = (e) => {
    // In a real app, this would handle file uploads
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      evidence: files.map((file) => file.name),
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
                <option value="Fraud">Fraud</option>
                <option value="Harassment">Harassment</option>
                <option value="Missing Person">Missing Person</option>
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
                placeholder="Please provide a detailed description of the incident..."
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="address">Location Address</label>
              <div className="address-input-container">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={location.address}
                  onChange={onAddressChange}
                  placeholder="Enter location or select from map"
                  required
                />
                <button
                  type="button"
                  className="location-button"
                  onClick={getCurrentLocation}
                  title="Use current location"
                >
                  📍
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="evidence">Upload Evidence</label>
              <input
                type="file"
                id="evidence"
                name="evidence"
                multiple
                onChange={handleEvidenceUpload}
                accept="image/*,video/*,.pdf"
              />
              {evidence.length > 0 && (
                <p className="evidence-count">
                  {evidence.length} file(s) selected
                </p>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>

        <div className="report-crime-map">
          <h3>Select Crime Location</h3>
          <div className="map-container">
            <div className="map-placeholder">
              <iframe
                title="Chennai Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, borderRadius: "8px" }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  mapCenter.lng - 0.1
                },${mapCenter.lat - 0.1},${mapCenter.lng + 0.1},${
                  mapCenter.lat + 0.1
                }&layer=mapnik&marker=${
                  selectedLocation
                    ? `${selectedLocation.lat},${selectedLocation.lng}`
                    : ""
                }`}
                allowFullScreen
              ></iframe>

              <div className="map-overlay">
                <div className="map-instructions">
                  <p>Click on the map to select the crime location</p>
                  <p>
                    Selected:{" "}
                    {selectedLocation
                      ? `${selectedLocation.lat.toFixed(
                          6
                        )}, ${selectedLocation.lng.toFixed(6)}`
                      : "No location selected"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button className="fullscreen-map-button" onClick={openFullScreenMap}>
            Open Full Screen Map
          </button>

          <div className="location-info">
            {selectedLocation && (
              <div className="selected-location">
                <h4>Selected Location:</h4>
                <p>
                  <strong>Address:</strong> {location.address}
                </p>
                <p>
                  <strong>Coordinates:</strong>{" "}
                  {selectedLocation.lat.toFixed(6)},{" "}
                  {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Map Modal */}
      {showFullScreenMap && (
        <div className="fullscreen-map-overlay">
          <div className="fullscreen-map-container">
            <div className="fullscreen-map-header">
              <h2>Select Crime Location</h2>
              <div className="fullscreen-map-controls">
                <button
                  className="current-location-btn"
                  onClick={getCurrentLocation}
                >
                  Use Current Location
                </button>
                <button className="close-map-btn" onClick={closeFullScreenMap}>
                  ✕
                </button>
              </div>
            </div>

            <div className="fullscreen-map-content">
              <div className="fullscreen-map">
                <iframe
                  title="Chennai Full Screen Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    mapCenter.lng - 0.2
                  },${mapCenter.lat - 0.2},${mapCenter.lng + 0.2},${
                    mapCenter.lat + 0.2
                  }&layer=mapnik&marker=${
                    tempSelectedLocation
                      ? `${tempSelectedLocation.lat},${tempSelectedLocation.lng}`
                      : ""
                  }`}
                  allowFullScreen
                ></iframe>
              </div>

              <div className="location-panel">
                <h3>Location Details</h3>
                {tempSelectedLocation ? (
                  <div className="temp-location-info">
                    <p>
                      <strong>Coordinates:</strong>{" "}
                      {tempSelectedLocation.lat.toFixed(6)},{" "}
                      {tempSelectedLocation.lng.toFixed(6)}
                    </p>
                    <p>
                      <strong>Nearest Area:</strong>{" "}
                      {findNearestLocation(
                        tempSelectedLocation.lat,
                        tempSelectedLocation.lng
                      )?.name || "Unknown"}
                    </p>
                    <div className="location-actions">
                      <input
                        type="text"
                        value={location.address}
                        onChange={onAddressChange}
                        placeholder="Enter address details"
                        className="location-address-input"
                      />
                      <button
                        className="confirm-location-btn"
                        onClick={confirmLocationSelection}
                      >
                        Confirm Location
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>Click on the map to select a location</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCrime;
