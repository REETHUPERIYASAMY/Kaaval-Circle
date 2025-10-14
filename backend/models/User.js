// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true,
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  age: {
    type: Number,
    required: [true, 'Please add age'],
  },
  aadharNo: {
    type: String,
    required: [true, 'Please add Aadhar number'],
    unique: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please specify gender'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    select: false,
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  userType: {
    type: String,
    enum: ['citizen', 'police'],
    required: true,
  },
  // Police specific fields
  stationName: {
    type: String,
  },
  batchNo: {
    type: String,
  },
  email: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);