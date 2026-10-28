const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  updateUserStatus,
  getAllJobs,
  moderateJob,
  getAuditLogs,
  getAnalytics,
} = require('../controllers/adminController');

const router = express.Router();

// User management
router.get('/users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:id/status', protect, authorize('admin'), updateUserStatus);

// Job moderation
router.get('/jobs', protect, authorize('admin'), getAllJobs);
router.patch('/jobs/:id/moderation', protect, authorize('admin'), moderateJob);

// Audit logs
router.get('/audit-logs', protect, authorize('admin'), getAuditLogs);

// Analytics
router.get('/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;
