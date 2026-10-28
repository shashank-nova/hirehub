const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getCandidateDashboard,
  getRecruiterDashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');

const router = express.Router();

// Candidate dashboard
router.get('/candidate', protect, authorize('candidate'), getCandidateDashboard);

// Recruiter dashboard
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterDashboard);

// Admin dashboard
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

module.exports = router;
