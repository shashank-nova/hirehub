const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');

const router = express.Router();

// Get notifications
router.get('/', protect, getNotifications);

// Mark as read
router.patch('/:id/read', protect, markAsRead);

// Mark all as read
router.patch('/read-all', protect, markAllAsRead);

module.exports = router;
