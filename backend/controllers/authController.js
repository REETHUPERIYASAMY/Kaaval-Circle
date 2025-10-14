// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      age,
      aadharNo,
      gender,
      password,
      userType,
      stationName,
      batchNo,
      email,
    } = req.body;

    // Check if user exists
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this phone number',
      });
    }

    // Create user
    user = new User({
      name,
      phone,
      address,
      age,
      aadharNo,
      gender,
      password,
      userType,
    });

    // Add police specific fields if userType is police
    if (userType === 'police') {
      user.stationName = stationName;
      user.batchNo = batchNo;
      user.email = email;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Create JWT
    const payload = {
      id: user.id,
      userType: user.userType,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          token,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password, userType } = req.body;

    // Check if user exists
    let user;
    if (userType === 'citizen') {
      user = await User.findOne({ name: identifier, userType: 'citizen' });
    } else {
      user = await User.findOne({ batchNo: identifier, userType: 'police' });
    }

    console.log("Login data:", req.body);
    console.log("Found user:", user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Create JWT
    const payload = {
      id: user.id,
      userType: user.userType,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          success: true,
          token,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};