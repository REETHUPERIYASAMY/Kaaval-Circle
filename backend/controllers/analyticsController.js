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
          id: key,
          lat: complaint.location.coordinates[1],
          lng: complaint.location.coordinates[0],
          address: complaint.location.address || `Location ${Object.keys(hotspots).length + 1}`,
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

exports.getCrimeCategories = async (req, res) => {
  try {
    const categories = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    
    const total = categories.reduce((sum, cat) => sum + cat.count, 0);
    
    const result = categories.map(cat => ({
      name: cat._id,
      percent: Math.round((cat.count / total) * 100)
    }));
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getMonthlyTrends = async (req, res) => {
  try {
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5); // Get last 6 months including current
    
    const monthlyTrends = await Complaint.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    const monthNames = ["January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"];
    
    // Create array of last 6 months
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.unshift({
        year: date.getFullYear(),
        month: date.getMonth() + 1, // +1 because getMonth() is 0-indexed
        monthName: monthNames[date.getMonth()]
      });
    }
    
    // Map monthly trends to months array
    const result = months.map(m => {
      const found = monthlyTrends.find(t => 
        t._id.year === m.year && t._id.month === m.month
      );
      return {
        month: m.monthName,
        count: found ? found.count : 0,
        current: m.year === currentDate.getFullYear() && m.month === currentDate.getMonth() + 1
      };
    });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};