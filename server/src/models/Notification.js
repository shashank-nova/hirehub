const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['application', 'job', 'system', 'profile'],
    default: 'system',
  },
  relatedResource: {
    resourceType: {
      type: String,
      enum: ['Job', 'Application', 'User', 'Company'],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for filtering
notificationSchema.index({ recipient: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
