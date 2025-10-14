// backend/models/SOSAlert.js
const mongoose = require('mongoose');

const SOSAlertSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
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
  status: {
    type: String,
    enum: ['Active', 'Responding', 'Resolved'],
    default: 'Active',
  },
  respondingOfficer: {
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

module.exports = mongoose.model('SOSAlert', SOSAlertSchema);