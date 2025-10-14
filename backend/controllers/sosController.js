// backend/controllers/sosController.js
const SOSAlert = require('../models/SOSAlert');

exports.createSOSAlert = async (req, res) => {
  try {
    const { location } = req.body;
    
    const sosAlert = new SOSAlert({
      citizenId: req.user.id,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
      },
    });

    await sosAlert.save();
    
    // Emit real-time alert to police dashboard
    req.app.get('io').emit('new-sos', sosAlert);
    
    res.status(201).json({
      success: true,
      data: sosAlert,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getSOSAlerts = async (req, res) => {
  try {
    const sosAlerts = await SOSAlert.find()
      .populate('citizenId', 'name phone address')
      .populate('respondingOfficer', 'name stationName');
    
    res.status(200).json({
      success: true,
      count: sosAlerts.length,
      data: sosAlerts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.updateSOSStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    let sosAlert = await SOSAlert.findById(req.params.id);
    
    if (!sosAlert) {
      return res.status(404).json({
        success: false,
        message: 'SOS Alert not found',
      });
    }
    
    sosAlert.status = status;
    
    if (status === 'Responding') {
      sosAlert.respondingOfficer = req.user.id;
    }
    
    sosAlert.updatedAt = Date.now();
    
    await sosAlert.save();
    
    // Emit real-time update
    req.app.get('io').emit('sos-status-update', sosAlert);
    
    res.status(200).json({
      success: true,
      data: sosAlert,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};