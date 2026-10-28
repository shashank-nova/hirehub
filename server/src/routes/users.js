const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  updateProfile,
  getCandidateProfile,
  uploadResumeHandler,
  uploadResume,
  handleUploadError,
  downloadResume,
} = require('../controllers/userController');

const router = express.Router();

// Update profile
router.patch('/me', protect, updateProfile);

// Get candidate profile
router.get('/candidates/:id', protect, getCandidateProfile);

// Upload resume
router.post(
  '/candidates/resume',
  protect,
  authorize('candidate'),
  uploadResume,
  handleUploadError,
  uploadResumeHandler
);

// Download resume
router.get('/candidates/:id/resume', protect, downloadResume);

module.exports = router;
