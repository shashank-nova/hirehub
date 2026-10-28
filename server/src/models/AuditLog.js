const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE',
      'UPDATE',
      'DELETE',
      'LOGIN',
      'LOGOUT',
      'REGISTER',
      'APPLY',
      'WITHDRAW',
      'STATUS_CHANGE',
      'MODERATE',
      'UPLOAD',
      'DOWNLOAD',
    ],
  },
  targetResource: {
    resourceType: {
      type: String,
      required: true,
      enum: ['User', 'Job', 'Application', 'Company', 'CandidateProfile', 'SavedJob', 'Notification'],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, {
  timestamps: true,
});

// Indexes for filtering
auditLogSchema.index({ actor: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ 'targetResource.resourceType': 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
