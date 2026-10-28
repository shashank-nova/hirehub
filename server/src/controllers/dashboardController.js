const { User, Job, Application, Company, CandidateProfile } = require('../models');

// @desc    Get candidate dashboard stats
// @route   GET /api/v1/dashboard/candidate
// @access  Private (Candidate only)
exports.getCandidateDashboard = async (req, res, next) => {
  try {
    const applicationCount = await Application.countDocuments({
      candidate: req.user._id,
      status: { $ne: 'Withdrawn' },
    });

    const savedJobCount = await require('../models').SavedJob.countDocuments({
      candidate: req.user._id,
    });

    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title status')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate status breakdown
    const statusBreakdown = await Application.aggregate([
      { $match: { candidate: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalApplications: applicationCount,
          savedJobs: savedJobCount,
          statusBreakdown: statusBreakdown.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
        recentApplications: applications,
      },
    });
  } catch (error) {
    console.error('Get candidate dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};

// @desc    Get recruiter dashboard stats
// @route   GET /api/v1/dashboard/recruiter
// @access  Private (Recruiter only)
exports.getRecruiterDashboard = async (req, res, next) => {
  try {
    const jobCount = await Job.countDocuments({ recruiter: req.user._id });
    const openJobCount = await Job.countDocuments({
      recruiter: req.user._id,
      status: 'open',
    });

    const totalApplications = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'job',
          foreignField: '_id',
          as: 'job',
        },
      },
      { $unwind: '$job' },
      { $match: { 'job.recruiter': req.user._id } },
      { $count: 'total' },
    ]);

    const recentJobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get applications per job
    const jobApplicationStats = await Job.find({ recruiter: req.user._id })
      .select('title applicationCount');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalJobs: jobCount,
          openJobs: openJobCount,
          totalApplications: totalApplications[0]?.total || 0,
        },
        recentJobs,
        jobApplicationStats,
      },
    });
  } catch (error) {
    console.error('Get recruiter dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/v1/dashboard/admin
// @access  Private (Admin only)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    const companyCount = await Company.countDocuments();

    // User breakdown by role
    const userByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    // Job status breakdown
    const jobByStatus = await Job.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent users
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Recent jobs
    const recentJobs = await Job.find()
      .populate('recruiter', 'name')
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers: userCount,
          totalJobs: jobCount,
          totalApplications: applicationCount,
          totalCompanies: companyCount,
          userByRole: userByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          jobByStatus: jobByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
        recentUsers,
        recentJobs,
      },
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};
