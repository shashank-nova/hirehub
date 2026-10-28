const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getSavedJobs,
  saveJob,
  removeSavedJob,
} = require('../controllers/savedJobController');

const router = express.Router();

// Get saved jobs
router.get('/', protect, authorize('candidate'), getSavedJobs);

// Save a job
router.post('/:jobId', protect, authorize('candidate'), saveJob);

// Remove saved job
router.delete('/:jobId', protect, authorize('candidate'), removeSavedJob);

module.exports = router;
