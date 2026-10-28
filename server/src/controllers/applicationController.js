const { Application, Job, User, CandidateProfile, Notification, AuditLog } = require('../models');

// @desc    Apply for a job
// @route   POST /api/v1/jobs/:id/applications
// @access  Private (Candidate only)
exports.applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This job is not accepting applications',
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: job._id,
      candidate: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    // Get candidate profile for resume
    const profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile || !profile.resume) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume before applying',
      });
    }

    // Create application
    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      resume: profile.resume,
      coverLetter: req.body.coverLetter,
    });

    // Update job application count
    await job.updateApplicationCount();

    // Create notification for recruiter
    await Notification.create({
      recipient: job.recruiter,
      title: 'New Application',
      message: `${req.user.name} has applied for ${job.title}`,
      type: 'application',
      relatedResource: {
        resourceType: 'Application',
        resourceId: application._id,
      },
    });

    // Create audit log
    await AuditLog.create({
      actor: req.user._id,
      action: 'APPLY',
      targetResource: {
        resourceType: 'Application',
        resourceId: application._id,
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message,
    });
  }
};

// @desc    Get candidate's applications
// @route   GET /api/v1/applications/me
// @access  Private (Candidate only)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title location employmentType salaryRange company')
      .populate('job.company', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
};

// @desc    Get applications for a job (recruiter only)
// @route   GET /api/v1/jobs/:id/applications
// @access  Private (Job owner only)
exports.getJobApplications = async (req, res, next) => {
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
        message: 'Not authorized to view applications for this job',
      });
    }

    const applications = await Application.find({ job: job._id })
      .populate('candidate', 'name email')
      .populate({
        path: 'candidate',
        populate: {
          path: 'profile',
          model: 'CandidateProfile',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
};

// @desc    Update application status
// @route   PATCH /api/v1/applications/:id/status
// @access  Private (Recruiter only)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    // Update status
    application.status = status;
    if (notes) {
      application.recruiterNotes = notes;
    }

    // Add to status history
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user._id,
      notes,
    });

    await application.save();

    // Create notification for candidate
    await Notification.create({
      recipient: application.candidate,
      title: 'Application Status Updated',
      message: `Your application for ${application.job.title} is now ${status}`,
      type: 'application',
      relatedResource: {
        resourceType: 'Application',
        resourceId: application._id,
      },
    });

    // Create audit log
    await AuditLog.create({
      actor: req.user._id,
      action: 'STATUS_CHANGE',
      targetResource: {
        resourceType: 'Application',
        resourceId: application._id,
      },
      metadata: { status, notes },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: application,
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message,
    });
  }
};

// @desc    Withdraw application
// @route   POST /api/v1/applications/:id/withdraw
// @access  Private (Candidate only)
exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership
    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application',
      });
    }

    // Check if withdrawal is allowed
    if (['Selected', 'Rejected'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw an application that has been finalized',
      });
    }

    application.status = 'Withdrawn';
    await application.save();

    // Create audit log
    await AuditLog.create({
      actor: req.user._id,
      action: 'WITHDRAW',
      targetResource: {
        resourceType: 'Application',
        resourceId: application._id,
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
      data: application,
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error withdrawing application',
      error: error.message,
    });
  }
};
