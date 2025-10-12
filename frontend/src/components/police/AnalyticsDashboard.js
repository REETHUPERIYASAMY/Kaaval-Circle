// src/components/police/AnalyticsDashboard.js
import React, { useState, useEffect } from 'react';
import { getDashboardStats, getCrimeHotspots } from '../../services/api';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    activeSOS: 0,
    pendingComplaints: 0,
    avgResponseTime: 0
  });
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({
    lat: 19.0760,
    lng: 72.8777
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [statsResponse, hotspotsResponse] = await Promise.all([
          getDashboardStats(),
          getCrimeHotspots(mapCenter.lat, mapCenter.lng)
        ]);
        
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
        
        if (hotspotsResponse.success) {
          setHotspots(hotspotsResponse.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard-container">
      <h1 className="analytics-title">Analytics Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3 className="stat-title">Total Complaints</h3>
          <p className="stat-value">{stats.totalComplaints}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Avg. Response Time</h3>
          <p className="stat-value">{stats.avgResponseTime}h</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Pending Complaints</h3>
          <p className="stat-value">{stats.pendingComplaints}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Active SOS</h3>
          <p className="stat-value">{stats.activeSOS}</p>
        </div>
      </div>
      
      <div className="analytics-content">
        <div className="analytics-map">
          <h2 className="section-title">Crime Hotspots</h2>
          <div className="map-container">
            {/* In a real app, this would be a Google Map */}
            <div className="map-placeholder">
              <p>Map would be displayed here</p>
              <p>Showing {hotspots.length} crime hotspots</p>
            </div>
          </div>
        </div>
        
        <div className="analytics-charts">
          <div className="chart-container">
            <h2 className="section-title">Top Crime Locations</h2>
            <div className="chart-placeholder">
              <ul className="hotspot-list">
                {hotspots.slice(0, 5).map((hotspot, index) => (
                  <li key={index} className="hotspot-item">
                    <span className="hotspot-location">
                      {hotspot.address || `Location ${index + 1}`}
                    </span>
                    <span className="hotspot-count">{hotspot.count} crimes</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="chart-container">
            <h2 className="section-title">Crime Categories</h2>
            <div className="chart-placeholder">
              <ul className="category-list">
                <li className="category-item">
                  <span className="category-name">Theft</span>
                  <span className="category-percent">40%</span>
                </li>
                <li className="category-item">
                  <span className="category-name">Assault</span>
                  <span className="category-percent">25%</span>
                </li>
                <li className="category-item">
                  <span className="category-name">Vandalism</span>
                  <span className="category-percent">15%</span>
                </li>
                <li className="category-item">
                  <span className="category-name">Domestic Violence</span>
                  <span className="category-percent">10%</span>
                </li>
                <li className="category-item">
                  <span className="category-name">Other</span>
                  <span className="category-percent">10%</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="chart-container">
            <h2 className="section-title">Monthly Trend</h2>
            <div className="chart-placeholder">
              <ul className="trend-list">
                <li className="trend-item">
                  <span className="trend-month">January</span>
                  <span className="trend-count">45 complaints</span>
                </li>
                <li className="trend-item">
                  <span className="trend-month">February</span>
                  <span className="trend-count">52 complaints</span>
                </li>
                <li className="trend-item">
                  <span className="trend-month">March</span>
                  <span className="trend-count">38 complaints</span>
                </li>
                <li className="trend-item">
                  <span className="trend-month">April</span>
                  <span className="trend-count">41 complaints</span>
                </li>
                <li className="trend-item">
                  <span className="trend-month">May</span>
                  <span className="trend-count">35 complaints (current)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;