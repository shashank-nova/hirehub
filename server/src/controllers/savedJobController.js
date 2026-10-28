const { SavedJob, Job } = require('../models');

// @desc    Get saved jobs
// @route   GET /api/v1/saved-jobs
// @access  Private (Candidate only)
exports.getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ candidate: req.user._id })
      .populate('job')
      .populate('job.company', 'name logo location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      data: savedJobs,
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved jobs',
      error: error.message,
    });
  }
};

// @desc    Save a job
// @route   POST /api/v1/saved-jobs/:jobId
// @access  Private (Candidate only)
exports.saveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if already saved
    const existing = await SavedJob.findOne({
      candidate: req.user._id,
      job: req.params.jobId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Job already saved',
      });
    }

    const savedJob = await SavedJob.create({
      candidate: req.user._id,
      job: req.params.jobId,
    });

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: savedJob,
    });
  } catch (error) {
    console.error('Save job error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Job already saved',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error saving job',
      error: error.message,
    });
  }
};

// @desc    Remove saved job
// @route   DELETE /api/v1/saved-jobs/:jobId
// @access  Private (Candidate only)
exports.removeSavedJob = async (req, res, next) => {
  try {
    const savedJob = await SavedJob.findOne({
      candidate: req.user._id,
      job: req.params.jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found',
      });
    }

    await savedJob.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job removed from saved',
      data: {},
    });
  } catch (error) {
    console.error('Remove saved job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing saved job',
      error: error.message,
    });
  }
};
