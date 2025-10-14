// backend/controllers/analyticsController.js
const Complaint = require('../models/Complaint');
const SOSAlert = require('../models/SOSAlert');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const activeSOS = await SOSAlert.countDocuments({ status: 'Active' });
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    
    // Calculate average response time (in hours)
    const complaints = await Complaint.find({ status: 'Closed' });
    let totalResponseTime = 0;
    
    complaints.forEach(complaint => {
      const responseTime = (complaint.updatedAt - complaint.createdAt) / (1000 * 60 * 60);
      totalResponseTime += responseTime;
    });
    
    const avgResponseTime = complaints.length > 0 ? totalResponseTime / complaints.length : 0;
    
    res.status(200).json({
      success: true,
      data: {
        totalComplaints,
        activeSOS,
        pendingComplaints,
        avgResponseTime: avgResponseTime.toFixed(2)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getCrimeHotspots = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
          },
          $maxDistance: 10000 // 10km
        }
      }
    });
    
    // Group complaints by location to create hotspots
    const hotspots = {};
    
    complaints.forEach(complaint => {
      const key = `${complaint.location.coordinates[0]},${complaint.location.coordinates[1]}`;
      if (!hotspots[key]) {
        hotspots[key] = {
          coordinates: complaint.location.coordinates,
          address: complaint.location.address,
          count: 0,
          categories: {}
        };
      }
      hotspots[key].count++;
      if (!hotspots[key].categories[complaint.category]) {
        hotspots[key].categories[complaint.category] = 0;
      }
      hotspots[key].categories[complaint.category]++;
    });
    
    // Convert to array and sort by count
    const hotspotArray = Object.values(hotspots).sort((a, b) => b.count - a.count);
    
    res.status(200).json({
      success: true,
      data: hotspotArray
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};