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

  // Sample complaints data for demonstration
  const sampleComplaints = [
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9d0",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9d1",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phone: "9876543210",
      },
      category: "Theft",
      description:
        "My wallet was stolen from the shopping mall parking area. It contained cash, credit cards, and important documents. The incident occurred around 3 PM when I was shopping.",
      location: {
        address: "Phoenix Marketcity, Velachery, Chennai",
        coordinates: { lat: 12.9815, lng: 80.2186 },
      },
      status: "Pending",
      priority: "Medium",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9d2",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9d3",
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "9876543211",
      },
      category: "Domestic Violence",
      description:
        "Experiencing domestic violence from spouse. Need immediate police intervention for safety. The situation has been escalating over the past few weeks.",
      location: {
        address: "Anna Nagar West, Chennai",
        coordinates: { lat: 13.087, lng: 80.2125 },
      },
      status: "In Progress",
      priority: "High",
      createdAt: "2024-01-14T15:45:00.000Z",
      updatedAt: "2024-01-14T16:30:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9d3",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9d4",
        name: "Mohammed Ali",
        email: "mohammed.ali@email.com",
        phone: "9876543212",
      },
      category: "Vandalism",
      description:
        "Unknown individuals damaged my car parked outside my residence. Windows were broken and tires were slashed. This is the second incident this month.",
      location: {
        address: "T. Nagar, Chennai",
        coordinates: { lat: 13.0413, lng: 80.2376 },
      },
      status: "Closed",
      priority: "Low",
      createdAt: "2024-01-10T09:15:00.000Z",
      updatedAt: "2024-01-12T14:20:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9d4",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9d5",
        name: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        phone: "9876543213",
      },
      category: "Assault",
      description:
        "Was physically assaulted by a group of individuals near the bus stop. They attempted to snatch my phone and bag. Suffered minor injuries.",
      location: {
        address: "Koyambedu Bus Terminus, Chennai",
        coordinates: { lat: 13.0674, lng: 80.1956 },
      },
      status: "In Progress",
      priority: "High",
      createdAt: "2024-01-13T18:20:00.000Z",
      updatedAt: "2024-01-13T19:45:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9d5",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9d6",
        name: "Arvind Patel",
        email: "arvind.patel@email.com",
        phone: "9876543214",
      },
      category: "Fraud",
      description:
        "Received a fake call claiming to be from my bank asking for OTP. Lost Rs. 50,000 from my account. Need immediate action to trace the fraudsters.",
      location: {
        address: "Mylapore, Chennai",
        coordinates: { lat: 13.0339, lng: 80.2629 },
      },
      status: "Pending",
      priority: "High",
      createdAt: "2024-01-16T11:00:00.000Z",
      updatedAt: "2024-01-16T11:00:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9d6",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9d7",
        name: "Kavita Nair",
        email: "kavita.nair@email.com",
        phone: "9876543215",
      },
      category: "Harassment",
      description:
        "Being harassed by neighbors over parking disputes. They have been verbally abusive and threatening. Request police intervention.",
      location: {
        address: "Adyar, Chennai",
        coordinates: { lat: 13.0067, lng: 80.2594 },
      },
      status: "Pending",
      priority: "Medium",
      createdAt: "2024-01-16T08:30:00.000Z",
      updatedAt: "2024-01-16T08:30:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9d7",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9d8",
        name: "Ramesh Babu",
        email: "ramesh.babu@email.com",
        phone: "9876543216",
      },
      category: "Missing Person",
      description:
        "My 65-year-old mother has been missing since yesterday morning. She was last seen near the local temple. She has memory issues.",
      location: {
        address: "Triplicane, Chennai",
        coordinates: { lat: 13.0569, lng: 80.2794 },
      },
      status: "In Progress",
      priority: "High",
      createdAt: "2024-01-15T07:00:00.000Z",
      updatedAt: "2024-01-15T09:30:00.000Z",
    },
    {
      _id: "64f8a1b2c3d4e5f6a7b8c9d8",
      citizenId: {
        _id: "64f8a1b2c3d4e5f6a7b8c9d9",
        name: "Lakshmi Narayanan",
        email: "lakshmi.n@email.com",
        phone: "9876543217",
      },
      category: "Noise Pollution",
      description:
        "Neighbor plays loud music till late night despite multiple requests. This is affecting my children's studies and sleep. Need police action.",
      location: {
        address: "Kodambakkam, Chennai",
        coordinates: { lat: 13.0453, lng: 80.2339 },
      },
      status: "Closed",
      priority: "Low",
      createdAt: "2024-01-08T20:00:00.000Z",
      updatedAt: "2024-01-09T12:00:00.000Z",
    },
  ];

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // For demonstration, we'll use sample data
        // In a real app, you would call the API
        // const response = await getComplaints();
        // if (response.success) {
        //   setComplaints(response.data);
        // }

        // Simulate API call delay
        setTimeout(() => {
          setComplaints(sampleComplaints);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
        // Use sample data as fallback
        setComplaints(sampleComplaints);
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

  const handleUpdateStatus = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setDialogOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedComplaint || !newStatus) return;

    setUpdating(true);

    try {
      // Simulate API call
      setTimeout(() => {
        // Update the local state
        setComplaints(
          complaints.map((c) =>
            c._id === selectedComplaint._id
              ? { ...c, status: newStatus, updatedAt: new Date().toISOString() }
              : c
          )
        );
        setDialogOpen(false);
        setUpdating(false);
      }, 1000);

      // In a real app, you would call the API
      // const response = await updateComplaintStatus(selectedComplaint._id, newStatus);
      // if (response.success) {
      //   setComplaints(complaints.map(c =>
      //     c._id === selectedComplaint._id ? response.data : c
      //   ));
      //   setDialogOpen(false);
      // } else {
      //   alert('Failed to update complaint status');
      // }
    } catch (err) {
      alert("Failed to update complaint status");
      setUpdating(false);
    }
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
                <th>Priority</th>
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
                      className={`priority-badge ${getPriorityColor(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority}
                    </span>
                  </td>
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
                  <strong>Priority:</strong>
                  <span
                    className={`priority-badge ${getPriorityColor(
                      selectedComplaint.priority
                    )}`}
                  >
                    {selectedComplaint.priority}
                  </span>
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
