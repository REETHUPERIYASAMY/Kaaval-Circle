// backend/controllers/complaintController.js
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const generatePDF = require('../utils/generatePDF');

exports.createComplaint = async (req, res) => {
  try {
    const { description, category, location, evidence } = req.body;
    
    const complaint = new Complaint({
      citizenId: req.user.id,
      description,
      category,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
      },
      evidence,
    });

    await complaint.save();
    
    // Generate PDF
    const pdfBuffer = await generatePDF(complaint);
    
    res.status(201).json({
      success: true,
      data: complaint,
      pdf: pdfBuffer.toString('base64'),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    let complaints;
    
    if (req.user.userType === 'citizen') {
      complaints = await Complaint.find({ citizenId: req.user.id }).populate('assignedTo', 'name stationName');
    } else {
      complaints = await Complaint.find().populate('citizenId', 'name phone address').populate('assignedTo', 'name stationName');
    }
    
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    let complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }
    
    complaint.status = status;
    complaint.assignedTo = req.user.id;
    complaint.updatedAt = Date.now();
    
    await complaint.save();
    
    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};