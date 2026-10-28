const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
  },
  skills: [{
    type: String,
    trim: true,
  }],
  education: [{
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    field: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
  }],
  experience: [{
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
  }],
  portfolioLinks: [{
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  }],
  resume: {
    filename: {
      type: String,
    },
    originalName: {
      type: String,
    },
    mimeType: {
      type: String,
    },
    size: {
      type: Number,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
});

// Index for user lookups
candidateProfileSchema.index({ user: 1 });

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
