const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters'],
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'Withdrawn'],
    default: 'Applied',
  },
  recruiterNotes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters'],
  },
  statusHistory: [{
    status: {
      type: String,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
    },
  }],
}, {
  timestamps: true,
});

// Unique compound index to prevent duplicate applications
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

// Indexes for filtering
applicationSchema.index({ candidate: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });

// Pre-save middleware to add status to history
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
    });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
