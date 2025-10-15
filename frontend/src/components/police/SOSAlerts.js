// src/components/police/SOSAlerts.js
import React, { useState, useEffect } from "react";
import { getSOSAlerts, updateSOSStatus } from "../../services/api";
import "./SOSAlerts.css";

const SOSAlerts = () => {
  const [sosAlerts, setSOSAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // Sample SOS alerts data for demonstration
  const sampleSOSAlerts = [
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e0",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9e1",
        name: "Anjali Sharma",
        email: "anjali.sharma@email.com",
        phone: "9876543210",
      },
      location: {
        address: "T. Nagar Bus Stand, Chennai",
        coordinates: { lat: 13.0413, lng: 80.2376 },
      },
      status: "Active",
      priority: "High",
      description:
        "Being followed by suspicious individuals near the bus stand. Need immediate help!",
      createdAt: "2024-01-16T20:15:00.000Z",
      updatedAt: "2024-01-16T20:15:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e1",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9e2",
        name: "Ravi Kumar",
        email: "ravi.kumar@email.com",
        phone: "9876543211",
      },
      location: {
        address: "Anna Nagar Roundana, Chennai",
        coordinates: { lat: 13.087, lng: 80.2125 },
      },
      status: "Responding",
      priority: "High",
      description: "Car accident with injuries. Ambulance needed immediately.",
      createdAt: "2024-01-16T19:30:00.000Z",
      updatedAt: "2024-01-16T19:45:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e2",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9e3",
        name: "Meera Patel",
        email: "meera.patel@email.com",
        phone: "9876543212",
      },
      location: {
        address: "Velachery 100 Feet Road, Chennai",
        coordinates: { lat: 12.9815, lng: 80.2186 },
      },
      status: "Active",
      priority: "Medium",
      description: "Witnessing a robbery in progress at the jewelry store.",
      createdAt: "2024-01-16T18:45:00.000Z",
      updatedAt: "2024-01-16T18:45:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e3",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9e4",
        name: "Karthik Subramanian",
        email: "karthik.s@email.com",
        phone: "9876543213",
      },
      location: {
        address: "Adyar Signal, Chennai",
        coordinates: { lat: 13.0067, lng: 80.2594 },
      },
      status: "Resolved",
      priority: "High",
      description: "Fire in apartment building. Fire department notified.",
      createdAt: "2024-01-16T17:20:00.000Z",
      updatedAt: "2024-01-16T18:30:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e4",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9e5",
        name: "Divya Nair",
        email: "divya.nair@email.com",
        phone: "9876543214",
      },
      location: {
        address: "Mylapore Kapaleeshwarar Temple, Chennai",
        coordinates: { lat: 13.0339, lng: 80.2629 },
      },
      status: "Active",
      priority: "High",
      description:
        "Child missing from temple premises. 5 years old, wearing blue dress.",
      createdAt: "2024-01-16T16:10:00.000Z",
      updatedAt: "2024-01-16T16:10:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e5",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9e6",
        name: "Suresh Babu",
        email: "suresh.babu@email.com",
        phone: "9876543215",
      },
      location: {
        address: "Koyambedu Market, Chennai",
        coordinates: { lat: 13.0674, lng: 80.1956 },
      },
      status: "Responding",
      priority: "Medium",
      description: "Group fight in market area. Need police intervention.",
      createdAt: "2024-01-16T15:30:00.000Z",
      updatedAt: "2024-01-16T15:45:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e6",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9e7",
        name: "Lakshmi Ranganathan",
        email: "lakshmi.r@email.com",
        phone: "9876543216",
      },
      location: {
        address: "Triplicane Beach, Chennai",
        coordinates: { lat: 13.0569, lng: 80.2794 },
      },
      status: "Resolved",
      priority: "Low",
      description: "Suspicious activity near beach. Investigation completed.",
      createdAt: "2024-01-16T14:00:00.000Z",
      updatedAt: "2024-01-16T16:00:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e7",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9e8",
        name: "Arjun Reddy",
        email: "arjun.reddy@email.com",
        phone: "9876543217",
      },
      location: {
        address: "Kodambakkam Railway Station, Chennai",
        coordinates: { lat: 13.0453, lng: 80.2339 },
      },
      status: "Active",
      priority: "High",
      description:
        "Medical emergency - person collapsed on platform. Need ambulance.",
      createdAt: "2024-01-16T13:45:00.000Z",
      updatedAt: "2024-01-16T13:45:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e8",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9e9",
        name: "Priya Menon",
        email: "priya.menon@email.com",
        phone: "9876543218",
      },
      location: {
        address: "Chennai Central Railway Station",
        coordinates: { lat: 13.0827, lng: 80.2707 },
      },
      status: "Responding",
      priority: "Medium",
      description: "Luggage theft reported. Security alerted.",
      createdAt: "2024-01-16T12:30:00.000Z",
      updatedAt: "2024-01-16T12:45:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9e9",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9ea",
        name: "Vijay Anand",
        email: "vijay.anand@email.com",
        phone: "9876543219",
      },
      location: {
        address: "Mount Road, Chennai",
        coordinates: { lat: 13.0753, lng: 80.2623 },
      },
      status: "Resolved",
      priority: "Low",
      description: "Traffic jam due to vehicle breakdown. Traffic cleared.",
      createdAt: "2024-01-16T11:00:00.000Z",
      updatedAt: "2024-01-16T12:00:00.000Z",
    },
  ];

  useEffect(() => {
    const fetchSOSAlerts = async () => {
      try {
        // For demonstration, we'll use sample data
        // In a real app, you would call the API
        // const response = await getSOSAlerts();
        // if (response.success) {
        //   setSOSAlerts(response.data);
        // }

        // Simulate API call delay
        setTimeout(() => {
          setSOSAlerts(sampleSOSAlerts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Failed to fetch SOS alerts", err);
        // Use sample data as fallback
        setSOSAlerts(sampleSOSAlerts);
        setLoading(false);
      }
    };

    fetchSOSAlerts();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "error";
      case "Responding":
        return "warning";
      case "Resolved":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "high-priority";
      case "Medium":
        return "medium-priority";
      case "Low":
        return "low-priority";
      default:
        return "default-priority";
    }
  };

  const isUrgent = (alert) => {
    return alert.status === "Active" && alert.priority === "High";
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
      // Simulate API call
      setTimeout(() => {
        // Update the local state
        setSOSAlerts(
          sosAlerts.map((a) =>
            a._id === selectedAlert._id
              ? { ...a, status: newStatus, updatedAt: new Date().toISOString() }
              : a
          )
        );
        setStatusDialogOpen(false);
        setUpdating(false);
      }, 1000);

      // In a real app, you would call the API
      // const response = await updateSOSStatus(selectedAlert._id, newStatus);
      // if (response.success) {
      //   setSOSAlerts(sosAlerts.map(a =>
      //     a._id === selectedAlert._id ? response.data : a
      //   ));
      //   setStatusDialogOpen(false);
      // } else {
      //   alert('Failed to update SOS status');
      // }
    } catch (err) {
      alert("Failed to update SOS status");
      setUpdating(false);
    }
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
                <th>Priority</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sosAlerts.map((alert) => (
                <tr key={alert._id} className={isUrgent(alert) ? "urgent" : ""}>
                  <td>{alert._id.substring(0, 8)}</td>
                  <td>
                    <div>
                      <div>{alert.citizenId?.name || "Unknown"}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>
                        {alert.citizenId?.phone || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td>{alert.location?.address || "Unknown"}</td>
                  <td>
                    <span
                      className={`priority-badge ${getPriorityColor(
                        alert.priority
                      )}`}
                    >
                      {alert.priority}
                    </span>
                  </td>
                  <td>{new Date(alert.createdAt).toLocaleString()}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusColor(alert.status)}`}
                    >
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
                <p>
                  <strong>Alert ID:</strong> {selectedAlert._id}
                </p>
                <p>
                  <strong>Priority:</strong>
                  <span
                    className={`priority-badge ${getPriorityColor(
                      selectedAlert.priority
                    )}`}
                  >
                    {selectedAlert.priority}
                  </span>
                </p>
                <p>
                  <strong>Description:</strong> {selectedAlert.description}
                </p>
                <p>
                  <strong>Reported by:</strong> {selectedAlert.citizenId?.name}{" "}
                  ({selectedAlert.citizenId?.phone})
                </p>
                <div className="map-placeholder">
                  <iframe
                    title="SOS Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, borderRadius: "8px" }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      selectedAlert.location.coordinates.lng - 0.01
                    },${selectedAlert.location.coordinates.lat - 0.01},${
                      selectedAlert.location.coordinates.lng + 0.01
                    },${
                      selectedAlert.location.coordinates.lat + 0.01
                    }&layer=mapnik&marker=${
                      selectedAlert.location.coordinates.lat
                    },${selectedAlert.location.coordinates.lng}`}
                    allowFullScreen
                  ></iframe>
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
                <p>
                  <strong>Alert ID:</strong> {selectedAlert._id}
                </p>
                <p>
                  <strong>Priority:</strong>
                  <span
                    className={`priority-badge ${getPriorityColor(
                      selectedAlert.priority
                    )}`}
                  >
                    {selectedAlert.priority}
                  </span>
                </p>
                <p>
                  <strong>Citizen:</strong> {selectedAlert.citizenId?.name} (
                  {selectedAlert.citizenId?.phone})
                </p>
                <p>
                  <strong>Location:</strong> {selectedAlert.location?.address}
                </p>
                <p>
                  <strong>Description:</strong> {selectedAlert.description}
                </p>

                <div className="status-options">
                  <label>Update Status:</label>
                  <div className="status-buttons">
                    <button
                      className={`status-button ${
                        newStatus === "Active" ? "active" : ""
                      }`}
                      onClick={() => setNewStatus("Active")}
                    >
                      Active
                    </button>
                    <button
                      className={`status-button ${
                        newStatus === "Responding" ? "active" : ""
                      }`}
                      onClick={() => setNewStatus("Responding")}
                    >
                      Responding
                    </button>
                    <button
                      className={`status-button ${
                        newStatus === "Resolved" ? "active" : ""
                      }`}
                      onClick={() => setNewStatus("Resolved")}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="dialog-actions">
              <button
                className="cancel-button"
                onClick={handleCloseStatusDialog}
              >
                Cancel
              </button>
              <button
                className="confirm-button"
                onClick={handleConfirmUpdate}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSAlerts;
