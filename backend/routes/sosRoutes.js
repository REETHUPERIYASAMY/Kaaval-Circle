// backend/routes/sosRoutes.js
const express = require('express');
const router = express.Router();
const {
  createSOSAlert,
  getSOSAlerts,
  updateSOSStatus
} = require('../controllers/sosController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('citizen'), createSOSAlert)
  .get(protect, authorize('police'), getSOSAlerts);

router.route('/:id')
  .put(protect, authorize('police'), updateSOSStatus);

module.exports = router;