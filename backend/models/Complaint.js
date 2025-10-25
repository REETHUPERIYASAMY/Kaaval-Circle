// backend/models/Complaint.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Theft',
      'Assault',
      'Vandalism',
      'Domestic Violence',
      'Fraud',
      'Harassment',
      'Missing Person',
      'Other',
    ],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  evidence: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Closed'],
    default: 'Pending',
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Geospatial index for location
ComplaintSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Complaint', ComplaintSchema);
