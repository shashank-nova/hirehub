const { User, Job, AuditLog } = require('../models');

// @desc    Get all users with filtering
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// @desc    Update user status
// @route   PATCH /api/v1/admin/users/:id/status
// @access  Private (Admin only)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own status',
      });
    }

    user.status = status;
    await user.save();

    // Create audit log
    await AuditLog.create({
      actor: req.user._id,
      action: 'UPDATE',
      targetResource: {
        resourceType: 'User',
        resourceId: user._id,
      },
      metadata: { status },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'User status updated',
      data: user,
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message,
    });
  }
};

// @desc    Get all jobs for moderation
// @route   GET /api/v1/admin/jobs
// @access  Private (Admin only)
exports.getAllJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .populate('company', 'name')
      .sort({ createdAt: -1 })
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
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message,
    });
  }
};

// @desc    Moderate job (change status)
// @route   PATCH /api/v1/admin/jobs/:id/moderation
// @access  Private (Admin only)
exports.moderateJob = async (req, res, next) => {
  try {
    const { status, reason } = req.body;

    if (!['open', 'closed', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    job.status = status;
    await job.save();

    // Create audit log
    await AuditLog.create({
      actor: req.user._id,
      action: 'MODERATE',
      targetResource: {
        resourceType: 'Job',
        resourceId: job._id,
      },
      metadata: { status, reason },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Job moderated successfully',
      data: job,
    });
  } catch (error) {
    console.error('Moderate job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error moderating job',
      error: error.message,
    });
  }
};

// @desc    Get audit logs
// @route   GET /api/v1/admin/audit-logs
// @access  Private (Admin only)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.action) {
      query.action = req.query.action;
    }

    if (req.query.resourceType) {
      query['targetResource.resourceType'] = req.query.resourceType;
    }

    const logs = await AuditLog.find(query)
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs',
      error: error.message,
    });
  }
};

// @desc    Get analytics
// @route   GET /api/v1/admin/analytics
// @access  Private (Admin only)
exports.getAnalytics = async (req, res, next) => {
  try {
    const User = require('../models').User;
    const Job = require('../models').Job;
    const Application = require('../models').Application;

    // User growth over time (last 30 days)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Job postings over time
    const jobGrowth = await Job.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Application status distribution
    const applicationStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        jobGrowth,
        applicationStatus,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message,
    });
  }
};
