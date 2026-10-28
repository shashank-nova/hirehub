const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createOrUpdateCompany,
  getCompany,
  getCompanyById,
} = require('../controllers/companyController');

const router = express.Router();

// Create or update company
router.post('/', protect, authorize('recruiter'), createOrUpdateCompany);
router.patch('/', protect, authorize('recruiter'), createOrUpdateCompany);

// Get my company
router.get('/', protect, authorize('recruiter'), getCompany);

// Get company by ID (public)
router.get('/:id', getCompanyById);

module.exports = router;
