const { User, CandidateProfile } = require('../models');
const { uploadResume, handleUploadError } = require('../middleware/upload');

// @desc    Update user profile
// @route   PATCH /api/v1/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, bio, skills, education, experience, portfolioLinks } = req.body;

    // Update user basic info
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    await user.save();

    // Update or create candidate profile
    let profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await CandidateProfile.create({
        user: req.user._id,
        phone,
        location,
        bio,
        skills: skills || [],
        education: education || [],
        experience: experience || [],
        portfolioLinks: portfolioLinks || [],
      });
    } else {
      if (phone !== undefined) profile.phone = phone;
      if (location !== undefined) profile.location = location;
      if (bio !== undefined) profile.bio = bio;
      if (skills !== undefined) profile.skills = skills;
      if (education !== undefined) profile.education = education;
      if (experience !== undefined) profile.experience = experience;
      if (portfolioLinks !== undefined) profile.portfolioLinks = portfolioLinks;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user, profile },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// @desc    Get candidate profile
// @route   GET /api/v1/candidates/:id
// @access  Private
exports.getCandidateProfile = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.params.id })
      .populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Only show full profile to the owner or recruiters who have received applications
    const isOwner = profile.user._id.toString() === req.user._id.toString();
    const isRecruiter = req.user.role === 'recruiter';

    if (!isOwner && !isRecruiter) {
      // Return limited profile
      const limitedProfile = {
        user: profile.user,
        skills: profile.skills,
        education: profile.education,
        experience: profile.experience,
      };
      return res.status(200).json({
        success: true,
        data: limitedProfile,
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get candidate profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// @desc    Upload resume
// @route   POST /api/v1/candidates/resume
// @access  Private (Candidate only)
exports.uploadResumeHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    let profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await CandidateProfile.create({
        user: req.user._id,
        resume: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          uploadedAt: new Date(),
        },
      });
    } else {
      profile.resume = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      };
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message,
    });
  }
};

// @desc    Download resume
// @route   GET /api/v1/candidates/:id/resume
// @access  Private (Authorized only)
exports.downloadResume = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.params.id });

    if (!profile || !profile.resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Check authorization
    const isOwner = profile.user.toString() === req.user._id.toString();
    const isRecruiter = req.user.role === 'recruiter';

    if (!isOwner && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this resume',
      });
    }

    const fs = require('fs');
    const path = require('path');
    const config = require('../config');

    const filePath = path.join(config.uploadDir, profile.resume.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found on server',
      });
    }

    res.download(filePath, profile.resume.originalName);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading resume',
      error: error.message,
    });
  }
};

// Export the upload middleware for use in routes
exports.uploadResume = uploadResume;
exports.handleUploadError = handleUploadError;
