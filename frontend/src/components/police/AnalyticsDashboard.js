// src/components/police/AnalyticsDashboard.js
import React, { useState, useEffect } from "react";
import { getDashboardStats, getCrimeHotspots, getCrimeCategories } from "../../services/api";
import "./AnalyticsDashboard.css";

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    activeSOS: 0,
    pendingComplaints: 0,
    avgResponseTime: 0,
  });
  const [hotspots, setHotspots] = useState([]);
  const [crimeCategories, setCrimeCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 13.0827, // Chennai latitude
    lng: 80.2707, // Chennai longitude
  });
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Function to fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      console.log("Starting data fetch...");
      setLoading(true);
      setError(null);
      
      // Fetch data with individual error handling
      const statsResponse = await getDashboardStats().catch(err => {
        console.error("Error fetching stats:", err);
        return null;
      });
      
      const hotspotsResponse = await getCrimeHotspots(mapCenter.lat, mapCenter.lng).catch(err => {
        console.error("Error fetching hotspots:", err);
        return null;
      });
      
      const categoriesResponse = await getCrimeCategories().catch(err => {
        console.error("Error fetching categories:", err);
        return null;
      });

      console.log("Stats response:", statsResponse);
      console.log("Hotspots response:", hotspotsResponse);
      console.log("Categories response:", categoriesResponse);

      // Update state with available data
      if (statsResponse && statsResponse.success) {
        setStats(statsResponse.data);
      } else {
        console.warn("Invalid stats response format");
      }

      if (hotspotsResponse && hotspotsResponse.success) {
        setHotspots(hotspotsResponse.data);
      } else {
        console.warn("Invalid hotspots response format");
        setHotspots([]);
      }

      if (categoriesResponse && categoriesResponse.success) {
        setCrimeCategories(categoriesResponse.data);
      } else {
        console.warn("Invalid categories response format");
        setCrimeCategories([]);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch analytics data", err);
      setError(`Failed to fetch analytics data: ${err.message || "Unknown error"}`);
      
      // Set default values if API fails
      setStats({
        totalComplaints: 0,
        activeSOS: 0,
        pendingComplaints: 0,
        avgResponseTime: 0,
      });
      setHotspots([]);
      setCrimeCategories([]);
    } finally {
      console.log("Data fetch completed, setting loading to false");
      setLoading(false);
    }
  };

  // Initial data fetch and set up refresh interval
  useEffect(() => {
    console.log("Component mounted, fetching data");
    fetchAnalyticsData();
    
    const intervalId = setInterval(fetchAnalyticsData, refreshInterval);
    
    return () => {
      console.log("Component unmounting, clearing interval");
      clearInterval(intervalId);
    };
  }, [refreshInterval]);

  // Handle manual refresh
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    fetchAnalyticsData();
  };

  // Calculate risk level based on crime count
  const getRiskLevel = (count) => {
    if (count >= 10) return 'high';
    if (count >= 5) return 'medium';
    return 'low';
  };

  // Debug state
  console.log("Current state:", { 
    loading, 
    error, 
    stats, 
    hotspots: hotspots.length, 
    crimeCategories: crimeCategories.length
  });

  // Always render the container, even during loading or error states
  return (
    <div className="analytics-dashboard-container">
      <div className="dashboard-header">
        <h1 className="analytics-title">Analytics Dashboard</h1>
        <div className="dashboard-controls">
          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button className="refresh-button" onClick={handleRefresh}>
            Refresh Data
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading analytics...</div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <div className="error-details">
            Please check your API connection and try again.
          </div>
          <button className="retry-button" onClick={handleRefresh}>Retry</button>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3 className="stat-title">Total Complaints</h3>
          <p className="stat-value">{stats.totalComplaints}</p>
          <div className="stat-icon">📋</div>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Avg. Response Time</h3>
          <p className="stat-value">{stats.avgResponseTime}h</p>
          <div className="stat-icon">⏱</div>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Pending Complaints</h3>
          <p className="stat-value">{stats.pendingComplaints}</p>
          <div className="stat-icon">⏳</div>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Active SOS</h3>
          <p className="stat-value">{stats.activeSOS}</p>
          <div className="stat-icon">🚨</div>
        </div>
      </div>

      <div className="analytics-content">
        <div className="chart-container">
          <h2 className="section-title">Top Crime Locations</h2>
          <div className="chart-placeholder">
            {hotspots.length > 0 ? (
              <ul className="hotspot-list">
                {hotspots.slice(0, 5).map((hotspot, index) => {
                  const riskLevel = getRiskLevel(hotspot.count);
                  return (
                    <li key={hotspot.id || index} className="hotspot-item">
                      <div className="location-details">
                        <div className="location-name">
                          <svg className="location-icon" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          {hotspot.address || `Location ${index + 1}`}
                          <span className={`location-badge ${riskLevel}-risk`}>
                            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                          </span>
                        </div>
                      </div>
                      <div className="crime-stats">
                        <span className="crime-count">
                          {hotspot.count} crimes
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="no-data">No crime hotspots data available</div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h2 className="section-title">Crime Categories</h2>
          <div className="chart-placeholder">
            {crimeCategories.length > 0 ? (
              <ul className="category-list">
                {crimeCategories.map((category, index) => (
                  <li key={index} className="category-item">
                    <span className="category-name">{category.name}</span>
                    <div className="category-bar">
                      <div 
                        className="category-fill" 
                        style={{ width: `${category.percent}%` }}
                      ></div>
                    </div>
                    <span className="category-percent">{category.percent}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-data">No category data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;