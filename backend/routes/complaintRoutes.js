// backend/routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('citizen'), createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .put(protect, authorize('police'), updateComplaintStatus);

module.exports = router;