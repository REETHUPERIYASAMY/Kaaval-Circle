// backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCrimeHotspots,
  getCrimeCategories,
  getMonthlyTrends
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('police'), getDashboardStats);
router.get('/hotspots', protect, authorize('police'), getCrimeHotspots);
router.get('/categories', protect, authorize('police'), getCrimeCategories);
router.get('/monthly-trends', protect, authorize('police'), getMonthlyTrends);

module.exports = router;