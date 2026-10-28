const { Company } = require('../models');

// @desc    Create or update company profile
// @route   POST /api/v1/company
// @route   PATCH /api/v1/company
// @access  Private (Recruiter only)
exports.createOrUpdateCompany = async (req, res, next) => {
  try {
    const { name, description, website, industry, location, size } = req.body;

    let company = await Company.findOne({ recruiter: req.user._id });

    if (company) {
      // Update existing
      if (name) company.name = name;
      if (description !== undefined) company.description = description;
      if (website !== undefined) company.website = website;
      if (industry !== undefined) company.industry = industry;
      if (location !== undefined) company.location = location;
      if (size !== undefined) company.size = size;
      await company.save();

      res.status(200).json({
        success: true,
        message: 'Company profile updated successfully',
        data: company,
      });
    } else {
      // Create new
      company = await Company.create({
        recruiter: req.user._id,
        name,
        description,
        website,
        industry,
        location,
        size,
      });

      res.status(201).json({
        success: true,
        message: 'Company profile created successfully',
        data: company,
      });
    }
  } catch (error) {
    console.error('Create/update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving company profile',
      error: error.message,
    });
  }
};

// @desc    Get company profile
// @route   GET /api/v1/company
// @access  Private (Recruiter only)
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company profile',
      error: error.message,
    });
  }
};

// @desc    Get company by ID (public)
// @route   GET /api/v1/companies/:id
// @access  Public
exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('recruiter', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Get company by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company',
      error: error.message,
    });
  }
};
