// src/components/citizen/ComplaintStatus.js
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
        console.log("Complaints response:", response);
        if (response.success) {
          setComplaints(response.data);
        } else {
          setError(response.message || "Failed to fetch complaints");
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
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

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect fill='%23f5f5f5' width='320' height='180'/%3E%3Ctext fill='%23888' font-size='16' font-family='Arial' text-anchor='middle' x='160' y='90'%3EImage Not Available%3C/text%3E%3C/svg%3E";
  };

  const getImageSrc = (imageData) => {
    if (!imageData) {
      console.log("No image data provided");
      return null;
    }
    
    console.log("Processing image data type:", typeof imageData);
    console.log("Image data length:", imageData.length);
    console.log("Image data starts with:", imageData.substring(0, 50));
    
    // If imageData is already a complete data URL, return as is
    if (imageData.startsWith('data:')) {
      console.log("Image is already a data URL");
      return imageData;
    }
    
    // If it's just base64 data, add the appropriate prefix
    // Try to detect image type from the base64 string (first few characters)
    const signature = imageData.substring(0, 20).toLowerCase();
    let imageType = 'jpeg'; // default
    
    if (signature.includes('ivbor') || signature.includes('png')) {
      imageType = 'png';
    } else if (signature.includes('qk2') || signature.includes('bmp')) {
      imageType = 'bmp';
    } else if (signature.includes('webp')) {
      imageType = 'webp';
    } else if (signature.includes('jvber') || signature.includes('pdf')) {
      // If it's a PDF, we can't display it as an image
      console.log("Detected PDF file, cannot display as image");
      return null;
    }
    
    const dataUrl = `data:image/${imageType};base64,${imageData}`;
    console.log("Created data URL:", dataUrl.substring(0, 50) + "...");
    return dataUrl;
  };

  return (
    <div className="complaint-status-container">
      <div className="content-wrapper">
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
          <div className="complaints-grid">
            {complaints.map((complaint) => {
              console.log("Processing complaint:", complaint._id);
              console.log("Evidence:", complaint.evidence);
              
              return (
                <div key={complaint._id} className="complaint-card">
                  <div className="complaint-header">
                    <div className="complaint-id">
                      ID: {complaint._id.substring(0, 8)}
                    </div>
                  </div>

                  <div className="complaint-category">{complaint.category}</div>

                  {/* Display image if available */}
                  {complaint.evidence && complaint.evidence.length > 0 ? (
                    <div className="complaint-image-container">
                      <img 
                        src={getImageSrc(complaint.evidence[0])} 
                        alt="Complaint evidence" 
                        className="complaint-image"
                        onError={handleImageError}
                        onLoad={() => console.log("Image loaded successfully")}
                      />
                    </div>
                  ) : (
                    <div className="complaint-image-placeholder">
                      <div className="placeholder-icon">📷</div>
                      <span>No Image</span>
                    </div>
                  )}

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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintStatus;