const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');

const router = express.Router();

// Apply for job
router.post('/jobs/:id/applications', protect, authorize('candidate'), applyForJob);

// Get my applications
router.get('/applications/me', protect, authorize('candidate'), getMyApplications);

// Get job applications (recruiter)
router.get('/jobs/:id/applications', protect, authorize('recruiter'), getJobApplications);

// Update application status (recruiter)
router.patch('/applications/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

// Withdraw application (candidate)
router.post('/applications/:id/withdraw', protect, authorize('candidate'), withdrawApplication);

module.exports = router;
