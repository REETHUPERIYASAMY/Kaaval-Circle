// src/components/police/AnalyticsDashboard.js
import React, { useState, useEffect } from "react";
import { getDashboardStats, getCrimeHotspots } from "../../services/api";
import "./AnalyticsDashboard.css";

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    activeSOS: 0,
    pendingComplaints: 0,
    avgResponseTime: 0,
  });
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({
    lat: 13.0827, // Chennai latitude
    lng: 80.2707, // Chennai longitude
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [statsResponse, hotspotsResponse] = await Promise.all([
          getDashboardStats(),
          getCrimeHotspots(mapCenter.lat, mapCenter.lng),
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (hotspotsResponse.success) {
          setHotspots(hotspotsResponse.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Sample Chennai crime hotspots data (in a real app, this would come from the API)
  const chennaiHotspots = [
    {
      id: 1,
      name: "T. Nagar",
      lat: 13.0413,
      lng: 80.2376,
      count: 45,
      risk: "high",
    },
    {
      id: 2,
      name: "Anna Nagar",
      lat: 13.087,
      lng: 80.2125,
      count: 32,
      risk: "medium",
    },
    {
      id: 3,
      name: "Adyar",
      lat: 13.0067,
      lng: 80.2594,
      count: 28,
      risk: "medium",
    },
    {
      id: 4,
      name: "Velachery",
      lat: 12.9815,
      lng: 80.2186,
      count: 25,
      risk: "medium",
    },
    {
      id: 5,
      name: "Mylapore",
      lat: 13.0339,
      lng: 80.2629,
      count: 18,
      risk: "low",
    },
    {
      id: 6,
      name: "Triplicane",
      lat: 13.0569,
      lng: 80.2794,
      count: 22,
      risk: "medium",
    },
    {
      id: 7,
      name: "Royapettah",
      lat: 13.0455,
      lng: 80.2629,
      count: 15,
      risk: "low",
    },
    {
      id: 8,
      name: "Kodambakkam",
      lat: 13.0453,
      lng: 80.2339,
      count: 35,
      risk: "high",
    },
  ];

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
            <div className="map-placeholder">
              <div className="map-overlay"></div>
              <div className="map-controls">
                <div className="map-control">+</div>
                <div className="map-control">-</div>
              </div>
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-color high-crime"></div>
                  <span>High Risk</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color medium-crime"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color low-crime"></div>
                  <span>Low Risk</span>
                </div>
              </div>
              <div className="map-attribution">
                © OpenStreetMap contributors
              </div>

              {/* Chennai Map with Hotspots */}
              <iframe
                title="Chennai Crime Hotspots Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, borderRadius: "8px" }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  mapCenter.lng - 0.2
                },${mapCenter.lat - 0.15},${mapCenter.lng + 0.2},${
                  mapCenter.lat + 0.15
                }&layer=mapnik&marker=${chennaiHotspots
                  .map((h) => `${h.lat},${h.lng}`)
                  .join("&marker=")}`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        <div className="analytics-charts">
          <div className="chart-container">
            <h2 className="section-title">Top Crime Locations</h2>
            <div className="chart-placeholder">
              <ul className="hotspot-list">
                {chennaiHotspots.slice(0, 5).map((hotspot, index) => (
                  <li key={index} className="hotspot-item">
                    <div className="location-details">
                      <div className="location-name">
                        <svg className="location-icon" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {hotspot.name}
                        <span className={`location-badge ${hotspot.risk}-risk`}>
                          {hotspot.risk}
                        </span>
                      </div>
                    </div>
                    <div className="crime-stats">
                      <span className="crime-count">
                        {hotspot.count} crimes
                      </span>
                      <div
                        className={`crime-trend trend-${
                          index % 3 === 0
                            ? "up"
                            : index % 3 === 1
                            ? "down"
                            : "stable"
                        }`}
                      >
                        {index % 3 === 0 ? "↑" : index % 3 === 1 ? "↓" : "→"}
                      </div>
                    </div>
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
