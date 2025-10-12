// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

// Auth Components
import CitizenRegister from './components/auth/CitizenRegister';
import CitizenLogin from './components/auth/CitizenLogin';
import PoliceRegister from './components/auth/PoliceRegister';
import PoliceLogin from './components/auth/PoliceLogin';

// Citizen Components
import CitizenDashboard from './components/citizen/CitizenDashboard';
import ReportCrime from './components/citizen/ReportCrime';
import ComplaintStatus from './components/citizen/ComplaintStatus';
import CitizenProfile from './components/citizen/CitizenProfile';
import SOSButton from './components/citizen/SOSButton';

// Police Components
import PoliceDashboard from './components/police/PoliceDashboard';
import ManageComplaints from './components/police/ManageComplaints';
import SOSAlerts from './components/police/SOSAlerts';
import CaseUpdates from './components/police/CaseUpdates';
import AnalyticsDashboard from './components/police/AnalyticsDashboard';

// Common Components
import LandingPage from './components/common/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Citizen Routes */}
          <Route path="/citizen-register" element={<CitizenRegister />} />
          <Route path="/citizen-login" element={<CitizenLogin />} />
          
          <Route 
            path="/citizen-dashboard" 
            element={
              <PrivateRoute userType="citizen">
                <CitizenDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/report-crime" 
            element={
              <PrivateRoute userType="citizen">
                <ReportCrime />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/complaint-status" 
            element={
              <PrivateRoute userType="citizen">
                <ComplaintStatus />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/citizen-profile" 
            element={
              <PrivateRoute userType="citizen">
                <CitizenProfile />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/sos" 
            element={
              <PrivateRoute userType="citizen">
                <SOSButton />
              </PrivateRoute>
            } 
          />
          
          {/* Police Routes */}
          <Route path="/police-register" element={<PoliceRegister />} />
          <Route path="/police-login" element={<PoliceLogin />} />
          
          <Route 
            path="/police-dashboard" 
            element={
              <PrivateRoute userType="police">
                <PoliceDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/manage-complaints" 
            element={
              <PrivateRoute userType="police">
                <ManageComplaints />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/sos-alerts" 
            element={
              <PrivateRoute userType="police">
                <SOSAlerts />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/case-updates" 
            element={
              <PrivateRoute userType="police">
                <CaseUpdates />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <PrivateRoute userType="police">
                <AnalyticsDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
