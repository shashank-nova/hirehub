const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
} = require('../controllers/jobController');

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.post('/', protect, authorize('recruiter'), createJob);
router.patch('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

// Recruiter routes
router.get('/recruiter/jobs', protect, authorize('recruiter'), getRecruiterJobs);

module.exports = router;
