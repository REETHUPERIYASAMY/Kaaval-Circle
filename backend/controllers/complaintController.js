const Complaint = require("../models/Complaint");
const User = require("../models/User");
const generatePDF = require("../utils/generatePDF");
const fs = require("fs");
const path = require("path");

exports.createComplaint = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    
    const { description, category } = req.body;

    // Parse location from form-data
    const location = {
      address: req.body.address || req.body["location[address]"],
      latitude: parseFloat(req.body.latitude || req.body["location[latitude]"]),
      longitude: parseFloat(req.body.longitude || req.body["location[longitude]"])
    };

    if (!description || !category || !location.address) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields",
        received: { description, category, location }
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Save uploaded files
    let evidencePaths = [];
    if (req.files && req.files.length > 0) {
      evidencePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    const complaint = new Complaint({
      citizenId: req.user.id,
      description,
      category,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
        address: location.address
      },
      evidence: evidencePaths
    });

    await complaint.save();

    const populatedComplaint = await Complaint.findById(complaint._id).populate(
      "citizenId",
      "name phone address"
    );

    const pdfBuffer = await generatePDF(populatedComplaint);

    res.status(201).json({
      success: true,
      data: populatedComplaint,
      pdf: pdfBuffer.toString("base64")
    });

  } catch (err) {
    console.error("Error creating complaint:", err);
    res.status(500).json({ success: false, message: "Server Error: " + err.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizenId: req.user.id }).populate(
      "citizenId",
      "name phone address"
    );
    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

    complaint.status = status;
    complaint.assignedTo = req.user.id;
    complaint.updatedAt = Date.now();

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate("citizenId", "name phone address")
      .populate("assignedTo", "name stationName");

    res.status(200).json({ success: true, data: updatedComplaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};