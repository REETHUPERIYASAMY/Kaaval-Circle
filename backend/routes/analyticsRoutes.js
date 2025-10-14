// backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCrimeHotspots
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('police'), getDashboardStats);
router.get('/hotspots', protect, authorize('police'), getCrimeHotspots);

module.exports = router;