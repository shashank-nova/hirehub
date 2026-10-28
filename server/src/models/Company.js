const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
    maxlength: [200, 'Company name cannot be more than 200 characters'],
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  website: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please provide a valid website URL',
    ],
  },
  logo: {
    type: String,
  },
  industry: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
  },
}, {
  timestamps: true,
});

// Index for recruiter lookups
companySchema.index({ recruiter: 1 });

module.exports = mongoose.model('Company', companySchema);
