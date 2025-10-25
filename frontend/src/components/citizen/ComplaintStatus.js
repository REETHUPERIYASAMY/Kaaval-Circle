import React, { useState, useEffect } from "react";
import { getComplaints } from "../../services/api";
import "./ComplaintStatus.css";

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getComplaints();
        if (response.success) {
          setComplaints(response.data);
        } else {
          setError(response.message || "Failed to fetch complaints");
        }
      } catch (err) {
        setError("Failed to fetch complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "In Progress":
        return "status-progress";
      case "Closed":
        return "status-closed";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <div className="complaint-status-container">
      <h1 className="complaint-status-title">Complaint Status</h1>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading complaints...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-container">
          <div className="empty-icon">📋</div>
          <h2>No complaints found</h2>
          <p>You haven't filed any complaints yet.</p>
          <div className="empty-actions">
            <button className="report-complaint-btn">
              Report a New Complaint
            </button>
          </div>
        </div>
      ) : (
        <div className="complaint-list">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card">
              <div className="complaint-header">
                <div className="complaint-id">
                  ID: {complaint._id.substring(0, 8)}
                </div>
              </div>

              <div className="complaint-category">{complaint.category}</div>

              <div className="complaint-description">
                {complaint.description}
              </div>

              <div className="complaint-details">
                <div className="complaint-date">
                  {formatDate(complaint.createdAt)} at{" "}
                  {formatTime(complaint.createdAt)}
                </div>
                <div className="complaint-location">
                  {complaint.location.address}
                </div>
              </div>

              <div className="complaint-status">
                <span
                  className={`status-badge ${getStatusColor(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>

                <div className="complaint-assigned">
                  {complaint.assignedTo ? (
                    <>
                      <div className="assigned-officer">
                        {complaint.assignedTo.name}
                      </div>
                      <div className="assigned-station">
                        {complaint.assignedTo.stationName}
                      </div>
                    </>
                  ) : (
                    <span>Not assigned</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintStatus;