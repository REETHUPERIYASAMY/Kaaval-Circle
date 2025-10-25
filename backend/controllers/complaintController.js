// backend/controllers/complaintController.js
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const generatePDF = require('../utils/generatePDF');
const path = require('path');
const fs = require('fs');

exports.createComplaint = async (req, res) => {
  try {
    console.log('Creating complaint with data:', req.body);

    const { description, category, location, evidence } = req.body;

    // Validate required fields
    if (!description || !category || !location || !location.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: description, category, location with address',
      });
    }

    // Validate location coordinates
    if (!location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid location coordinates (latitude and longitude)',
      });
    }

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Process evidence if it exists
    let processedEvidence = [];
    if (evidence && evidence.length > 0) {
      console.log("Processing evidence:", evidence);
      
      // If evidence is an array of base64 strings
      processedEvidence = evidence.map(item => {
        // If it's already a data URL, store as is
        if (item.startsWith('data:')) {
          return item;
        }
        
        // If it's just base64 data, try to determine the type
        const signature = item.substring(0, 20).toLowerCase();
        let imageType = 'jpeg'; // default
        
        if (signature.includes('ivbor') || signature.includes('png')) {
          imageType = 'png';
        } else if (signature.includes('qk2') || signature.includes('bmp')) {
          imageType = 'bmp';
        } else if (signature.includes('webp')) {
          imageType = 'webp';
        }
        
        return `data:image/${imageType};base64,${item}`;
      });
      
      console.log("Processed evidence:", processedEvidence);
    }

    const complaint = new Complaint({
      citizenId: req.user.id,
      description,
      category,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
      },
      evidence: processedEvidence,
    });

    console.log('Saving complaint to database...');
    await complaint.save();
    console.log('Complaint saved successfully');

    // Populate citizen details before returning
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('citizenId', 'name phone address');

    console.log('Generating PDF...');
    // Generate PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generatePDF(populatedComplaint);
      console.log('PDF generated successfully');
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      // If PDF generation fails, we still want to save the complaint but inform the user
      return res.status(201).json({
        success: true,
        data: populatedComplaint,
        pdf: null,
        warning: 'Complaint saved successfully but PDF generation failed. Please try downloading later.'
      });
    }

    // Return inline base64
    return res.status(201).json({
      success: true,
      data: populatedComplaint,
      pdf: pdfBuffer.toString('base64'),
    });

  } catch (err) {
    console.error('Error creating complaint:', err);

    // Handle specific errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error: ' + err.message,
    });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.userType === 'citizen') {
      complaints = await Complaint.find({ citizenId: req.user.id })
        .populate('assignedTo', 'name stationName');
    } else {
      complaints = await Complaint.find()
        .populate('citizenId', 'name phone address')
        .populate('assignedTo', 'name stationName');
    }

    console.log("Retrieved complaints:", complaints.length);
    complaints.forEach(complaint => {
      console.log(`Complaint ${complaint._id} has evidence:`, complaint.evidence ? complaint.evidence.length : 0);
    });

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

    // Populate details before returning
    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('citizenId', 'name phone address')
      .populate('assignedTo', 'name stationName');

    res.status(200).json({
      success: true,
      data: updatedComplaint,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};