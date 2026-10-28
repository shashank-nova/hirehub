const { Job, Company, Application } = require('../models');

// @desc    Get all jobs with filtering and pagination
// @route   GET /api/v1/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { status: 'open' };

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filters
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    if (req.query.employmentType) {
      query.employmentType = req.query.employmentType;
    }

    if (req.query.experienceLevel) {
      query.experienceLevel = req.query.experienceLevel;
    }

    if (req.query.skills) {
      query.skills = { $in: req.query.skills.split(',') };
    }

    // Sort
    let sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') ? req.query.sort.substring(1) : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort = { createdAt: -1 };
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .populate('company', 'name logo location industry')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message,
    });
  }
};

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name email')
      .populate('company', 'name logo location industry website description');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message,
    });
  }
};

// @desc    Create new job
// @route   POST /api/v1/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res, next) => {
  try {
    // Check if user has a company profile
    const Company = require('../models').Company;
    let company = await Company.findOne({ recruiter: req.user._id });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Please create a company profile first',
      });
    }

    const job = await Job.create({
      ...req.body,
      recruiter: req.user._id,
      company: company._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message,
    });
  }
};

// @desc    Update job
// @route   PATCH /api/v1/jobs/:id
// @access  Private (Job owner only)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    // Prevent certain fields from being updated if job has applications
    const hasApplications = await Application.countDocuments({ job: job._id }) > 0;
    if (hasApplications && (req.body.title || req.body.company)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify title or company for jobs with existing applications',
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Job owner only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    // Check if job has applications
    const hasApplications = await Application.countDocuments({ job: job._id }) > 0;
    if (hasApplications) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete job with existing applications. Archive it instead.',
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message,
    });
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/v1/recruiter/jobs
// @access  Private (Recruiter only)
exports.getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error('Get recruiter jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recruiter jobs',
      error: error.message,
    });
  }
};
