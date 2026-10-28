const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters'],
  },
  requirements: {
    type: String,
    required: [true, 'Please provide job requirements'],
    maxlength: [5000, 'Requirements cannot be more than 5000 characters'],
  },
  skills: [{
    type: String,
    trim: true,
  }],
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    required: [true, 'Please provide employment type'],
  },
  experienceLevel: {
    type: String,
    enum: ['Entry-level', 'Mid-level', 'Senior', 'Executive', 'Intern'],
    required: [true, 'Please provide experience level'],
  },
  salaryRange: {
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'closed', 'archived'],
    default: 'draft',
  },
  deadline: {
    type: Date,
  },
  applicationCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes for job search
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ employmentType: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ recruiter: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ deadline: 1 });

// Update application count when applications are added/removed
jobSchema.methods.updateApplicationCount = async function() {
  const Application = mongoose.model('Application');
  const count = await Application.countDocuments({ job: this._id });
  this.applicationCount = count;
  await this.save();
};

module.exports = mongoose.model('Job', jobSchema);
