// src/components/police/ManageComplaints.js
import React, { useState, useEffect } from "react";
import { getComplaints, updateComplaintStatus } from "../../services/api";
import "./ManageComplaints.css";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getComplaints();
        if (response.success) {
          setComplaints(response.data);
        } else {
          console.error("Failed to fetch complaints:", response.message);
        }
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "In Progress":
        return "info";
      case "Closed":
        return "success";
      default:
        return "default";
    }
  };

  const handleUpdateStatus = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setDialogOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedComplaint || !newStatus) return;

    setUpdating(true);

    try {
      const response = await updateComplaintStatus(selectedComplaint._id, newStatus);
      if (response.success) {
        setComplaints(
          complaints.map((c) =>
            c._id === selectedComplaint._id ? response.data : c
          )
        );
        setDialogOpen(false);
      } else {
        alert(response.message || "Failed to update complaint status");
      }
    } catch (err) {
      alert("Failed to update complaint status");
    }

    setUpdating(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div className="manage-complaints-container">
      <h1 className="manage-complaints-title">Manage Complaints</h1>

      {loading ? (
        <div className="loading">Loading complaints...</div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <p>No complaints found</p>
        </div>
      ) : (
        <div className="complaints-table-container">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Citizen</th>
                <th>Category</th>
                <th>Description</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>{complaint._id.substring(0, 8)}</td>
                  <td>
                    <div>
                      <div>{complaint.citizenId?.name || "Unknown"}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>
                        {complaint.citizenId?.phone || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td>{complaint.category}</td>
                  <td>{complaint.description.substring(0, 50)}...</td>
                  <td>{complaint.location?.address || "Unknown"}</td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="update-button"
                      onClick={() => handleUpdateStatus(complaint)}
                    >
                      Update Status
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
            <h3 className="dialog-title">Update Complaint Status</h3>
            {selectedComplaint && (
              <div className="dialog-body">
                <p>
                  <strong>Complaint ID:</strong> {selectedComplaint._id}
                </p>
                <p>
                  <strong>Category:</strong> {selectedComplaint.category}
                </p>
                <p>
                  <strong>Description:</strong> {selectedComplaint.description}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {selectedComplaint.location?.address}
                </p>
                <p>
                  <strong>Reported by:</strong>{" "}
                  {selectedComplaint.citizenId?.name} (
                  {selectedComplaint.citizenId?.phone})
                </p>

                <div className="status-options">
                  <label>Update Status:</label>
                  <div className="status-buttons">
                    <button
                      className={`status-button ${
                        newStatus === "Pending" ? "active" : ""
                      }`}
                      onClick={() => setNewStatus("Pending")}
                    >
                      Pending
                    </button>
                    <button
                      className={`status-button ${
                        newStatus === "In Progress" ? "active" : ""
                      }`}
                      onClick={() => setNewStatus("In Progress")}
                    >
                      In Progress
                    </button>
                    <button
                      className={`status-button ${
                        newStatus === "Closed" ? "active" : ""
                      }`}
                      onClick={() => setNewStatus("Closed")}
                    >
                      Closed
                    </button>
                  </div>
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
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageComplaints;